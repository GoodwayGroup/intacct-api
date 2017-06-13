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
                parsedPayload = JSON.parse(result.payload.toString());
            } catch (err) {
                // Errors come back in XML.
                try {
                    parsedPayload = yield requestUtil.parseString(rawPayload);
                    throwError('Request Error', (0, _parser.errormessage)((0, _hoek.reach)(parsedPayload, 'response.errormessage'))[0]);
                } catch (e) {
                    e.rawPayload = rawPayload;
                    throw e;
                }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJ4bWxidWlsZGVyIiwidmFsaWRhdGlvbiIsInJlcXVlc3RVdGlsIiwiZmxhdHRlbiIsInJlcXVpcmUiLCJ0aHJvd0Vycm9yIiwicHJlZml4IiwiZXJyb3JEYXRhIiwiZXJyb3IiLCJFcnJvciIsImVycm9ybm8iLCJkZXNjcmlwdGlvbiIsImRlc2NyaXB0aW9uMiIsIk9iamVjdCIsImFzc2lnbiIsIkludGFjY3RBcGkiLCJjb25zdHJ1Y3RvciIsInBhcmFtcyIsImVuZHBvaW50IiwicmVzdWx0IiwiaW50YWNjdENvbnN0cnVjdG9yIiwiYXV0aCIsInZhbHVlIiwiYXNzaWduQ29udHJvbElkIiwiY29udHJvbElkIiwidW5pcXVlSWQiLCJkdGRWZXJzaW9uIiwidGltZW91dCIsImNyZWF0ZVJlcXVlc3RCb2R5IiwiY29udHJvbEZ1bmN0aW9ucyIsImZ1bmNzIiwiQXJyYXkiLCJpc0FycmF5Iiwicm9vdCIsImNyZWF0ZSIsInZlcnNpb24iLCJlbmNvZGluZyIsInN0YW5kYWxvbmUiLCJjcmVhdGVDb250cm9sIiwib3BlcmF0aW9uIiwiZWxlIiwidG9YTUwiLCJjb250ZW50IiwiZm9yRWFjaCIsImNvbnRyb2xGdW5jIiwiZW5kIiwiY3JlYXRlUmVxdWVzdEJvZHlOb1Bhc3N3b3JkcyIsIm91dCIsInJlcGxhY2UiLCJyZXF1ZXN0IiwiY3RybEZ1bmNzIiwiZnVuY0hhc2giLCJjcmVhdGVIYXNoT2ZDb250cm9sRnVuY3Rpb25zIiwicmVxdWVzdEJvZHkiLCJwb3N0IiwicGF5bG9hZCIsImhlYWRlcnMiLCJwYXJzZWRQYXlsb2FkIiwicmF3UGF5bG9hZCIsInRvU3RyaW5nIiwiSlNPTiIsInBhcnNlIiwiZXJyIiwicGFyc2VTdHJpbmciLCJlIiwiZnVuY3Rpb25zIiwiY3JlYXRlRmFjdG9yeSIsIm5hbWUiLCJjb250cm9sRnVuY3Rpb24iLCJyZWFkTW9yZSIsInJlc3VsdElkIiwiaXNTdWNjZXNzZnVsIiwiQ29udHJvbEZ1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOztJQUFZQSxVOztBQUNaOztBQUNBOztBQUNBOztBQUNBOztJQUFZQyxVOztBQUNaOztBQUNBOztBQUNBOztBQUNBOztJQUFZQyxXOztBQUNaOzs7O0FBRUEsTUFBTUMsVUFBVUMsUUFBUSxnQkFBUixDQUFoQjs7QUFFQSxTQUFTQyxVQUFULENBQW9CQyxNQUFwQixFQUE0QkMsU0FBNUIsRUFBdUM7QUFDbkMsVUFBTUMsUUFBUSxJQUFJQyxLQUFKLENBQVcsR0FBRUgsTUFBTyxLQUFJQyxVQUFVRyxPQUFRLEtBQUlILFVBQVVJLFdBQVksR0FBRUosVUFBVUssWUFBYSxFQUE3RixDQUFkOztBQUVBQyxXQUFPQyxNQUFQLENBQWNOLEtBQWQsRUFBcUJELFNBQXJCO0FBQ0EsVUFBTUMsS0FBTjtBQUNIOztBQUVELE1BQU1PLFVBQU4sQ0FBaUI7O0FBR2JDLGdCQUFZQyxNQUFaLEVBQW9CO0FBQUEsYUFGcEJDLFFBRW9CLEdBRlQsNENBRVM7O0FBQ2hCLGNBQU1DLFNBQVMsbUJBQVNGLE1BQVQsRUFBaUJoQixXQUFXbUIsa0JBQTVCLENBQWY7O0FBRUEsWUFBSUQsT0FBT1gsS0FBWCxFQUFrQjtBQUNkLGtCQUFNVyxPQUFPWCxLQUFiO0FBQ0g7O0FBRUQsYUFBS2EsSUFBTCxHQUFZLDhCQUFnQkYsT0FBT0csS0FBUCxDQUFhRCxJQUE3QixDQUFaO0FBQ0EsYUFBS0UsZUFBTCxDQUFxQkosT0FBT0csS0FBUCxDQUFhRSxTQUFsQztBQUNBLGFBQUtDLFFBQUwsR0FBZ0JOLE9BQU9HLEtBQVAsQ0FBYUcsUUFBN0I7QUFDQSxhQUFLQyxVQUFMLEdBQWtCUCxPQUFPRyxLQUFQLENBQWFJLFVBQS9CO0FBQ0EsYUFBS0MsT0FBTCxHQUFlUixPQUFPRyxLQUFQLENBQWFLLE9BQTVCO0FBQ0g7O0FBRURKLHNCQUFrQztBQUFBLFlBQWxCQyxTQUFrQix5REFBTixJQUFNOztBQUM5QixZQUFJQSxTQUFKLEVBQWU7QUFDWCxpQkFBS0EsU0FBTCxHQUFpQkEsU0FBakI7QUFDSCxTQUZELE1BRU87QUFDSCxpQkFBS0EsU0FBTCxHQUFpQixlQUFqQjtBQUNIO0FBQ0o7O0FBRURJLHNCQUFrQkMsZ0JBQWxCLEVBQW9DO0FBQ2hDLFlBQUlDLFFBQVFELGdCQUFaOztBQUVBLFlBQUlFLE1BQU1DLE9BQU4sQ0FBY0YsS0FBZCxNQUF5QixLQUE3QixFQUFvQztBQUNoQ0Esb0JBQVEsQ0FBQ0QsZ0JBQUQsQ0FBUjtBQUNIOztBQUVELGNBQU1JLE9BQU9qQyxXQUFXa0MsTUFBWCxDQUFrQixTQUFsQixFQUE2QjtBQUN0Q0MscUJBQVMsS0FENkI7QUFFdENDLHNCQUFVLE9BRjRCO0FBR3RDQyx3QkFBWTtBQUgwQixTQUE3QixDQUFiOztBQU1BbkMsb0JBQVlvQyxhQUFaLENBQTBCLElBQTFCLEVBQWdDTCxJQUFoQzs7QUFFQSxjQUFNTSxZQUFZTixLQUFLTyxHQUFMLENBQVMsV0FBVCxDQUFsQjs7QUFFQSxhQUFLbkIsSUFBTCxDQUFVb0IsS0FBVixDQUFnQkYsU0FBaEI7O0FBRUEsY0FBTUcsVUFBVUgsVUFBVUMsR0FBVixDQUFjLFNBQWQsQ0FBaEI7O0FBRUFWLGNBQU1hLE9BQU4sQ0FBZUMsV0FBRCxJQUFpQjtBQUMzQixnQkFBSSxPQUFPQSxZQUFZSCxLQUFuQixLQUE2QixVQUFqQyxFQUE2QztBQUN6QyxzQkFBTSxJQUFJaEMsS0FBSixDQUFVLDRGQUFWLENBQU47QUFDSDs7QUFFRG1DLHdCQUFZSCxLQUFaLENBQWtCQyxPQUFsQjtBQUNILFNBTkQ7O0FBUUEsZUFBT1QsS0FBS1ksR0FBTCxFQUFQO0FBQ0g7O0FBRURDLGlDQUE2QmpCLGdCQUE3QixFQUErQztBQUMzQyxjQUFNa0IsTUFBTSxLQUFLbkIsaUJBQUwsQ0FBdUJDLGdCQUF2QixDQUFaOztBQUVBLGVBQU9rQixJQUFJQyxPQUFKLENBQVksOEJBQVosRUFBNEMsK0JBQTVDLENBQVA7QUFDSDs7QUFFS0MsV0FBTixHQUFtQztBQUFBOztBQUFBLDBDQUFsQnBCLGdCQUFrQjtBQUFsQkEsNEJBQWtCO0FBQUE7O0FBQUE7QUFDL0IsZ0JBQUksQ0FBQ0EsZ0JBQUwsRUFBdUI7QUFDbkIsc0JBQU0sSUFBSXBCLEtBQUosQ0FBVSw2Q0FBVixDQUFOO0FBQ0g7O0FBRUQsa0JBQU15QyxZQUFZL0MsUUFBUTBCLGdCQUFSLENBQWxCO0FBQ0Esa0JBQU1zQixXQUFXakQsWUFBWWtELDRCQUFaLENBQXlDRixTQUF6QyxDQUFqQjtBQUNBLGtCQUFNRyxjQUFjLE1BQUt6QixpQkFBTCxDQUF1QnNCLFNBQXZCLENBQXBCOztBQUVBLGtCQUFNL0IsU0FBUyxNQUFNakIsWUFBWW9ELElBQVosQ0FBaUIsTUFBS3BDLFFBQXRCLEVBQWdDO0FBQ2pEcUMseUJBQVNGLFdBRHdDO0FBRWpERyx5QkFBUztBQUNMLG9DQUFnQjtBQURYO0FBRndDLGFBQWhDLENBQXJCO0FBTUEsZ0JBQUlDLGFBQUo7QUFDQSxrQkFBTUMsYUFBYXZDLE9BQU9vQyxPQUFQLENBQWVJLFFBQWYsRUFBbkI7O0FBRUEsZ0JBQUk7QUFDQUYsZ0NBQWdCRyxLQUFLQyxLQUFMLENBQVcxQyxPQUFPb0MsT0FBUCxDQUFlSSxRQUFmLEVBQVgsQ0FBaEI7QUFDSCxhQUZELENBRUUsT0FBT0csR0FBUCxFQUFZO0FBQ1Y7QUFDQSxvQkFBSTtBQUNBTCxvQ0FBZ0IsTUFBTXZELFlBQVk2RCxXQUFaLENBQXdCTCxVQUF4QixDQUF0QjtBQUNBckQsK0JBQVcsZUFBWCxFQUE0QiwwQkFBYSxpQkFBTW9ELGFBQU4sRUFBcUIsdUJBQXJCLENBQWIsRUFBNEQsQ0FBNUQsQ0FBNUI7QUFDSCxpQkFIRCxDQUdFLE9BQU9PLENBQVAsRUFBVTtBQUNSQSxzQkFBRU4sVUFBRixHQUFlQSxVQUFmO0FBQ0EsMEJBQU1NLENBQU47QUFDSDtBQUNKO0FBQ0QsbUJBQU87QUFDSEMsMkJBQVdkLFFBRFI7QUFFSEkseUJBQVNFLGFBRk47QUFHSEM7QUFIRyxhQUFQO0FBOUIrQjtBQW1DbEM7QUFsR1k7O0FBcUdqQixTQUFTUSxhQUFULENBQXVCQyxJQUF2QixFQUE2QjtBQUN6QixXQUFPLFNBQVNDLGVBQVQsQ0FBeUJuRCxNQUF6QixFQUFpQ08sU0FBakMsRUFBNEM7QUFDL0MsZUFBTyxzQ0FBb0IyQyxJQUFwQixFQUEwQmxELE1BQTFCLEVBQWtDTyxTQUFsQyxDQUFQO0FBQ0gsS0FGRDtBQUdIOztBQUVELDBCQUFlbUIsT0FBZixDQUF3QndCLElBQUQsSUFBVTtBQUM3QnBELGVBQVdvRCxJQUFYLElBQW1CRCxjQUFjQyxJQUFkLENBQW5CO0FBQ0gsQ0FGRDs7QUFJQXBELFdBQVdzRCxRQUFYLEdBQXNCLENBQUNwRCxNQUFELEVBQVNPLFNBQVQsS0FBdUI7QUFDekMsUUFBSVAsbURBQUosRUFBdUM7QUFDbkMsY0FBTXFELFdBQVcsaUJBQU1yRCxNQUFOLEVBQWMsaUJBQWQsQ0FBakI7O0FBRUEsWUFBSUEsT0FBT3NELFlBQVAsTUFBeUJELFFBQTdCLEVBQXVDO0FBQ25DO0FBQ0EsbUJBQU8sc0NBQW9CLFVBQXBCLEVBQWdDLEVBQUVBLGtCQUFGLEVBQWhDLEVBQThDOUMsU0FBOUMsQ0FBUDtBQUNIO0FBQ0QsY0FBTSxJQUFJZixLQUFKLENBQVUsMEZBQVYsQ0FBTjtBQUNIOztBQUVELFdBQU8sc0NBQW9CLFVBQXBCLEVBQWdDUSxNQUFoQyxFQUF3Q08sU0FBeEMsQ0FBUDtBQUNILENBWkQ7O2tCQWNlO0FBQ1hULDBCQURXO0FBRVh5RDtBQUZXLEMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB4bWxidWlsZGVyIGZyb20gJ3htbGJ1aWxkZXInO1xuaW1wb3J0IHsgdmFsaWRhdGUgfSBmcm9tICdqb2knO1xuaW1wb3J0IHsgdjEgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHJlYWNoIH0gZnJvbSAnaG9layc7XG5pbXBvcnQgKiBhcyB2YWxpZGF0aW9uIGZyb20gJy4vdmFsaWRhdGlvbic7XG5pbXBvcnQgeyBBdXRoQ29udHJvbCB9IGZyb20gJy4vYXV0aF9jb250cm9sJztcbmltcG9ydCB7IENvbnRyb2xGdW5jdGlvbiB9IGZyb20gJy4vY29udHJvbF9mdW5jdGlvbic7XG5pbXBvcnQgeyBGVU5DVElPTl9OQU1FUyB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCAqIGFzIHJlcXVlc3RVdGlsIGZyb20gJy4vcmVxdWVzdCc7XG5pbXBvcnQgeyBlcnJvcm1lc3NhZ2UgfSBmcm9tICcuL3BhcnNlcic7XG5cbmNvbnN0IGZsYXR0ZW4gPSByZXF1aXJlKCdsb2Rhc2guZmxhdHRlbicpO1xuXG5mdW5jdGlvbiB0aHJvd0Vycm9yKHByZWZpeCwgZXJyb3JEYXRhKSB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3IoYCR7cHJlZml4fTogJHtlcnJvckRhdGEuZXJyb3Jub306ICR7ZXJyb3JEYXRhLmRlc2NyaXB0aW9ufSR7ZXJyb3JEYXRhLmRlc2NyaXB0aW9uMn1gKTtcblxuICAgIE9iamVjdC5hc3NpZ24oZXJyb3IsIGVycm9yRGF0YSk7XG4gICAgdGhyb3cgZXJyb3I7XG59XG5cbmNsYXNzIEludGFjY3RBcGkge1xuICAgIGVuZHBvaW50ID0gJ2h0dHBzOi8vYXBpLmludGFjY3QuY29tL2lhL3htbC94bWxndy5waHRtbCdcblxuICAgIGNvbnN0cnVjdG9yKHBhcmFtcykge1xuICAgICAgICBjb25zdCByZXN1bHQgPSB2YWxpZGF0ZShwYXJhbXMsIHZhbGlkYXRpb24uaW50YWNjdENvbnN0cnVjdG9yKTtcblxuICAgICAgICBpZiAocmVzdWx0LmVycm9yKSB7XG4gICAgICAgICAgICB0aHJvdyByZXN1bHQuZXJyb3I7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmF1dGggPSBuZXcgQXV0aENvbnRyb2wocmVzdWx0LnZhbHVlLmF1dGgpO1xuICAgICAgICB0aGlzLmFzc2lnbkNvbnRyb2xJZChyZXN1bHQudmFsdWUuY29udHJvbElkKTtcbiAgICAgICAgdGhpcy51bmlxdWVJZCA9IHJlc3VsdC52YWx1ZS51bmlxdWVJZDtcbiAgICAgICAgdGhpcy5kdGRWZXJzaW9uID0gcmVzdWx0LnZhbHVlLmR0ZFZlcnNpb247XG4gICAgICAgIHRoaXMudGltZW91dCA9IHJlc3VsdC52YWx1ZS50aW1lb3V0O1xuICAgIH1cblxuICAgIGFzc2lnbkNvbnRyb2xJZChjb250cm9sSWQgPSBudWxsKSB7XG4gICAgICAgIGlmIChjb250cm9sSWQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbElkID0gY29udHJvbElkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sSWQgPSB2MSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlUmVxdWVzdEJvZHkoY29udHJvbEZ1bmN0aW9ucykge1xuICAgICAgICBsZXQgZnVuY3MgPSBjb250cm9sRnVuY3Rpb25zO1xuXG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGZ1bmNzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIGZ1bmNzID0gW2NvbnRyb2xGdW5jdGlvbnNdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgcm9vdCA9IHhtbGJ1aWxkZXIuY3JlYXRlKCdyZXF1ZXN0Jywge1xuICAgICAgICAgICAgdmVyc2lvbjogJzEuMCcsXG4gICAgICAgICAgICBlbmNvZGluZzogJ1VURi04JyxcbiAgICAgICAgICAgIHN0YW5kYWxvbmU6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmVxdWVzdFV0aWwuY3JlYXRlQ29udHJvbCh0aGlzLCByb290KTtcblxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSByb290LmVsZSgnb3BlcmF0aW9uJyk7XG5cbiAgICAgICAgdGhpcy5hdXRoLnRvWE1MKG9wZXJhdGlvbik7XG5cbiAgICAgICAgY29uc3QgY29udGVudCA9IG9wZXJhdGlvbi5lbGUoJ2NvbnRlbnQnKTtcblxuICAgICAgICBmdW5jcy5mb3JFYWNoKChjb250cm9sRnVuYykgPT4ge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb250cm9sRnVuYy50b1hNTCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTm90IGEgdmFsaWQgY29udHJvbCBmdW5jdGlvbi4gVXNlIHRoZSBzdGF0aWMgbWV0aG9kcyB0byBnZW5lcmF0ZSBwcm9wZXIgY29udHJvbCBmdW5jdGlvbnMuJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnRyb2xGdW5jLnRvWE1MKGNvbnRlbnQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcm9vdC5lbmQoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVSZXF1ZXN0Qm9keU5vUGFzc3dvcmRzKGNvbnRyb2xGdW5jdGlvbnMpIHtcbiAgICAgICAgY29uc3Qgb3V0ID0gdGhpcy5jcmVhdGVSZXF1ZXN0Qm9keShjb250cm9sRnVuY3Rpb25zKTtcblxuICAgICAgICByZXR1cm4gb3V0LnJlcGxhY2UoLzxwYXNzd29yZD4oLis/KTxcXC9wYXNzd29yZD4vZywgJzxwYXNzd29yZD5SRURBQ1RFRDwvcGFzc3dvcmQ+Jyk7XG4gICAgfVxuXG4gICAgYXN5bmMgcmVxdWVzdCguLi5jb250cm9sRnVuY3Rpb25zKSB7XG4gICAgICAgIGlmICghY29udHJvbEZ1bmN0aW9ucykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgYXQgbGVhc3Qgb25lIGNvbnRyb2wgZnVuY3Rpb24uJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdHJsRnVuY3MgPSBmbGF0dGVuKGNvbnRyb2xGdW5jdGlvbnMpO1xuICAgICAgICBjb25zdCBmdW5jSGFzaCA9IHJlcXVlc3RVdGlsLmNyZWF0ZUhhc2hPZkNvbnRyb2xGdW5jdGlvbnMoY3RybEZ1bmNzKTtcbiAgICAgICAgY29uc3QgcmVxdWVzdEJvZHkgPSB0aGlzLmNyZWF0ZVJlcXVlc3RCb2R5KGN0cmxGdW5jcyk7XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgcmVxdWVzdFV0aWwucG9zdCh0aGlzLmVuZHBvaW50LCB7XG4gICAgICAgICAgICBwYXlsb2FkOiByZXF1ZXN0Qm9keSxcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ3gtaW50YWNjdC14bWwtcmVxdWVzdCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBwYXJzZWRQYXlsb2FkO1xuICAgICAgICBjb25zdCByYXdQYXlsb2FkID0gcmVzdWx0LnBheWxvYWQudG9TdHJpbmcoKTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGFyc2VkUGF5bG9hZCA9IEpTT04ucGFyc2UocmVzdWx0LnBheWxvYWQudG9TdHJpbmcoKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgLy8gRXJyb3JzIGNvbWUgYmFjayBpbiBYTUwuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHBhcnNlZFBheWxvYWQgPSBhd2FpdCByZXF1ZXN0VXRpbC5wYXJzZVN0cmluZyhyYXdQYXlsb2FkKTtcbiAgICAgICAgICAgICAgICB0aHJvd0Vycm9yKCdSZXF1ZXN0IEVycm9yJywgZXJyb3JtZXNzYWdlKHJlYWNoKHBhcnNlZFBheWxvYWQsICdyZXNwb25zZS5lcnJvcm1lc3NhZ2UnKSlbMF0pO1xuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGUucmF3UGF5bG9hZCA9IHJhd1BheWxvYWQ7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnVuY3Rpb25zOiBmdW5jSGFzaCxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBhcnNlZFBheWxvYWQsXG4gICAgICAgICAgICByYXdQYXlsb2FkXG4gICAgICAgIH07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVGYWN0b3J5KG5hbWUpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gY29udHJvbEZ1bmN0aW9uKHBhcmFtcywgY29udHJvbElkKSB7XG4gICAgICAgIHJldHVybiBuZXcgQ29udHJvbEZ1bmN0aW9uKG5hbWUsIHBhcmFtcywgY29udHJvbElkKTtcbiAgICB9O1xufVxuXG5GVU5DVElPTl9OQU1FUy5mb3JFYWNoKChuYW1lKSA9PiB7XG4gICAgSW50YWNjdEFwaVtuYW1lXSA9IGNyZWF0ZUZhY3RvcnkobmFtZSk7XG59KTtcblxuSW50YWNjdEFwaS5yZWFkTW9yZSA9IChwYXJhbXMsIGNvbnRyb2xJZCkgPT4ge1xuICAgIGlmIChwYXJhbXMgaW5zdGFuY2VvZiBDb250cm9sRnVuY3Rpb24pIHtcbiAgICAgICAgY29uc3QgcmVzdWx0SWQgPSByZWFjaChwYXJhbXMsICdkYXRhLiQucmVzdWx0SWQnKTtcblxuICAgICAgICBpZiAocGFyYW1zLmlzU3VjY2Vzc2Z1bCgpICYmIHJlc3VsdElkKSB7XG4gICAgICAgICAgICAvLyBkbyBzb21ldGhpbmcgZ3JlYXRcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29udHJvbEZ1bmN0aW9uKCdyZWFkTW9yZScsIHsgcmVzdWx0SWQgfSwgY29udHJvbElkKTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbnRyb2xGdW5jdGlvbiBwYXNzZWQgdG8gcmVhZE1vcmUgaXMgbm90IGluIGEgc3VjY2VzcyBzdGF0ZSBvciBkb2VzblxcJ3QgaGF2ZSBhIHJlc3VsdElkJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBDb250cm9sRnVuY3Rpb24oJ3JlYWRNb3JlJywgcGFyYW1zLCBjb250cm9sSWQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIEludGFjY3RBcGksXG4gICAgQ29udHJvbEZ1bmN0aW9uXG59O1xuIl19