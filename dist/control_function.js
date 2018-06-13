'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _uuid = require('uuid');

var _hoek = require('hoek');

var _parser = require('./parser');

var parsers = _interopRequireWildcard(_parser);

var _constants = require('./constants');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class ControlFunction {
    constructor(name) {
        let params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        let controlId = arguments[2];
        let parse = arguments.length <= 3 || arguments[3] === undefined ? true : arguments[3];

        if (!name) {
            throw new Error('Missing control function name');
        }

        this.name = name;

        if (parse) {
            this.parse = parsers[name] || null;
        }

        if (_constants.FUNCTION_PARAM_DEFAULTS[name]) {
            this.parameters = Object.assign({}, _constants.FUNCTION_PARAM_DEFAULTS[name], params);
        } else {
            this.parameters = params;
        }

        this.assignControlId(controlId);
    }

    assignControlId() {
        let controlId = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        if (controlId) {
            this.controlId = controlId;
        } else {
            this.controlId = (0, _uuid.v1)();
        }
    }

    get(path) {
        if (!path) {
            return this.data;
        }

        return (0, _hoek.reach)(this.data, path);
    }

    process(result) {
        this.result = (0, _hoek.transform)(result, {
            status: 'status.0',
            function: 'function.0',
            controlid: 'controlid.0'
        });

        const overallStatus = this.result.status === 'success';

        if (!overallStatus) {
            this.result.errors = parsers.errormessage.call(this, result.errormessage);
        }

        if (overallStatus && this.parse) {
            this.data = this.parse.call(this, result.data);
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

exports.default = {
    ControlFunction: ControlFunction
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250cm9sX2Z1bmN0aW9uLmpzIl0sIm5hbWVzIjpbInBhcnNlcnMiLCJDb250cm9sRnVuY3Rpb24iLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJwYXJhbXMiLCJjb250cm9sSWQiLCJwYXJzZSIsIkVycm9yIiwicGFyYW1ldGVycyIsIk9iamVjdCIsImFzc2lnbiIsImFzc2lnbkNvbnRyb2xJZCIsImdldCIsInBhdGgiLCJkYXRhIiwicHJvY2VzcyIsInJlc3VsdCIsInN0YXR1cyIsImZ1bmN0aW9uIiwiY29udHJvbGlkIiwib3ZlcmFsbFN0YXR1cyIsImVycm9ycyIsImVycm9ybWVzc2FnZSIsImNhbGwiLCJpc1N1Y2Nlc3NmdWwiLCJ0b1hNTCIsInJvb3QiLCJlbGVtZW50cyIsImVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0lBQVlBLE87O0FBQ1o7Ozs7QUFFQSxNQUFNQyxlQUFOLENBQXNCO0FBQ2xCQyxnQkFBWUMsSUFBWixFQUF3RDtBQUFBLFlBQXRDQyxNQUFzQyx5REFBN0IsRUFBNkI7QUFBQSxZQUF6QkMsU0FBeUI7QUFBQSxZQUFkQyxLQUFjLHlEQUFOLElBQU07O0FBQ3BELFlBQUksQ0FBQ0gsSUFBTCxFQUFXO0FBQ1Asa0JBQU0sSUFBSUksS0FBSixDQUFVLCtCQUFWLENBQU47QUFDSDs7QUFFRCxhQUFLSixJQUFMLEdBQVlBLElBQVo7O0FBRUEsWUFBSUcsS0FBSixFQUFXO0FBQ1AsaUJBQUtBLEtBQUwsR0FBYU4sUUFBUUcsSUFBUixLQUFpQixJQUE5QjtBQUNIOztBQUVELFlBQUksbUNBQXdCQSxJQUF4QixDQUFKLEVBQW1DO0FBQy9CLGlCQUFLSyxVQUFMLEdBQWtCQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQixtQ0FBd0JQLElBQXhCLENBQWxCLEVBQWlEQyxNQUFqRCxDQUFsQjtBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLSSxVQUFMLEdBQWtCSixNQUFsQjtBQUNIOztBQUVELGFBQUtPLGVBQUwsQ0FBcUJOLFNBQXJCO0FBQ0g7O0FBRURNLHNCQUFrQztBQUFBLFlBQWxCTixTQUFrQix5REFBTixJQUFNOztBQUM5QixZQUFJQSxTQUFKLEVBQWU7QUFDWCxpQkFBS0EsU0FBTCxHQUFpQkEsU0FBakI7QUFDSCxTQUZELE1BRU87QUFDSCxpQkFBS0EsU0FBTCxHQUFpQixlQUFqQjtBQUNIO0FBQ0o7O0FBRURPLFFBQUlDLElBQUosRUFBVTtBQUNOLFlBQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1AsbUJBQU8sS0FBS0MsSUFBWjtBQUNIOztBQUVELGVBQU8saUJBQU0sS0FBS0EsSUFBWCxFQUFpQkQsSUFBakIsQ0FBUDtBQUNIOztBQUVERSxZQUFRQyxNQUFSLEVBQWdCO0FBQ1osYUFBS0EsTUFBTCxHQUFjLHFCQUFVQSxNQUFWLEVBQWtCO0FBQzVCQyxvQkFBUSxVQURvQjtBQUU1QkMsc0JBQVUsWUFGa0I7QUFHNUJDLHVCQUFXO0FBSGlCLFNBQWxCLENBQWQ7O0FBTUEsY0FBTUMsZ0JBQWdCLEtBQUtKLE1BQUwsQ0FBWUMsTUFBWixLQUF1QixTQUE3Qzs7QUFFQSxZQUFJLENBQUNHLGFBQUwsRUFBb0I7QUFDaEIsaUJBQUtKLE1BQUwsQ0FBWUssTUFBWixHQUFxQnJCLFFBQVFzQixZQUFSLENBQXFCQyxJQUFyQixDQUEwQixJQUExQixFQUFnQ1AsT0FBT00sWUFBdkMsQ0FBckI7QUFDSDs7QUFFRCxZQUFJRixpQkFBaUIsS0FBS2QsS0FBMUIsRUFBaUM7QUFDN0IsaUJBQUtRLElBQUwsR0FBWSxLQUFLUixLQUFMLENBQVdpQixJQUFYLENBQWdCLElBQWhCLEVBQXNCUCxPQUFPRixJQUE3QixDQUFaO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQUtBLElBQUwsR0FBWUUsT0FBT0YsSUFBbkI7QUFDSDtBQUNKOztBQUVEVSxtQkFBZTtBQUNYLFlBQUksS0FBS1IsTUFBVCxFQUFpQjtBQUNiLG1CQUFPLEtBQUtBLE1BQUwsQ0FBWUMsTUFBWixLQUF1QixTQUE5QjtBQUNIOztBQUVELGVBQU8sS0FBUDtBQUNIOztBQUVEUSxVQUFNQyxJQUFOLEVBQVk7QUFDUixjQUFNQyxXQUFXO0FBQ2JULHNCQUFVO0FBQ04sOEJBQWMsS0FBS2I7QUFEYjtBQURHLFNBQWpCOztBQU1Bc0IsaUJBQVNULFFBQVQsQ0FBa0IsS0FBS2YsSUFBdkIsSUFBK0IsS0FBS0ssVUFBcEM7O0FBRUEsZUFBT2tCLEtBQUtFLEdBQUwsQ0FBU0QsUUFBVCxDQUFQO0FBQ0g7QUEzRWlCOztrQkE4RVA7QUFDWDFCO0FBRFcsQyIsImZpbGUiOiJjb250cm9sX2Z1bmN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdjEgfSBmcm9tICd1dWlkJztcbmltcG9ydCB7IHJlYWNoLCB0cmFuc2Zvcm0gfSBmcm9tICdob2VrJztcbmltcG9ydCAqIGFzIHBhcnNlcnMgZnJvbSAnLi9wYXJzZXInO1xuaW1wb3J0IHsgRlVOQ1RJT05fUEFSQU1fREVGQVVMVFMgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmNsYXNzIENvbnRyb2xGdW5jdGlvbiB7XG4gICAgY29uc3RydWN0b3IobmFtZSwgcGFyYW1zID0ge30sIGNvbnRyb2xJZCwgcGFyc2UgPSB0cnVlKSB7XG4gICAgICAgIGlmICghbmFtZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIGNvbnRyb2wgZnVuY3Rpb24gbmFtZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcblxuICAgICAgICBpZiAocGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMucGFyc2UgPSBwYXJzZXJzW25hbWVdIHx8IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoRlVOQ1RJT05fUEFSQU1fREVGQVVMVFNbbmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycyA9IE9iamVjdC5hc3NpZ24oe30sIEZVTkNUSU9OX1BBUkFNX0RFRkFVTFRTW25hbWVdLCBwYXJhbXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJhbWV0ZXJzID0gcGFyYW1zO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5hc3NpZ25Db250cm9sSWQoY29udHJvbElkKTtcbiAgICB9XG5cbiAgICBhc3NpZ25Db250cm9sSWQoY29udHJvbElkID0gbnVsbCkge1xuICAgICAgICBpZiAoY29udHJvbElkKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xJZCA9IGNvbnRyb2xJZDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY29udHJvbElkID0gdjEoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldChwYXRoKSB7XG4gICAgICAgIGlmICghcGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZWFjaCh0aGlzLmRhdGEsIHBhdGgpO1xuICAgIH1cblxuICAgIHByb2Nlc3MocmVzdWx0KSB7XG4gICAgICAgIHRoaXMucmVzdWx0ID0gdHJhbnNmb3JtKHJlc3VsdCwge1xuICAgICAgICAgICAgc3RhdHVzOiAnc3RhdHVzLjAnLFxuICAgICAgICAgICAgZnVuY3Rpb246ICdmdW5jdGlvbi4wJyxcbiAgICAgICAgICAgIGNvbnRyb2xpZDogJ2NvbnRyb2xpZC4wJ1xuICAgICAgICB9KTtcblxuICAgICAgICBjb25zdCBvdmVyYWxsU3RhdHVzID0gdGhpcy5yZXN1bHQuc3RhdHVzID09PSAnc3VjY2Vzcyc7XG5cbiAgICAgICAgaWYgKCFvdmVyYWxsU3RhdHVzKSB7XG4gICAgICAgICAgICB0aGlzLnJlc3VsdC5lcnJvcnMgPSBwYXJzZXJzLmVycm9ybWVzc2FnZS5jYWxsKHRoaXMsIHJlc3VsdC5lcnJvcm1lc3NhZ2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG92ZXJhbGxTdGF0dXMgJiYgdGhpcy5wYXJzZSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gdGhpcy5wYXJzZS5jYWxsKHRoaXMsIHJlc3VsdC5kYXRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHJlc3VsdC5kYXRhO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNTdWNjZXNzZnVsKCkge1xuICAgICAgICBpZiAodGhpcy5yZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc3VsdC5zdGF0dXMgPT09ICdzdWNjZXNzJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0b1hNTChyb290KSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0ge1xuICAgICAgICAgICAgZnVuY3Rpb246IHtcbiAgICAgICAgICAgICAgICAnQGNvbnRyb2xpZCc6IHRoaXMuY29udHJvbElkXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZWxlbWVudHMuZnVuY3Rpb25bdGhpcy5uYW1lXSA9IHRoaXMucGFyYW1ldGVycztcblxuICAgICAgICByZXR1cm4gcm9vdC5lbGUoZWxlbWVudHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIENvbnRyb2xGdW5jdGlvblxufTtcbiJdfQ==