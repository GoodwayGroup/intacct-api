'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
class AuthControl {
    constructor(params) {
        this.parameters = params;

        this.senderId = params.senderId;
        this.senderPassword = params.senderPassword;

        if (params.sessionId) {
            this.authType = 'session';
            this.sessionId = params.sessionId;
        } else {
            this.authType = 'login';
            this.userId = params.userId;
            this.companyId = params.companyId;
            this.password = params.password;
        }
    }

    toXML(root) {
        let auth;

        if (this.authType === 'session') {
            auth = {
                sessionid: this.sessionId
            };
        } else {
            auth = {
                login: {
                    userid: this.userId,
                    companyid: this.companyId,
                    password: this.password
                }
            };
        }

        return root.ele({
            authentication: auth
        });
    }
}

exports.default = {
    AuthControl: AuthControl
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9hdXRoX2NvbnRyb2wuanMiXSwibmFtZXMiOlsiQXV0aENvbnRyb2wiLCJjb25zdHJ1Y3RvciIsInBhcmFtcyIsInBhcmFtZXRlcnMiLCJzZW5kZXJJZCIsInNlbmRlclBhc3N3b3JkIiwic2Vzc2lvbklkIiwiYXV0aFR5cGUiLCJ1c2VySWQiLCJjb21wYW55SWQiLCJwYXNzd29yZCIsInRvWE1MIiwicm9vdCIsImF1dGgiLCJzZXNzaW9uaWQiLCJsb2dpbiIsInVzZXJpZCIsImNvbXBhbnlpZCIsImVsZSIsImF1dGhlbnRpY2F0aW9uIl0sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE1BQU1BLFdBQU4sQ0FBa0I7QUFDZEMsZ0JBQVlDLE1BQVosRUFBb0I7QUFDaEIsYUFBS0MsVUFBTCxHQUFrQkQsTUFBbEI7O0FBRUEsYUFBS0UsUUFBTCxHQUFnQkYsT0FBT0UsUUFBdkI7QUFDQSxhQUFLQyxjQUFMLEdBQXNCSCxPQUFPRyxjQUE3Qjs7QUFFQSxZQUFJSCxPQUFPSSxTQUFYLEVBQXNCO0FBQ2xCLGlCQUFLQyxRQUFMLEdBQWdCLFNBQWhCO0FBQ0EsaUJBQUtELFNBQUwsR0FBaUJKLE9BQU9JLFNBQXhCO0FBQ0gsU0FIRCxNQUdPO0FBQ0gsaUJBQUtDLFFBQUwsR0FBZ0IsT0FBaEI7QUFDQSxpQkFBS0MsTUFBTCxHQUFjTixPQUFPTSxNQUFyQjtBQUNBLGlCQUFLQyxTQUFMLEdBQWlCUCxPQUFPTyxTQUF4QjtBQUNBLGlCQUFLQyxRQUFMLEdBQWdCUixPQUFPUSxRQUF2QjtBQUNIO0FBQ0o7O0FBRURDLFVBQU1DLElBQU4sRUFBWTtBQUNSLFlBQUlDLElBQUo7O0FBRUEsWUFBSSxLQUFLTixRQUFMLEtBQWtCLFNBQXRCLEVBQWlDO0FBQzdCTSxtQkFBTztBQUNIQywyQkFBVyxLQUFLUjtBQURiLGFBQVA7QUFHSCxTQUpELE1BSU87QUFDSE8sbUJBQU87QUFDSEUsdUJBQU87QUFDSEMsNEJBQVEsS0FBS1IsTUFEVjtBQUVIUywrQkFBVyxLQUFLUixTQUZiO0FBR0hDLDhCQUFVLEtBQUtBO0FBSFo7QUFESixhQUFQO0FBT0g7O0FBRUQsZUFBT0UsS0FBS00sR0FBTCxDQUFTO0FBQ1pDLDRCQUFnQk47QUFESixTQUFULENBQVA7QUFHSDtBQXRDYTs7a0JBeUNIO0FBQ1hiO0FBRFcsQyIsImZpbGUiOiJhdXRoX2NvbnRyb2wuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjbGFzcyBBdXRoQ29udHJvbCB7XG4gICAgY29uc3RydWN0b3IocGFyYW1zKSB7XG4gICAgICAgIHRoaXMucGFyYW1ldGVycyA9IHBhcmFtcztcblxuICAgICAgICB0aGlzLnNlbmRlcklkID0gcGFyYW1zLnNlbmRlcklkO1xuICAgICAgICB0aGlzLnNlbmRlclBhc3N3b3JkID0gcGFyYW1zLnNlbmRlclBhc3N3b3JkO1xuXG4gICAgICAgIGlmIChwYXJhbXMuc2Vzc2lvbklkKSB7XG4gICAgICAgICAgICB0aGlzLmF1dGhUeXBlID0gJ3Nlc3Npb24nO1xuICAgICAgICAgICAgdGhpcy5zZXNzaW9uSWQgPSBwYXJhbXMuc2Vzc2lvbklkO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5hdXRoVHlwZSA9ICdsb2dpbic7XG4gICAgICAgICAgICB0aGlzLnVzZXJJZCA9IHBhcmFtcy51c2VySWQ7XG4gICAgICAgICAgICB0aGlzLmNvbXBhbnlJZCA9IHBhcmFtcy5jb21wYW55SWQ7XG4gICAgICAgICAgICB0aGlzLnBhc3N3b3JkID0gcGFyYW1zLnBhc3N3b3JkO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9YTUwocm9vdCkge1xuICAgICAgICBsZXQgYXV0aDtcblxuICAgICAgICBpZiAodGhpcy5hdXRoVHlwZSA9PT0gJ3Nlc3Npb24nKSB7XG4gICAgICAgICAgICBhdXRoID0ge1xuICAgICAgICAgICAgICAgIHNlc3Npb25pZDogdGhpcy5zZXNzaW9uSWRcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhdXRoID0ge1xuICAgICAgICAgICAgICAgIGxvZ2luOiB7XG4gICAgICAgICAgICAgICAgICAgIHVzZXJpZDogdGhpcy51c2VySWQsXG4gICAgICAgICAgICAgICAgICAgIGNvbXBhbnlpZDogdGhpcy5jb21wYW55SWQsXG4gICAgICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByb290LmVsZSh7XG4gICAgICAgICAgICBhdXRoZW50aWNhdGlvbjogYXV0aFxuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBBdXRoQ29udHJvbFxufTtcbiJdfQ==