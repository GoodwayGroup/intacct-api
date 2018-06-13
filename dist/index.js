'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

var _xmlbuilder = require('xmlbuilder');

var xmlbuilder = _interopRequireWildcard(_xmlbuilder);

var _joi = require('joi');

var _uuid = require('uuid');

var _hoek = require('hoek');

var _validation = require('./validation');

var validation = _interopRequireWildcard(_validation);

var _auth_control = require('./auth_control');

var _control_function = require('./control_function');

var _constants = require('./constants');

var _request = require('./request');

var requestUtil = _interopRequireWildcard(_request);

var _parser = require('./parser');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const flatten = require('lodash.flatten');

function throwError(prefix, errorData) {
    const error = new Error(`${prefix}: ${errorData.errorno}: ${errorData.description}${errorData.description2}`);

    Object.assign(error, errorData);
    throw error;
}

class IntacctApi {

    constructor(params) {
        this.endpoint = 'https://api.intacct.com/ia/xml/xmlgw.phtml';

        const result = (0, _joi.validate)(params, validation.intacctConstructor);

        if (result.error) {
            throw result.error;
        }

        this.auth = new _auth_control.AuthControl(result.value.auth);
        this.assignControlId(result.value.controlId);
        this.uniqueId = result.value.uniqueId;
        this.dtdVersion = result.value.dtdVersion;
        this.timeout = result.value.timeout;
    }

