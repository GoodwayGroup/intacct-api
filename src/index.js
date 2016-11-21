import * as xmlbuilder from 'xmlbuilder';
import { validate } from 'joi';
import { v1 } from 'uuid';
import * as validation from './validation';
import { AuthControl } from './auth_control';
import { ControlFunction } from './control_function';
import { FUNCTION_NAMES } from './constants';

class IntacctApi {
    constructor(params) {
        const result = validate(params, validation.intacctConstructor);

        if (result.error) {
            throw result.error;
        }

        this.auth = new AuthControl(result.value.auth);
        this.assignControlId(result.value.controlId);
        this.uniqueId = result.value.uniqueId;
        this.dtdVersion = result.value.dtdVersion;
    }

    assignControlId(controlId = null) {
        if (controlId) {
            this.controlId = controlId;
        } else {
            this.controlId = v1();
        }
    }

    createControl(root) {
        return root.ele({
            control: {
                senderid: this.auth.senderId,
                password: this.auth.senderPassword,
                controlid: this.controlId,
                uniqueid: this.uniqueId.toString(),
                dtdversion: this.dtdVersion,
                includewhitespace: 'false'
            }
        });
    }

    createRequestBody(controlFunctions) {
        let funcs = controlFunctions;

        if (Array.isArray(funcs) === false) {
            funcs = [controlFunctions];
        }

        const root = xmlbuilder.create('request', {
            version: '1.0',
            encoding: 'UTF-8',
            standalone: true
        });

        this.createControl(root);

        const operation = root.ele('operation');

        this.auth.toXML(operation);

        const content = operation.ele('content');

        funcs.forEach((controlFunc) => {
            if (typeof controlFunc.toXML !== 'function') {
                throw new Error('Not a valid control function. Use the static methods to generate proper control functions.');
            }

            controlFunc.toXML(content);
        });

        return root.end();
    }

    createRequestBodyNoPasswords(controlFunctions) {
        const out = this.createRequestBody(controlFunctions);

        return out.replace(/<password>(.+)<\/password>/g, '<password>REDACTED</password>');
    }
}

function createFactory(name) {
    return function controlFunction(params, controlId) {
        return new ControlFunction(name, params, controlId);
    };
}

FUNCTION_NAMES.forEach((name) => {
    IntacctApi[name] = createFactory(name);
});

export default {
    IntacctApi
};
