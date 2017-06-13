'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function cleanArray(item) {
    const rebuild = {};

    Object.keys(item).forEach(key => {
        if (Array.isArray(item[key]) && item[key].length === 1 && typeof item[key][0] !== 'object') {
            rebuild[key] = item[key][0];
        } else {
            rebuild[key] = item[key];
        }
    });

    return rebuild;
}

function recursivelyCleanArray(item) {
    const rebuild = {};

    Object.keys(item).forEach(key => {
        if (Array.isArray(item[key])) {
            rebuild[key] = item[key].map(subitem => {
                let res;

                if (typeof subitem === 'object') {
                    res = recursivelyCleanArray(subitem);
                } else {
                    res = subitem;
                }

                return res;
            });

            if (item[key].length === 1) {
                rebuild[key] = rebuild[key][0];
            }
        } else {
            rebuild[key] = item[key];
        }
    });

    return rebuild;
}

exports.default = {
    cleanArray: cleanArray,
    recursivelyCleanArray: recursivelyCleanArray
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9jbGVhbl9hcnJheS5qcyJdLCJuYW1lcyI6WyJjbGVhbkFycmF5IiwiaXRlbSIsInJlYnVpbGQiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImtleSIsIkFycmF5IiwiaXNBcnJheSIsImxlbmd0aCIsInJlY3Vyc2l2ZWx5Q2xlYW5BcnJheSIsIm1hcCIsInN1Yml0ZW0iLCJyZXMiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsU0FBU0EsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDdEIsVUFBTUMsVUFBVSxFQUFoQjs7QUFFQUMsV0FBT0MsSUFBUCxDQUFZSCxJQUFaLEVBQWtCSSxPQUFsQixDQUEyQkMsR0FBRCxJQUFTO0FBQy9CLFlBQUlDLE1BQU1DLE9BQU4sQ0FBY1AsS0FBS0ssR0FBTCxDQUFkLEtBQTRCTCxLQUFLSyxHQUFMLEVBQVVHLE1BQVYsS0FBcUIsQ0FBakQsSUFBc0QsT0FBT1IsS0FBS0ssR0FBTCxFQUFVLENBQVYsQ0FBUCxLQUF3QixRQUFsRixFQUE0RjtBQUN4Rkosb0JBQVFJLEdBQVIsSUFBZUwsS0FBS0ssR0FBTCxFQUFVLENBQVYsQ0FBZjtBQUNILFNBRkQsTUFFTztBQUNISixvQkFBUUksR0FBUixJQUFlTCxLQUFLSyxHQUFMLENBQWY7QUFDSDtBQUNKLEtBTkQ7O0FBUUEsV0FBT0osT0FBUDtBQUNIOztBQUVELFNBQVNRLHFCQUFULENBQStCVCxJQUEvQixFQUFxQztBQUNqQyxVQUFNQyxVQUFVLEVBQWhCOztBQUVBQyxXQUFPQyxJQUFQLENBQVlILElBQVosRUFBa0JJLE9BQWxCLENBQTJCQyxHQUFELElBQVM7QUFDL0IsWUFBSUMsTUFBTUMsT0FBTixDQUFjUCxLQUFLSyxHQUFMLENBQWQsQ0FBSixFQUE4QjtBQUMxQkosb0JBQVFJLEdBQVIsSUFBZUwsS0FBS0ssR0FBTCxFQUFVSyxHQUFWLENBQWVDLE9BQUQsSUFBYTtBQUN0QyxvQkFBSUMsR0FBSjs7QUFFQSxvQkFBSSxPQUFPRCxPQUFQLEtBQW1CLFFBQXZCLEVBQWlDO0FBQzdCQywwQkFBTUgsc0JBQXNCRSxPQUF0QixDQUFOO0FBQ0gsaUJBRkQsTUFFTztBQUNIQywwQkFBTUQsT0FBTjtBQUNIOztBQUVELHVCQUFPQyxHQUFQO0FBQ0gsYUFWYyxDQUFmOztBQVlBLGdCQUFJWixLQUFLSyxHQUFMLEVBQVVHLE1BQVYsS0FBcUIsQ0FBekIsRUFBNEI7QUFDeEJQLHdCQUFRSSxHQUFSLElBQWVKLFFBQVFJLEdBQVIsRUFBYSxDQUFiLENBQWY7QUFDSDtBQUNKLFNBaEJELE1BZ0JPO0FBQ0hKLG9CQUFRSSxHQUFSLElBQWVMLEtBQUtLLEdBQUwsQ0FBZjtBQUNIO0FBQ0osS0FwQkQ7O0FBc0JBLFdBQU9KLE9BQVA7QUFDSDs7a0JBRWM7QUFDWEYsMEJBRFc7QUFFWFU7QUFGVyxDIiwiZmlsZSI6ImNsZWFuX2FycmF5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gY2xlYW5BcnJheShpdGVtKSB7XG4gICAgY29uc3QgcmVidWlsZCA9IHt9O1xuXG4gICAgT2JqZWN0LmtleXMoaXRlbSkuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW1ba2V5XSkgJiYgaXRlbVtrZXldLmxlbmd0aCA9PT0gMSAmJiB0eXBlb2YgaXRlbVtrZXldWzBdICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmVidWlsZFtrZXldID0gaXRlbVtrZXldWzBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVidWlsZFtrZXldID0gaXRlbVtrZXldO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcmVidWlsZDtcbn1cblxuZnVuY3Rpb24gcmVjdXJzaXZlbHlDbGVhbkFycmF5KGl0ZW0pIHtcbiAgICBjb25zdCByZWJ1aWxkID0ge307XG5cbiAgICBPYmplY3Qua2V5cyhpdGVtKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbVtrZXldKSkge1xuICAgICAgICAgICAgcmVidWlsZFtrZXldID0gaXRlbVtrZXldLm1hcCgoc3ViaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZXM7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHN1Yml0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlcyA9IHJlY3Vyc2l2ZWx5Q2xlYW5BcnJheShzdWJpdGVtKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXMgPSBzdWJpdGVtO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJldHVybiByZXM7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKGl0ZW1ba2V5XS5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICByZWJ1aWxkW2tleV0gPSByZWJ1aWxkW2tleV1bMF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZWJ1aWxkW2tleV0gPSBpdGVtW2tleV07XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiByZWJ1aWxkO1xufVxuXG5leHBvcnQgZGVmYXVsdCB7XG4gICAgY2xlYW5BcnJheSxcbiAgICByZWN1cnNpdmVseUNsZWFuQXJyYXlcbn07XG4iXX0=