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
    return data.map(errorMessageSingle);
}

exports.default = {
    errormessage: errormessage
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvZXJyb3JfbWVzc2FnZS5qcyJdLCJuYW1lcyI6WyJlcnJvck1lc3NhZ2VTaW5nbGUiLCJlcnIiLCJlcnJvcm5vIiwiZGVzY3JpcHRpb24iLCJkZXNjcmlwdGlvbjIiLCJjb3JyZWN0aW9uIiwiZXJyb3JtZXNzYWdlIiwiZGF0YSIsIm1hcCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBRUEsU0FBU0Esa0JBQVQsQ0FBNEJDLEdBQTVCLEVBQWlDO0FBQzdCLFdBQU8scUJBQVVBLEdBQVYsRUFBZTtBQUNsQkMsaUJBQVMsbUJBRFM7QUFFbEJDLHFCQUFhLHVCQUZLO0FBR2xCQyxzQkFBYyx3QkFISTtBQUlsQkMsb0JBQVk7QUFKTSxLQUFmLENBQVA7QUFNSDs7QUFFRCxTQUFTQyxZQUFULENBQXNCQyxJQUF0QixFQUE0QjtBQUN4QixXQUFPQSxLQUFLQyxHQUFMLENBQVNSLGtCQUFULENBQVA7QUFDSDs7a0JBRWM7QUFDWE07QUFEVyxDIiwiZmlsZSI6ImVycm9yX21lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0cmFuc2Zvcm0gfSBmcm9tICdob2VrJztcblxuZnVuY3Rpb24gZXJyb3JNZXNzYWdlU2luZ2xlKGVycikge1xuICAgIHJldHVybiB0cmFuc2Zvcm0oZXJyLCB7XG4gICAgICAgIGVycm9ybm86ICdlcnJvci4wLmVycm9ybm8uMCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnZXJyb3IuMC5kZXNjcmlwdGlvbi4wJyxcbiAgICAgICAgZGVzY3JpcHRpb24yOiAnZXJyb3IuMC5kZXNjcmlwdGlvbjIuMCcsXG4gICAgICAgIGNvcnJlY3Rpb246ICdlcnJvci4wLmNvcnJlY3Rpb24uMCdcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZXJyb3JtZXNzYWdlKGRhdGEpIHtcbiAgICByZXR1cm4gZGF0YS5tYXAoZXJyb3JNZXNzYWdlU2luZ2xlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIGVycm9ybWVzc2FnZVxufTtcbiJdfQ==