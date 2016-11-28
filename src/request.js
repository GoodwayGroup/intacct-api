import Wreck from 'wreck';
import { parseString } from 'xml2js';
import { ControlFunction } from './control_function';

async function simpleWreckWrap(method, uri, options) {
    return await new Promise((resolve, reject) => {
        Wreck[method](uri, options, (err, res, payload) => {
            if (err) {
                const error = err;
                error.payload = payload;
                reject(error);
            } else {
                resolve({ res, payload });
            }
        });
    });
}

export default {
    createControl(self, root) {
        return root.ele({
            control: {
                senderid: self.auth.senderId,
                password: self.auth.senderPassword,
                controlid: self.controlId,
                uniqueid: self.uniqueId.toString(),
                dtdversion: self.dtdVersion,
                includewhitespace: 'false'
            }
        });
    },

    createHashOfControlFunctions(controlFunctions) {
        const result = {};
        let funcs;

        if (!Array.isArray(controlFunctions)) {
            funcs = [controlFunctions];
        } else {
            funcs = controlFunctions;
        }

        funcs.forEach((func) => {
            if ((func instanceof ControlFunction) === false) {
                throw new Error('Invalid control function given');
            }

            const id = func.controlId;

            if (result[id]) {
                throw new Error('Duplicate control id in control functions');
            } else {
                result[id] = func;
            }
        });

        return result;
    },

    async post(uri, options) {
        return await simpleWreckWrap('post', uri, options);
    },

    async parseString(xml, options = {}) {
        return await new Promise((resolve, reject) => {
            parseString(xml, options, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
};
