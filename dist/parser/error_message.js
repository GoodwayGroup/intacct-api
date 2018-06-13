'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _hoek = require('hoek');

function errorMessageSingle(err) {
    return (0, _hoek.transform)(err, {
        errorno: 'error.0.errorno.0',
        description: 'error.0.description.0',
        description2: 'error.0.description2.0',
        correction: 'error.0.correction.0'
    });
}

function errormessage(data) {
    let out;
    if (data && data instanceof Array) {
        out = data.map(errorMessageSingle);
    } else if (data) {
        out = data;
    }
    return out;
}

exports.default = {
    errormessage: errormessage
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvZXJyb3JfbWVzc2FnZS5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2VTaW5nbGUiLCJlcnIiLCJlcnJvcm5vIiwiZGVzY3JpcHRpb24iLCJkZXNjcmlwdGlvbjIiLCJjb3JyZWN0aW9uIiwiZXJyb3JtZXNzYWdlIiwiZGF0YSIsIm91dCIsIkFycmF5IiwibWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQSxTQUFTQSxrQkFBVCxDQUE0QkMsR0FBNUIsRUFBaUM7QUFDN0IsV0FBTyxxQkFBVUEsR0FBVixFQUFlO0FBQ2xCQyxpQkFBUyxtQkFEUztBQUVsQkMscUJBQWEsdUJBRks7QUFHbEJDLHNCQUFjLHdCQUhJO0FBSWxCQyxvQkFBWTtBQUpNLEtBQWYsQ0FBUDtBQU1IOztBQUVELFNBQVNDLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCO0FBQ3hCLFFBQUlDLEdBQUo7QUFDQSxRQUFJRCxRQUFRQSxnQkFBZ0JFLEtBQTVCLEVBQW1DO0FBQy9CRCxjQUFNRCxLQUFLRyxHQUFMLENBQVNWLGtCQUFULENBQU47QUFDSCxLQUZELE1BRU8sSUFBSU8sSUFBSixFQUFVO0FBQ2JDLGNBQU1ELElBQU47QUFDSDtBQUNELFdBQU9DLEdBQVA7QUFDSDs7a0JBRWM7QUFDWEY7QUFEVyxDIiwiZmlsZSI6ImVycm9yX21lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tICdob2VrJztcblxuZnVuY3Rpb24gZXJyb3JNZXNzYWdlU2luZ2xlKGVycikge1xuICAgIHJldHVybiB0cmFuc2Zvcm0oZXJyLCB7XG4gICAgICAgIGVycm9ybm86ICdlcnJvci4wLmVycm9ybm8uMCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnZXJyb3IuMC5kZXNjcmlwdGlvbi4wJyxcbiAgICAgICAgZGVzY3JpcHRpb24yOiAnZXJyb3IuMC5kZXNjcmlwdGlvbjIuMCcsXG4gICAgICAgIGNvcnJlY3Rpb246ICdlcnJvci4wLmNvcnJlY3Rpb24uMCdcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZXJyb3JtZXNzYWdlKGRhdGEpIHtcbiAgICBsZXQgb3V0O1xuICAgIGlmIChkYXRhICYmIGRhdGEgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBvdXQgPSBkYXRhLm1hcChlcnJvck1lc3NhZ2VTaW5nbGUpO1xuICAgIH0gZWxzZSBpZiAoZGF0YSkge1xuICAgICAgICBvdXQgPSBkYXRhO1xuICAgIH1cbiAgICByZXR1cm4gb3V0O1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgZXJyb3JtZXNzYWdlXG59O1xuIl19