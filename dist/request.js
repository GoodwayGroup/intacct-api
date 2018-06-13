'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bluebird = require('bluebird');

let simpleWreckWrap = (() => {
    var _ref = (0, _bluebird.coroutine)(function* (method, uri, options) {
        return yield new Promise(function (resolve, reject) {
            _wreck2.default[method](uri, options, function (err, res, payload) {
                if (err) {
                    const error = err;
                    error.payload = payload;
                    reject(error);
                } else {
                    resolve({ res: res, payload: payload });
                }
            });
        });
    });

    return function simpleWreckWrap(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
    };
})();

var _wreck = require('wreck');

var _wreck2 = _interopRequireDefault(_wreck);

var _xml2js = require('xml2js');

var _control_function = require('./control_function');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    createControl: function createControl(self, root) {
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
    createHashOfControlFunctions: function createHashOfControlFunctions(controlFunctions) {
        const result = {};
        let funcs;

        if (!Array.isArray(controlFunctions)) {
            funcs = [controlFunctions];
        } else {
            funcs = controlFunctions;
        }

        funcs.forEach(func => {
            if (func instanceof _control_function.ControlFunction === false) {
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
    post: function post(uri, options) {
        return (0, _bluebird.coroutine)(function* () {
            return yield simpleWreckWrap('post', uri, options);
        })();
    },
    parseString: function parseString(xml) {
        let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
        return (0, _bluebird.coroutine)(function* () {
            return yield new Promise(function (resolve, reject) {
                (0, _xml2js.parseString)(xml, options, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        })();
    }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9yZXF1ZXN0LmpzIl0sIm5hbWVzIjpbIm1ldGhvZCIsInVyaSIsIm9wdGlvbnMiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImVyciIsInJlcyIsInBheWxvYWQiLCJlcnJvciIsInNpbXBsZVdyZWNrV3JhcCIsImNyZWF0ZUNvbnRyb2wiLCJzZWxmIiwicm9vdCIsImVsZSIsImNvbnRyb2wiLCJzZW5kZXJpZCIsImF1dGgiLCJzZW5kZXJJZCIsInBhc3N3b3JkIiwic2VuZGVyUGFzc3dvcmQiLCJjb250cm9saWQiLCJjb250cm9sSWQiLCJ1bmlxdWVpZCIsInVuaXF1ZUlkIiwidG9TdHJpbmciLCJkdGR2ZXJzaW9uIiwiZHRkVmVyc2lvbiIsImluY2x1ZGV3aGl0ZXNwYWNlIiwiY3JlYXRlSGFzaE9mQ29udHJvbEZ1bmN0aW9ucyIsImNvbnRyb2xGdW5jdGlvbnMiLCJyZXN1bHQiLCJmdW5jcyIsIkFycmF5IiwiaXNBcnJheSIsImZvckVhY2giLCJmdW5jIiwiRXJyb3IiLCJpZCIsInBvc3QiLCJwYXJzZVN0cmluZyIsInhtbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O3dDQUlBLFdBQStCQSxNQUEvQixFQUF1Q0MsR0FBdkMsRUFBNENDLE9BQTVDLEVBQXFEO0FBQ2pELGVBQU8sTUFBTSxJQUFJQyxPQUFKLENBQVksVUFBQ0MsT0FBRCxFQUFVQyxNQUFWLEVBQXFCO0FBQzFDLDRCQUFNTCxNQUFOLEVBQWNDLEdBQWQsRUFBbUJDLE9BQW5CLEVBQTRCLFVBQUNJLEdBQUQsRUFBTUMsR0FBTixFQUFXQyxPQUFYLEVBQXVCO0FBQy9DLG9CQUFJRixHQUFKLEVBQVM7QUFDTCwwQkFBTUcsUUFBUUgsR0FBZDtBQUNBRywwQkFBTUQsT0FBTixHQUFnQkEsT0FBaEI7QUFDQUgsMkJBQU9JLEtBQVA7QUFDSCxpQkFKRCxNQUlPO0FBQ0hMLDRCQUFRLEVBQUVHLFFBQUYsRUFBT0MsZ0JBQVAsRUFBUjtBQUNIO0FBQ0osYUFSRDtBQVNILFNBVlksQ0FBYjtBQVdILEs7O29CQVpjRSxlOzs7OztBQUpmOzs7O0FBQ0E7O0FBQ0E7Ozs7a0JBZ0JlO0FBQ1hDLGlCQURXLHlCQUNHQyxJQURILEVBQ1NDLElBRFQsRUFDZTtBQUN0QixlQUFPQSxLQUFLQyxHQUFMLENBQVM7QUFDWkMscUJBQVM7QUFDTEMsMEJBQVVKLEtBQUtLLElBQUwsQ0FBVUMsUUFEZjtBQUVMQywwQkFBVVAsS0FBS0ssSUFBTCxDQUFVRyxjQUZmO0FBR0xDLDJCQUFXVCxLQUFLVSxTQUhYO0FBSUxDLDBCQUFVWCxLQUFLWSxRQUFMLENBQWNDLFFBQWQsRUFKTDtBQUtMQyw0QkFBWWQsS0FBS2UsVUFMWjtBQU1MQyxtQ0FBbUI7QUFOZDtBQURHLFNBQVQsQ0FBUDtBQVVILEtBWlU7QUFjWEMsZ0NBZFcsd0NBY2tCQyxnQkFkbEIsRUFjb0M7QUFDM0MsY0FBTUMsU0FBUyxFQUFmO0FBQ0EsWUFBSUMsS0FBSjs7QUFFQSxZQUFJLENBQUNDLE1BQU1DLE9BQU4sQ0FBY0osZ0JBQWQsQ0FBTCxFQUFzQztBQUNsQ0Usb0JBQVEsQ0FBQ0YsZ0JBQUQsQ0FBUjtBQUNILFNBRkQsTUFFTztBQUNIRSxvQkFBUUYsZ0JBQVI7QUFDSDs7QUFFREUsY0FBTUcsT0FBTixDQUFlQyxJQUFELElBQVU7QUFDcEIsZ0JBQUtBLGlEQUFELEtBQXNDLEtBQTFDLEVBQWlEO0FBQzdDLHNCQUFNLElBQUlDLEtBQUosQ0FBVSxnQ0FBVixDQUFOO0FBQ0g7O0FBRUQsa0JBQU1DLEtBQUtGLEtBQUtkLFNBQWhCOztBQUVBLGdCQUFJUyxPQUFPTyxFQUFQLENBQUosRUFBZ0I7QUFDWixzQkFBTSxJQUFJRCxLQUFKLENBQVUsMkNBQVYsQ0FBTjtBQUNILGFBRkQsTUFFTztBQUNITix1QkFBT08sRUFBUCxJQUFhRixJQUFiO0FBQ0g7QUFDSixTQVpEOztBQWNBLGVBQU9MLE1BQVA7QUFDSCxLQXZDVTtBQXlDTFEsUUF6Q0ssZ0JBeUNBdEMsR0F6Q0EsRUF5Q0tDLE9BekNMLEVBeUNjO0FBQUE7QUFDckIsbUJBQU8sTUFBTVEsZ0JBQWdCLE1BQWhCLEVBQXdCVCxHQUF4QixFQUE2QkMsT0FBN0IsQ0FBYjtBQURxQjtBQUV4QixLQTNDVTtBQTZDTHNDLGVBN0NLLHVCQTZDT0MsR0E3Q1AsRUE2QzBCO0FBQUEsWUFBZHZDLE9BQWMseURBQUosRUFBSTtBQUFBO0FBQ2pDLG1CQUFPLE1BQU0sSUFBSUMsT0FBSixDQUFZLFVBQUNDLE9BQUQsRUFBVUMsTUFBVixFQUFxQjtBQUMxQyx5Q0FBWW9DLEdBQVosRUFBaUJ2QyxPQUFqQixFQUEwQixVQUFDSSxHQUFELEVBQU15QixNQUFOLEVBQWlCO0FBQ3ZDLHdCQUFJekIsR0FBSixFQUFTO0FBQ0xELCtCQUFPQyxHQUFQO0FBQ0gscUJBRkQsTUFFTztBQUNIRixnQ0FBUTJCLE1BQVI7QUFDSDtBQUNKLGlCQU5EO0FBT0gsYUFSWSxDQUFiO0FBRGlDO0FBVXBDO0FBdkRVLEMiLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBXcmVjayBmcm9tICd3cmVjayc7XG5pbXBvcnQgeyBwYXJzZVN0cmluZyB9IGZyb20gJ3htbDJqcyc7XG5pbXBvcnQgeyBDb250cm9sRnVuY3Rpb24gfSBmcm9tICcuL2NvbnRyb2xfZnVuY3Rpb24nO1xuXG5hc3luYyBmdW5jdGlvbiBzaW1wbGVXcmVja1dyYXAobWV0aG9kLCB1cmksIG9wdGlvbnMpIHtcbiAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBXcmVja1ttZXRob2RdKHVyaSwgb3B0aW9ucywgKGVyciwgcmVzLCBwYXlsb2FkKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZXJyb3IgPSBlcnI7XG4gICAgICAgICAgICAgICAgZXJyb3IucGF5bG9hZCA9IHBheWxvYWQ7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHJlcywgcGF5bG9hZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBjcmVhdGVDb250cm9sKHNlbGYsIHJvb3QpIHtcbiAgICAgICAgcmV0dXJuIHJvb3QuZWxlKHtcbiAgICAgICAgICAgIGNvbnRyb2w6IHtcbiAgICAgICAgICAgICAgICBzZW5kZXJpZDogc2VsZi5hdXRoLnNlbmRlcklkLFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiBzZWxmLmF1dGguc2VuZGVyUGFzc3dvcmQsXG4gICAgICAgICAgICAgICAgY29udHJvbGlkOiBzZWxmLmNvbnRyb2xJZCxcbiAgICAgICAgICAgICAgICB1bmlxdWVpZDogc2VsZi51bmlxdWVJZC50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIGR0ZHZlcnNpb246IHNlbGYuZHRkVmVyc2lvbixcbiAgICAgICAgICAgICAgICBpbmNsdWRld2hpdGVzcGFjZTogJ2ZhbHNlJ1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuXG4gICAgY3JlYXRlSGFzaE9mQ29udHJvbEZ1bmN0aW9ucyhjb250cm9sRnVuY3Rpb25zKSB7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHt9O1xuICAgICAgICBsZXQgZnVuY3M7XG5cbiAgICAgICAgaWYgKCFBcnJheS5pc0FycmF5KGNvbnRyb2xGdW5jdGlvbnMpKSB7XG4gICAgICAgICAgICBmdW5jcyA9IFtjb250cm9sRnVuY3Rpb25zXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGZ1bmNzID0gY29udHJvbEZ1bmN0aW9ucztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmNzLmZvckVhY2goKGZ1bmMpID0+IHtcbiAgICAgICAgICAgIGlmICgoZnVuYyBpbnN0YW5jZW9mIENvbnRyb2xGdW5jdGlvbikgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbnRyb2wgZnVuY3Rpb24gZ2l2ZW4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgaWQgPSBmdW5jLmNvbnRyb2xJZDtcblxuICAgICAgICAgICAgaWYgKHJlc3VsdFtpZF0pIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0R1cGxpY2F0ZSBjb250cm9sIGlkIGluIGNvbnRyb2wgZnVuY3Rpb25zJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtpZF0gPSBmdW5jO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0sXG5cbiAgICBhc3luYyBwb3N0KHVyaSwgb3B0aW9ucykge1xuICAgICAgICByZXR1cm4gYXdhaXQgc2ltcGxlV3JlY2tXcmFwKCdwb3N0JywgdXJpLCBvcHRpb25zKTtcbiAgICB9LFxuXG4gICAgYXN5bmMgcGFyc2VTdHJpbmcoeG1sLCBvcHRpb25zID0ge30pIHtcbiAgICAgICAgcmV0dXJuIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHBhcnNlU3RyaW5nKHhtbCwgb3B0aW9ucywgKGVyciwgcmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn07XG4iXX0=