    assignControlId() {
        let controlId = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        if (controlId) {
            this.controlId = controlId;
        } else {
            this.controlId = (0, _uuid.v1)();
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

        funcs.forEach(controlFunc => {
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

    request() {
        var _this = this;

        for (var _len = arguments.length, controlFunctions = Array(_len), _key = 0; _key < _len; _key++) {
            controlFunctions[_key] = arguments[_key];
        }

        return (0, _bluebird.coroutine)(function* () {
            if (!controlFunctions) {
                throw new Error('Must provide at least one control function.');
            }

            const ctrlFuncs = flatten(controlFunctions);
            const funcHash = requestUtil.createHashOfControlFunctions(ctrlFuncs);
            const requestBody = _this.createRequestBody(ctrlFuncs);

            const result = yield requestUtil.post(_this.endpoint, {
                payload: requestBody,
                headers: {
                    'Content-Type': 'x-intacct-xml-request'
                }
            });

            let parsedPayload;
            const rawPayload = result.payload.toString();

            try {
                parsedPayload = yield requestUtil.parseString(rawPayload);
            } catch (e) {
                e.rawPayload = rawPayload;
                throw e;
            }

            const isControlSuccessful = (0, _hoek.reach)(parsedPayload, 'response.control.0.status.0') === 'success';

            if (!isControlSuccessful) {
                const authErrorData = (0, _parser.errormessage)((0, _hoek.reach)(parsedPayload, 'response.errormessage'))[0];
                throwError('Request Error', authErrorData);
            }

            const isAuthenticated = (0, _hoek.reach)(parsedPayload, 'response.operation.0.authentication.0.status.0') === 'success';

            if (!isAuthenticated) {
                const authErrorData = (0, _parser.errormessage)((0, _hoek.reach)(parsedPayload, 'response.operation.0.errormessage.0'))[0];
                throwError('Auth Error', authErrorData);
            }

            const results = (0, _hoek.reach)(parsedPayload, 'response.operation.0.result');

            if (Array.isArray(results)) {
                results.forEach(function (resFunc) {
                    funcHash[resFunc.controlid[0]].process(resFunc);
                });
            }

            return {
                functions: funcHash,
                payload: parsedPayload,
                rawPayload: rawPayload
            };
        })();
    }
}

function createFactory(name) {
    return function controlFunction(params, controlId) {
        return new _control_function.ControlFunction(name, params, controlId);
    };
}

_constants.FUNCTION_NAMES.forEach(name => {
    IntacctApi[name] = createFactory(name);
});

IntacctApi.readMore = (params, controlId) => {
    if (params instanceof _control_function.ControlFunction) {
        const resultId = (0, _hoek.reach)(params, 'data.$.resultId');

        if (params.isSuccessful() && resultId) {
            // do something great
            return new _control_function.ControlFunction('readMore', { resultId: resultId }, controlId);
        }
        throw new Error('ControlFunction passed to readMore is not in a success state or doesn\'t have a resultId');
    }

    return new _control_function.ControlFunction('readMore', params, controlId);
};

exports.default = {
    IntacctApi: IntacctApi,
    ControlFunction: _control_function.ControlFunction
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ4bWxidWlsZGVyIiwidmFsaWRhdGlvbiIsInJlcXVlc3RVdGlsIiwiZmxhdHRlbiIsInJlcXVpcmUiLCJ0aHJvd0Vycm9yIiwicHJlZml4IiwiZXJyb3JEYXRhIiwiZXJyb3IiLCJFcnJvciIsImVycm9ybm8iLCJkZXNjcmlwdGlvbiIsImRlc2NyaXB0aW9uMiIsIk9iamVjdCIsImFzc2lnbiIsIkludGFjY3RBcGkiLCJjb25zdHJ1Y3RvciIsInBhcmFtcyIsImVuZHBvaW50IiwicmVzdWx0IiwiaW50YWNjdENvbnN0cnVjdG9yIiwiYXV0aCIsInZhbHVlIiwiYXNzaWduQ29udHJvbElkIiwiY29udHJvbElkIiwidW5pcXVlSWQiLCJkdGRWZXJzaW9uIiwidGltZW91dCIsImNyZWF0ZVJlcXVlc3RCb2R5IiwiY29udHJvbEZ1bmN0aW9ucyIsImZ1bmNzIiwiQXJyYXkiLCJpc0FycmF5Iiwicm9vdCIsImNyZWF0ZSIsInZlcnNpb24iLCJlbmNvZGluZyIsInN0YW5kYWxvbmUiLCJjcmVhdGVDb250cm9sIiwib3BlcmF0aW9uIiwiZWxlIiwidG9YTUwiLCJjb250ZW50IiwiZm9yRWFjaCIsImNvbnRyb2xGdW5jIiwiZW5kIiwiY3JlYXRlUmVxdWVzdEJvZHlOb1Bhc3N3b3JkcyIsIm91dCIsInJlcGxhY2UiLCJyZXF1ZXN0IiwiY3RybEZ1bmNzIiwiZnVuY0hhc2giLCJjcmVhdGVIYXNoT2ZDb250cm9sRnVuY3Rpb25zIiwicmVxdWVzdEJvZHkiLCJwb3N0IiwicGF5bG9hZCIsImhlYWRlcnMiLCJwYXJzZWRQYXlsb2FkIiwicmF3UGF5bG9hZCIsInRvU3RyaW5nIiwicGFyc2VTdHJpbmciLCJlIiwiaXNDb250cm9sU3VjY2Vzc2Z1bCIsImF1dGhFcnJvckRhdGEiLCJpc0F1dGhlbnRpY2F0ZWQiLCJyZXN1bHRzIiwicmVzRnVuYyIsImNvbnRyb2xpZCIsInByb2Nlc3MiLCJmdW5jdGlvbnMiLCJjcmVhdGVGYWN0b3J5IiwibmFtZSIsImNvbnRyb2xGdW5jdGlvbiIsInJlYWRNb3JlIiwicmVzdWx0SWQiLCJpc1N1Y2Nlc3NmdWwiLCJDb250cm9sRnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7O0lBQVlBLFU7O0FBQ1o7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBQVlDLFU7O0FBQ1o7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBQVlDLFc7O0FBQ1o7Ozs7QUFFQSxNQUFNQyxVQUFVQyxRQUFRLGdCQUFSLENBQWhCOztBQUVBLFNBQVNDLFVBQVQsQ0FBb0JDLE1BQXBCLEVBQTRCQyxTQUE1QixFQUF1QztBQUNuQyxVQUFNQyxRQUFRLElBQUlDLEtBQUosQ0FBVyxHQUFFSCxNQUFPLEtBQUlDLFVBQVVHLE9BQVEsS0FBSUgsVUFBVUksV0FBWSxHQUFFSixVQUFVSyxZQUFhLEVBQTdGLENBQWQ7O0FBRUFDLFdBQU9DLE1BQVAsQ0FBY04sS0FBZCxFQUFxQkQsU0FBckI7QUFDQSxVQUFNQyxLQUFOO0FBQ0g7O0FBRUQsTUFBTU8sVUFBTixDQUFpQjs7QUFHYkMsZ0JBQVlDLE1BQVosRUFBb0I7QUFBQSxhQUZwQkMsUUFFb0IsR0FGVCw0Q0FFUzs7QUFDaEIsY0FBTUMsU0FBUyxtQkFBU0YsTUFBVCxFQUFpQmhCLFdBQVdtQixrQkFBNUIsQ0FBZjs7QUFFQSxZQUFJRCxPQUFPWCxLQUFYLEVBQWtCO0FBQ2Qsa0JBQU1XLE9BQU9YLEtBQWI7QUFDSDs7QUFFRCxhQUFLYSxJQUFMLEdBQVksOEJBQWdCRixPQUFPRyxLQUFQLENBQWFELElBQTdCLENBQVo7QUFDQSxhQUFLRSxlQUFMLENBQXFCSixPQUFPRyxLQUFQLENBQWFFLFNBQWxDO0FBQ0EsYUFBS0MsUUFBTCxHQUFnQk4sT0FBT0csS0FBUCxDQUFhRyxRQUE3QjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JQLE9BQU9HLEtBQVAsQ0FBYUksVUFBL0I7QUFDQSxhQUFLQyxPQUFMLEdBQWVSLE9BQU9HLEtBQVAsQ0FBYUssT0FBNUI7QUFDSDs7QUFFREosc0JBQWtD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QXBCLEVBQWdDLEVBQUVBLGtCQUFGLEVBQWhDLEVBQThDbEQsU0FBOUMsQ0FBUDtBQUNIO0FBQ0QsY0FBTSxJQUFJZixLQUFKLENBQVUsMEZBQVYsQ0FBTjtBQUNIOztBQUVELFdBQU8sc0NBQW9CLFVBQXBCLEVBQWdDUSxNQUFoQyxFQUF3Q08sU0FBeEMsQ0FBUDtBQUNILENBWkQ7O2tCQWNlO0FBQ1hULDBCQURXO0FBRVg2RDtBQUZXLEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB4bWxidWlsZGVyIGZyb20gJ3htbGJ1aWxkZXInO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICdqb2knO1xuaW1wb3J0IHsgdjEgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHJlYWNoIH0gZnJvbSAnaG9layc7XG5pbXBvcnQgKiBhcyB2YWxpZGF0aW9uIGZyb20gJy4vdmFsaWRhdGlvbic7XG5pbXBvcnQgeyBBdXRoQ29udHJvbCB9IGZyb20gJy4vYXV0aF9jb250cm9sJztcbmltcG9ydCB7IENvbnRyb2xGdW5jdGlvbiB9IGZyb20gJy4vY29udHJvbF9mdW5jdGlvbic7XG5pbXBvcnQgeyBGVU5DVElPTl9OQU1FUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCAqIGFzIHJlcXVlc3RVdGlsIGZyb20gJy4vcmVxdWVzdCc7XG5pbXBvcnQgeyBlcnJvcm1lc3NhZ2UgfSBmcm9tICcuL3BhcnNlcic7XG5cbmNvbnN0IGZsYXR0ZW4gPSByZXF1aXJlKCdsb2Rhc2guZmxhdHRlbicpO1xuXG5mdW5jdGlvbiB0aHJvd0Vycm9yKHByZWZpeCwgZXJyb3JEYXRhKSB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoYCR7cHJlZml4fTogJHtlcnJvckRhdGEuZXJyb3Jub306ICR7ZXJyb3JEYXRhLmRlc2NyaXB0aW9ufSR7ZXJyb3JEYXRhLmRlc2NyaXB0aW9uMn1gKTtcblxuICAgIE9iamVjdC5hc3NpZ24oZXJyb3IsIGVycm9yRGF0YSk7XG4gICAgdGhyb3cgZXJyb3I7XG59XG5cbmNsYXNzIEludGFjY3RBcGkge1xuICAgIGVuZHBvaW50ID0gJ2h0dHBzOi8vYXBpLmludGFjY3QuY29tL2lhL3htbC94bWxndy5waHRtbCdcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0ZShwYXJhbXMsIHZhbGlkYXRpb24uaW50YWNjdENvbnN0cnVjdG9yKTtcblxuICAgICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF1dGggPSBuZXcgQXV0aENvbnRyb2wocmVzdWx0LnZhbHVlLmF1dGgpO1xuICAgICAgICB0aGlzLmFzc2lnbkNvbnRyb2xJZChyZXN1bHQudmFsdWUuY29udHJvbElkKTtcbiAgICAgICAgdGhpcy51bmlxdWVJZCA9IHJlc3VsdC52YWx1ZS51bmlxdWVJZDtcbiAgICAgICAgdGhpcy5kdGRWZXJzaW9uID0gcmVzdWx0LnZhbHVlLmR0ZFZlcnNpb247XG4gICAgICAgIHRoaXMudGltZW91dCA9IHJlc3VsdC52YWx1ZS50aW1lb3V0O1xuICAgIH1cblxuICAgIGFzc2lnbkNvbnRyb2xJZChjb250cm9sSWQgPSBudWxsKSB7XG4gICAgICAgIGlmIChjb250cm9sSWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbElkID0gY29udHJvbElkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sSWQgPSB2MSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUmVxdWVzdEJvZHkoY29udHJvbEZ1bmN0aW9ucykge1xuICAgICAgICBsZXQgZnVuY3MgPSBjb250cm9sRnVuY3Rpb25zO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGZ1bmNzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGZ1bmNzID0gW2NvbnRyb2xGdW5jdGlvbnNdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm9vdCA9IHhtbGJ1aWxkZXIuY3JlYXRlKCdyZXF1ZXN0Jywge1xuICAgICAgICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICAgICAgICBlbmNvZGluZzogJ1VURi04JyxcbiAgICAgICAgICAgIHN0YW5kYWxvbmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVxdWVzdFV0aWwuY3JlYXRlQ29udHJvbCh0aGlzLCByb290KTtcblxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSByb290LmVsZSgnb3BlcmF0aW9uJyk7XG5cbiAgICAgICAgdGhpcy5hdXRoLnRvWE1MKG9wZXJhdGlvbik7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IG9wZXJhdGlvbi5lbGUoJ2NvbnRlbnQnKTtcblxuICAgICAgICBmdW5jcy5mb3JFYWNoKChjb250cm9sRnVuYykgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb250cm9sRnVuYy50b1hNTCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQgY29udHJvbCBmdW5jdGlvbi4gVXNlIHRoZSBzdGF0aWMgbWV0aG9kcyB0byBnZW5lcmF0ZSBwcm9wZXIgY29udHJvbCBmdW5jdGlvbnMuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRyb2xGdW5jLnRvWE1MKGNvbnRlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcm9vdC5lbmQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVSZXF1ZXN0Qm9keU5vUGFzc3dvcmRzKGNvbnRyb2xGdW5jdGlvbnMpIHtcbiAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5jcmVhdGVSZXF1ZXN0Qm9keShjb250cm9sRnVuY3Rpb25zKTtcblxuICAgICAgICByZXR1cm4gb3V0LnJlcGxhY2UoLzxwYXNzd29yZD4oLis/KTxcXC9wYXNzd29yZD4vZywgJzxwYXNzd29yZD5SRURBQ1RFRDwvcGFzc3dvcmQ+Jyk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVxdWVzdCguLi5jb250cm9sRnVuY3Rpb25zKSB7XG4gICAgICAgIGlmICghY29udHJvbEZ1bmN0aW9ucykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgYXQgbGVhc3Qgb25lIGNvbnRyb2wgZnVuY3Rpb24uJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdHJsRnVuY3MgPSBmbGF0dGVuKGNvbnRyb2xGdW5jdGlvbnMpO1xuICAgICAgICBjb25zdCBmdW5jSGFzaCA9IHJlcXVlc3RVdGlsLmNyZWF0ZUhhc2hPZkNvbnRyb2xGdW5jdGlvbnMoY3RybEZ1bmNzKTtcbiAgICAgICAgY29uc3QgcmVxdWVzdEJvZHkgPSB0aGlzLmNyZWF0ZVJlcXVlc3RCb2R5KGN0cmxGdW5jcyk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVxdWVzdFV0aWwucG9zdCh0aGlzLmVuZHBvaW50LCB7XG4gICAgICAgICAgICBwYXlsb2FkOiByZXF1ZXN0Qm9keSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3gtaW50YWNjdC14bWwtcmVxdWVzdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IHBhcnNlZFBheWxvYWQ7XG4gICAgICAgIGNvbnN0IHJhd1BheWxvYWQgPSByZXN1bHQucGF5bG9hZC50b1N0cmluZygpO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwYXJzZWRQYXlsb2FkID0gYXdhaXQgcmVxdWVzdFV0aWwucGFyc2VTdHJpbmcocmF3UGF5bG9hZCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGUucmF3UGF5bG9hZCA9IHJhd1BheWxvYWQ7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNDb250cm9sU3VjY2Vzc2Z1bCA9IHJlYWNoKHBhcnNlZFBheWxvYWQsICdyZXNwb25zZS5jb250cm9sLjAuc3RhdHVzLjAnKSA9PT0gJ3N1Y2Nlc3MnO1xuXG4gICAgICAgIGlmICghaXNDb250cm9sU3VjY2Vzc2Z1bCkge1xuICAgICAgICAgICAgY29uc3QgYXV0aEVycm9yRGF0YSA9IGVycm9ybWVzc2FnZShyZWFjaChwYXJzZWRQYXlsb2FkLCAncmVzcG9uc2UuZXJyb3JtZXNzYWdlJykpWzBdO1xuICAgICAgICAgICAgdGhyb3dFcnJvcignUmVxdWVzdCBFcnJvcicsIGF1dGhFcnJvckRhdGEpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaXNBdXRoZW50aWNhdGVkID0gcmVhY2gocGFyc2VkUGF5bG9hZCwgJ3Jlc3BvbnNlLm9wZXJhdGlvbi4wLmF1dGhlbnRpY2F0aW9uLjAuc3RhdHVzLjAnKSA9PT0gJ3N1Y2Nlc3MnO1xuXG4gICAgICAgIGlmICghaXNBdXRoZW50aWNhdGVkKSB7XG4gICAgICAgICAgICBjb25zdCBhdXRoRXJyb3JEYXRhID0gZXJyb3JtZXNzYWdlKHJlYWNoKHBhcnNlZFBheWxvYWQsICdyZXNwb25zZS5vcGVyYXRpb24uMC5lcnJvcm1lc3NhZ2UuMCcpKVswXTtcbiAgICAgICAgICAgIHRocm93RXJyb3IoJ0F1dGggRXJyb3InLCBhdXRoRXJyb3JEYXRhKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdHMgPSByZWFjaChwYXJzZWRQYXlsb2FkLCAncmVzcG9uc2Uub3BlcmF0aW9uLjAucmVzdWx0Jyk7XG5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkocmVzdWx0cykpIHtcbiAgICAgICAgICAgIHJlc3VsdHMuZm9yRWFjaCgocmVzRnVuYykgPT4ge1xuICAgICAgICAgICAgICAgIGZ1bmNIYXNoW3Jlc0Z1bmMuY29udHJvbGlkWzBdXS5wcm9jZXNzKHJlc0Z1bmMpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnVuY3Rpb25zOiBmdW5jSGFzaCxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBhcnNlZFBheWxvYWQsXG4gICAgICAgICAgICByYXdQYXlsb2FkXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGYWN0b3J5KG5hbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gY29udHJvbEZ1bmN0aW9uKHBhcmFtcywgY29udHJvbElkKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29udHJvbEZ1bmN0aW9uKG5hbWUsIHBhcmFtcywgY29udHJvbElkKTtcbiAgICB9O1xufVxuXG5GVU5DVElPTl9OQU1FUy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgSW50YWNjdEFwaVtuYW1lXSA9IGNyZWF0ZUZhY3RvcnkobmFtZSk7XG59KTtcblxuSW50YWNjdEFwaS5yZWFkTW9yZSA9IChwYXJhbXMsIGNvbnRyb2xJZCkgPT4ge1xuICAgIGlmIChwYXJhbXMgaW5zdGFuY2VvZiBDb250cm9sRnVuY3Rpb24pIHtcbiAgICAgICAgY29uc3QgcmVzdWx0SWQgPSByZWFjaChwYXJhbXMsICdkYXRhLiQucmVzdWx0SWQnKTtcblxuICAgICAgICBpZiAocGFyYW1zLmlzU3VjY2Vzc2Z1bCgpICYmIHJlc3VsdElkKSB7XG4gICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgZ3JlYXRcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udHJvbEZ1bmN0aW9uKCdyZWFkTW9yZScsIHsgcmVzdWx0SWQgfSwgY29udHJvbElkKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRyb2xGdW5jdGlvbiBwYXNzZWQgdG8gcmVhZE1vcmUgaXMgbm90IGluIGEgc3VjY2VzcyBzdGF0ZSBvciBkb2VzblxcJ3QgaGF2ZSBhIHJlc3VsdElkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDb250cm9sRnVuY3Rpb24oJ3JlYWRNb3JlJywgcGFyYW1zLCBjb250cm9sSWQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIEludGFjY3RBcGksXG4gICAgQ29udHJvbEZ1bmN0aW9uXG59O1xuIl19