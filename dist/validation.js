'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _joi = require('joi');

var Joi = _interopRequireWildcard(_joi);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = {
    pagesize: Joi.number().min(1).max(1000),
    fields: Joi.array().items(Joi.number()).single(),
    query: Joi.string().default(''),

    intacctConstructor: Joi.object().keys({
        auth: Joi.object().keys({
            senderId: Joi.string().required(),
            senderPassword: Joi.string().required(),
            sessionId: Joi.string(),
            userId: Joi.string(),
            companyId: Joi.string(),
            password: Joi.string()
        }).xor('sessionId', 'userId').with('userId', 'companyId', 'password'),
        controlId: Joi.string().optional(),
        uniqueId: Joi.boolean().default(false),
        dtdVersion: Joi.string().valid(['2.1', '3.0']).default('3.0'),
        timeout: Joi.number().min(10).default(5000)
    })
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy92YWxpZGF0aW9uLmpzIl0sIm5hbWVzIjpbIkpvaSIsInBhZ2VzaXplIiwibnVtYmVyIiwibWluIiwibWF4IiwiZmllbGRzIiwiYXJyYXkiLCJpdGVtcyIsInNpbmdsZSIsInF1ZXJ5Iiwic3RyaW5nIiwiZGVmYXVsdCIsImludGFjY3RDb25zdHJ1Y3RvciIsIm9iamVjdCIsImtleXMiLCJhdXRoIiwic2VuZGVySWQiLCJyZXF1aXJlZCIsInNlbmRlclBhc3N3b3JkIiwic2Vzc2lvbklkIiwidXNlcklkIiwiY29tcGFueUlkIiwicGFzc3dvcmQiLCJ4b3IiLCJ3aXRoIiwiY29udHJvbElkIiwib3B0aW9uYWwiLCJ1bmlxdWVJZCIsImJvb2xlYW4iLCJkdGRWZXJzaW9uIiwidmFsaWQiLCJ0aW1lb3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7SUFBWUEsRzs7OztrQkFFRztBQUNYQyxjQUFVRCxJQUFJRSxNQUFKLEdBQWFDLEdBQWIsQ0FBaUIsQ0FBakIsRUFBb0JDLEdBQXBCLENBQXdCLElBQXhCLENBREM7QUFFWEMsWUFBUUwsSUFBSU0sS0FBSixHQUFZQyxLQUFaLENBQWtCUCxJQUFJRSxNQUFKLEVBQWxCLEVBQWdDTSxNQUFoQyxFQUZHO0FBR1hDLFdBQU9ULElBQUlVLE1BQUosR0FBYUMsT0FBYixDQUFxQixFQUFyQixDQUhJOztBQUtYQyx3QkFBb0JaLElBQUlhLE1BQUosR0FBYUMsSUFBYixDQUFrQjtBQUNsQ0MsY0FBTWYsSUFBSWEsTUFBSixHQUFhQyxJQUFiLENBQWtCO0FBQ3BCRSxzQkFBVWhCLElBQUlVLE1BQUosR0FBYU8sUUFBYixFQURVO0FBRXBCQyw0QkFBZ0JsQixJQUFJVSxNQUFKLEdBQWFPLFFBQWIsRUFGSTtBQUdwQkUsdUJBQVduQixJQUFJVSxNQUFKLEVBSFM7QUFJcEJVLG9CQUFRcEIsSUFBSVUsTUFBSixFQUpZO0FBS3BCVyx1QkFBV3JCLElBQUlVLE1BQUosRUFMUztBQU1wQlksc0JBQVV0QixJQUFJVSxNQUFKO0FBTlUsU0FBbEIsRUFPSGEsR0FQRyxDQU9DLFdBUEQsRUFPYyxRQVBkLEVBT3dCQyxJQVB4QixDQU82QixRQVA3QixFQU91QyxXQVB2QyxFQU9vRCxVQVBwRCxDQUQ0QjtBQVNsQ0MsbUJBQVd6QixJQUFJVSxNQUFKLEdBQWFnQixRQUFiLEVBVHVCO0FBVWxDQyxrQkFBVTNCLElBQUk0QixPQUFKLEdBQWNqQixPQUFkLENBQXNCLEtBQXRCLENBVndCO0FBV2xDa0Isb0JBQVk3QixJQUFJVSxNQUFKLEdBQWFvQixLQUFiLENBQW1CLENBQUMsS0FBRCxFQUFRLEtBQVIsQ0FBbkIsRUFBbUNuQixPQUFuQyxDQUEyQyxLQUEzQyxDQVhzQjtBQVlsQ29CLGlCQUFTL0IsSUFBSUUsTUFBSixHQUFhQyxHQUFiLENBQWlCLEVBQWpCLEVBQXFCUSxPQUFyQixDQUE2QixJQUE3QjtBQVp5QixLQUFsQjtBQUxULEMiLCJmaWxlIjoidmFsaWRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEpvaSBmcm9tICdqb2knO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgcGFnZXNpemU6IEpvaS5udW1iZXIoKS5taW4oMSkubWF4KDEwMDApLFxuICAgIGZpZWxkczogSm9pLmFycmF5KCkuaXRlbXMoSm9pLm51bWJlcigpKS5zaW5nbGUoKSxcbiAgICBxdWVyeTogSm9pLnN0cmluZygpLmRlZmF1bHQoJycpLFxuXG4gICAgaW50YWNjdENvbnN0cnVjdG9yOiBKb2kub2JqZWN0KCkua2V5cyh7XG4gICAgICAgIGF1dGg6IEpvaS5vYmplY3QoKS5rZXlzKHtcbiAgICAgICAgICAgIHNlbmRlcklkOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgICAgICAgICAgIHNlbmRlclBhc3N3b3JkOiBKb2kuc3RyaW5nKCkucmVxdWlyZWQoKSxcbiAgICAgICAgICAgIHNlc3Npb25JZDogSm9pLnN0cmluZygpLFxuICAgICAgICAgICAgdXNlcklkOiBKb2kuc3RyaW5nKCksXG4gICAgICAgICAgICBjb21wYW55SWQ6IEpvaS5zdHJpbmcoKSxcbiAgICAgICAgICAgIHBhc3N3b3JkOiBKb2kuc3RyaW5nKClcbiAgICAgICAgfSkueG9yKCdzZXNzaW9uSWQnLCAndXNlcklkJykud2l0aCgndXNlcklkJywgJ2NvbXBhbnlJZCcsICdwYXNzd29yZCcpLFxuICAgICAgICBjb250cm9sSWQ6IEpvaS5zdHJpbmcoKS5vcHRpb25hbCgpLFxuICAgICAgICB1bmlxdWVJZDogSm9pLmJvb2xlYW4oKS5kZWZhdWx0KGZhbHNlKSxcbiAgICAgICAgZHRkVmVyc2lvbjogSm9pLnN0cmluZygpLnZhbGlkKFsnMi4xJywgJzMuMCddKS5kZWZhdWx0KCczLjAnKSxcbiAgICAgICAgdGltZW91dDogSm9pLm51bWJlcigpLm1pbigxMCkuZGVmYXVsdCg1MDAwKVxuICAgIH0pXG59O1xuIl19