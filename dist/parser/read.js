'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _clean_array = require('../clean_array');

function read(data) {
    const res = {};
    const attr = data[0].$;
    const list = data[0][attr.listtype];

    res.$ = attr;

    res[attr.listtype] = list ? list.map(_clean_array.recursivelyCleanArray) : [];

    return res;
}

exports.default = {
    read: read
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXJzZXIvcmVhZC5qcyJdLCJuYW1lcyI6WyJyZWFkIiwiZGF0YSIsInJlcyIsImF0dHIiLCIkIiwibGlzdCIsImxpc3R0eXBlIiwibWFwIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFFQSxTQUFTQSxJQUFULENBQWNDLElBQWQsRUFBb0I7QUFDaEIsVUFBTUMsTUFBTSxFQUFaO0FBQ0EsVUFBTUMsT0FBT0YsS0FBSyxDQUFMLEVBQVFHLENBQXJCO0FBQ0EsVUFBTUMsT0FBT0osS0FBSyxDQUFMLEVBQVFFLEtBQUtHLFFBQWIsQ0FBYjs7QUFFQUosUUFBSUUsQ0FBSixHQUFRRCxJQUFSOztBQUVBRCxRQUFJQyxLQUFLRyxRQUFULElBQXFCRCxPQUFPQSxLQUFLRSxHQUFMLG9DQUFQLEdBQXlDLEVBQTlEOztBQUVBLFdBQU9MLEdBQVA7QUFDSDs7a0JBRWM7QUFDWEY7QUFEVyxDIiwiZmlsZSI6InJlYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWN1cnNpdmVseUNsZWFuQXJyYXkgfSBmcm9tICcuLi9jbGVhbl9hcnJheSc7XG5cbmZ1bmN0aW9uIHJlYWQoZGF0YSkge1xuICAgIGNvbnN0IHJlcyA9IHt9O1xuICAgIGNvbnN0IGF0dHIgPSBkYXRhWzBdLiQ7XG4gICAgY29uc3QgbGlzdCA9IGRhdGFbMF1bYXR0ci5saXN0dHlwZV07XG5cbiAgICByZXMuJCA9IGF0dHI7XG5cbiAgICByZXNbYXR0ci5saXN0dHlwZV0gPSBsaXN0ID8gbGlzdC5tYXAocmVjdXJzaXZlbHlDbGVhbkFycmF5KSA6IFtdO1xuXG4gICAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGRlZmF1bHQge1xuICAgIHJlYWRcbn07XG4iXX0=