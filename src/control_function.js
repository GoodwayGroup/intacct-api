import { v1 } from 'uuid';
import { reach, transform } from 'hoek';
import * as parsers from './parser';
import { FUNCTION_PARAM_DEFAULTS } from './constants';

class ControlFunction {
    constructor(name, params = {}, controlId, parse = true) {
        if (!name) {
            throw new Error('Missing control function name');
        }

        this.name = name;
        this.parse = parse;

        if (FUNCTION_PARAM_DEFAULTS[name]) {
            this.parameters = Object.assign({}, FUNCTION_PARAM_DEFAULTS[name], params);
        } else {
            this.parameters = params;
        }

        this.assignControlId(controlId);
    }

    assignControlId(controlId = null) {
        if (controlId) {
            this.controlId = controlId;
        } else {
            this.controlId = v1();
        }
    }

    get(path) {
        if (!path) {
            return this.data;
        }

        return reach(this.data, path);
    }

    process(result) {
        this.result = transform(result, {
            status: 'status.0',
            function: 'function.0',
            controlid: 'controlid.0'
        });

        const overallStatus = this.result.status === 'success';

        if (!overallStatus) {
            this.result.errors = parsers.errormessage.call(this, result.errormessage);
        }

        if (overallStatus && this.parse && parsers[this.name]) {
            this.data = parsers[this.name].call(this, result.data);
        } else {
            this.data = result.data;
        }
    }

    isSuccessful() {
        if (this.result) {
            return this.result.status === 'success';
        }

        return false;
    }

    toXML(root) {
        const elements = {
            function: {
                '@controlid': this.controlId
            }
        };

        elements.function[this.name] = this.parameters;

        return root.ele(elements);
    }
}

export default {
    ControlFunction
};
