import * as xmlbuilder from 'xmlbuilder';
import { validate } from 'joi';
import { v1 } from 'uuid';
import * as validation from './validation';
import { AuthControl } from './auth_control';
import { ControlFunction } from './control_function';
import { FUNCTION_NAMES } from './constants';
import * as requestUtil from './request';

class IntacctApi {
    endpoint = 'https://api.intacct.com/ia/xml/xmlgw.phtml'

    constructor(params) {
        const result = validate(params, validation.intacctConstructor);

        if (result.error) {
            throw result.error;
        }

        this.auth = new AuthControl(result.value.auth);
        this.assignControlId(result.value.controlId);
        this.uniqueId = result.value.uniqueId;
        this.dtdVersion = result.value.dtdVersion;
        this.timeout = result.value.timeout;
    }

    assignControlId(controlId = null) {
        if (controlId) {
            this.controlId = controlId;
        } else {
            this.controlId = v1();
        }
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

        requestUtil.createControl(this, root);

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

        return out.replace(/<password>(.+?)<\/password>/g, '<password>REDACTED</password>');
    }

    async request(controlFunctions) {
        if (!controlFunctions) {
            throw new Error('Must provide at least one control function.');
        }

        const funcHash = requestUtil.createHashOfControlFunctions(controlFunctions);
        const requestBody = this.createRequestBody(controlFunctions);

        const result = await requestUtil.post(this.endpoint, {
            payload: requestBody,
            headers: {
                'Content-Type': 'x-intacct-xml-request'
            }
        });

        let parsedPayload;
        const rawPayload = result.payload.toString();

        try {
            parsedPayload = await requestUtil.parseString(rawPayload);
        } catch (e) {
            console.log(e);
        }

        return {
            functions: funcHash,
            payload: parsedPayload,
            rawPayload
        };
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
