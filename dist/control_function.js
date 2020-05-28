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
        this.key = result.key;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jb250cm9sX2Z1bmN0aW9uLmpzIl0sIm5hbWVzIjpbInBhcnNlcnMiLCJDb250cm9sRnVuY3Rpb24iLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJwYXJhbXMiLCJjb250cm9sSWQiLCJwYXJzZSIsIkVycm9yIiwicGFyYW1ldGVycyIsIk9iamVjdCIsImFzc2lnbiIsImFzc2lnbkNvbnRyb2xJZCIsImdldCIsInBhdGgiLCJkYXRhIiwicHJvY2VzcyIsInJlc3VsdCIsInN0YXR1cyIsImZ1bmN0aW9uIiwiY29udHJvbGlkIiwib3ZlcmFsbFN0YXR1cyIsImVycm9ycyIsImVycm9ybWVzc2FnZSIsImNhbGwiLCJrZXkiLCJpc1N1Y2Nlc3NmdWwiLCJ0b1hNTCIsInJvb3QiLCJlbGVtZW50cyIsImVsZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0lBQVlBLE87O0FBQ1o7Ozs7QUFFQSxNQUFNQyxlQUFOLENBQXNCO0FBQ2xCQyxnQkFBWUMsSUFBWixFQUF3RDtBQUFBLFlBQXRDQyxNQUFzQyx5REFBN0IsRUFBNkI7QUFBQSxZQUF6QkMsU0FBeUI7QUFBQSxZQUFkQyxLQUFjLHlEQUFOLElBQU07O0FBQ3BELFlBQUksQ0FBQ0gsSUFBTCxFQUFXO0FBQ1Asa0JBQU0sSUFBSUksS0FBSixDQUFVLCtCQUFWLENBQU47QUFDSDs7QUFFRCxhQUFLSixJQUFMLEdBQVlBLElBQVo7O0FBRUEsWUFBSUcsS0FBSixFQUFXO0FBQ1AsaUJBQUtBLEtBQUwsR0FBYU4sUUFBUUcsSUFBUixLQUFpQixJQUE5QjtBQUNIOztBQUVELFlBQUksbUNBQXdCQSxJQUF4QixDQUFKLEVBQW1DO0FBQy9CLGlCQUFLSyxVQUFMLEdBQWtCQyxPQUFPQyxNQUFQLENBQWMsRUFBZCxFQUFrQixtQ0FBd0JQLElBQXhCLENBQWxCLEVBQWlEQyxNQUFqRCxDQUFsQjtBQUNILFNBRkQsTUFFTztBQUNILGlCQUFLSSxVQUFMLEdBQWtCSixNQUFsQjtBQUNIOztBQUVELGFBQUtPLGVBQUwsQ0FBcUJOLFNBQXJCO0FBQ0g7O0FBRURNLHNCQUFrQztBQUFBLFlBQWxCTixTQUFrQix5REFBTixJQUFNOztBQUM5QixZQUFJQSxTQUFKLEVBQWU7QUFDWCxpQkFBS0EsU0FBTCxHQUFpQkEsU0FBakI7QUFDSCxTQUZELE1BRU87QUFDSCxpQkFBS0EsU0FBTCxHQUFpQixlQUFqQjtBQUNIO0FBQ0o7O0FBRURPLFFBQUlDLElBQUosRUFBVTtBQUNOLFlBQUksQ0FBQ0EsSUFBTCxFQUFXO0FBQ1AsbUJBQU8sS0FBS0MsSUFBWjtBQUNIOztBQUVELGVBQU8saUJBQU0sS0FBS0EsSUFBWCxFQUFpQkQsSUFBakIsQ0FBUDtBQUNIOztBQUVERSxZQUFRQyxNQUFSLEVBQWdCO0FBQ1osYUFBS0EsTUFBTCxHQUFjLHFCQUFVQSxNQUFWLEVBQWtCO0FBQzVCQyxvQkFBUSxVQURvQjtBQUU1QkMsc0JBQVUsWUFGa0I7QUFHNUJDLHVCQUFXO0FBSGlCLFNBQWxCLENBQWQ7O0FBTUEsY0FBTUMsZ0JBQWdCLEtBQUtKLE1BQUwsQ0FBWUMsTUFBWixLQUF1QixTQUE3Qzs7QUFFQSxZQUFJLENBQUNHLGFBQUwsRUFBb0I7QUFDaEIsaUJBQUtKLE1BQUwsQ0FBWUssTUFBWixHQUFxQnJCLFFBQVFzQixZQUFSLENBQXFCQyxJQUFyQixDQUEwQixJQUExQixFQUFnQ1AsT0FBT00sWUFBdkMsQ0FBckI7QUFDSDs7QUFFRCxZQUFJRixpQkFBaUIsS0FBS2QsS0FBMUIsRUFBaUM7QUFDN0IsaUJBQUtRLElBQUwsR0FBWSxLQUFLUixLQUFMLENBQVdpQixJQUFYLENBQWdCLElBQWhCLEVBQXNCUCxPQUFPRixJQUE3QixDQUFaO0FBQ0gsU0FGRCxNQUVPO0FBQ0gsaUJBQUtBLElBQUwsR0FBWUUsT0FBT0YsSUFBbkI7QUFDSDtBQUNELGFBQUtVLEdBQUwsR0FBV1IsT0FBT1EsR0FBbEI7QUFDSDs7QUFFREMsbUJBQWU7QUFDWCxZQUFJLEtBQUtULE1BQVQsRUFBaUI7QUFDYixtQkFBTyxLQUFLQSxNQUFMLENBQVlDLE1BQVosS0FBdUIsU0FBOUI7QUFDSDs7QUFFRCxlQUFPLEtBQVA7QUFDSDs7QUFFRFMsVUFBTUMsSUFBTixFQUFZO0FBQ1IsY0FBTUMsV0FBVztBQUNiVixzQkFBVTtBQUNOLDhCQUFjLEtBQUtiO0FBRGI7QUFERyxTQUFqQjs7QUFNQXVCLGlCQUFTVixRQUFULENBQWtCLEtBQUtmLElBQXZCLElBQStCLEtBQUtLLFVBQXBDOztBQUVBLGVBQU9tQixLQUFLRSxHQUFMLENBQVNELFFBQVQsQ0FBUDtBQUNIO0FBNUVpQjs7a0JBK0VQO0FBQ1gzQjtBQURXLEMiLCJmaWxlIjoiY29udHJvbF9mdW5jdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHYxIH0gZnJvbSAndXVpZCc7XG5pbXBvcnQgeyByZWFjaCwgdHJhbnNmb3JtIH0gZnJvbSAnaG9layc7XG5pbXBvcnQgKiBhcyBwYXJzZXJzIGZyb20gJy4vcGFyc2VyJztcbmltcG9ydCB7IEZVTkNUSU9OX1BBUkFNX0RFRkFVTFRTIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuXG5jbGFzcyBDb250cm9sRnVuY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKG5hbWUsIHBhcmFtcyA9IHt9LCBjb250cm9sSWQsIHBhcnNlID0gdHJ1ZSkge1xuICAgICAgICBpZiAoIW5hbWUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignTWlzc2luZyBjb250cm9sIGZ1bmN0aW9uIG5hbWUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG5cbiAgICAgICAgaWYgKHBhcnNlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnNlID0gcGFyc2Vyc1tuYW1lXSB8fCBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKEZVTkNUSU9OX1BBUkFNX0RFRkFVTFRTW25hbWVdKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtZXRlcnMgPSBPYmplY3QuYXNzaWduKHt9LCBGVU5DVElPTl9QQVJBTV9ERUZBVUxUU1tuYW1lXSwgcGFyYW1zKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuYXNzaWduQ29udHJvbElkKGNvbnRyb2xJZCk7XG4gICAgfVxuXG4gICAgYXNzaWduQ29udHJvbElkKGNvbnRyb2xJZCA9IG51bGwpIHtcbiAgICAgICAgaWYgKGNvbnRyb2xJZCkge1xuICAgICAgICAgICAgdGhpcy5jb250cm9sSWQgPSBjb250cm9sSWQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRyb2xJZCA9IHYxKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXQocGF0aCkge1xuICAgICAgICBpZiAoIXBhdGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGE7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVhY2godGhpcy5kYXRhLCBwYXRoKTtcbiAgICB9XG5cbiAgICBwcm9jZXNzKHJlc3VsdCkge1xuICAgICAgICB0aGlzLnJlc3VsdCA9IHRyYW5zZm9ybShyZXN1bHQsIHtcbiAgICAgICAgICAgIHN0YXR1czogJ3N0YXR1cy4wJyxcbiAgICAgICAgICAgIGZ1bmN0aW9uOiAnZnVuY3Rpb24uMCcsXG4gICAgICAgICAgICBjb250cm9saWQ6ICdjb250cm9saWQuMCdcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3Qgb3ZlcmFsbFN0YXR1cyA9IHRoaXMucmVzdWx0LnN0YXR1cyA9PT0gJ3N1Y2Nlc3MnO1xuXG4gICAgICAgIGlmICghb3ZlcmFsbFN0YXR1cykge1xuICAgICAgICAgICAgdGhpcy5yZXN1bHQuZXJyb3JzID0gcGFyc2Vycy5lcnJvcm1lc3NhZ2UuY2FsbCh0aGlzLCByZXN1bHQuZXJyb3JtZXNzYWdlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvdmVyYWxsU3RhdHVzICYmIHRoaXMucGFyc2UpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IHRoaXMucGFyc2UuY2FsbCh0aGlzLCByZXN1bHQuZGF0YSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSByZXN1bHQuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtleSA9IHJlc3VsdC5rZXk7XG4gICAgfVxuXG4gICAgaXNTdWNjZXNzZnVsKCkge1xuICAgICAgICBpZiAodGhpcy5yZXN1bHQpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc3VsdC5zdGF0dXMgPT09ICdzdWNjZXNzJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0b1hNTChyb290KSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnRzID0ge1xuICAgICAgICAgICAgZnVuY3Rpb246IHtcbiAgICAgICAgICAgICAgICAnQGNvbnRyb2xpZCc6IHRoaXMuY29udHJvbElkXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgZWxlbWVudHMuZnVuY3Rpb25bdGhpcy5uYW1lXSA9IHRoaXMucGFyYW1ldGVycztcblxuICAgICAgICByZXR1cm4gcm9vdC5lbGUoZWxlbWVudHMpO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIENvbnRyb2xGdW5jdGlvblxufTtcbiJdfQ==