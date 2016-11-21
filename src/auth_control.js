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
            authenication: auth
        });
    }
}

export default {
    AuthControl
};
