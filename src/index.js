import * as xmlbuilder from 'xmlbuilder';
import * as validation from './validation';
import { AuthControl } from './auth_control';
import { ControlFunction } from './control_function';
import { FUNCTION_NAMES } from './constants';
import { v1 } from 'uuid';

class IntacctApi {
    constructor(params) {
        if (params.auth) {
            this.auth = new AuthControl(params.auth);
        }

        this.assignControlId(params.controlId);
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
        let root = xmlbuilder.create('request', {version: '1.0', encoding: 'UTF-8', standalone: true});

        this.createControl(root);

        let operation = root.ele('operation');

        this.auth.toXML(operation);

        let content = operation.ele('content');

        controlFunctions.forEach((controlFunc) => {
            controlFunc.toXML(content);
        });

        return root.end();
    }

    createRequestBodyNoPasswords(controlFunctions) {
        let out = this.createRequestBody(controlFunctions);

        return out.replace(/<password>(.+)<\/password>/g, '<password>REDACTED</password>');
    }
}

function __createFactory(name) {
    return (params) => {
        return new ControlFunction(name, params);
    }
}

FUNCTION_NAMES.forEach((name) => {
    IntacctApi[name] = __createFactory(name);
});

export default {
    IntacctApi
};
