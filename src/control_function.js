class ControlFunction {
    constructor(name, params = {}) {
        if (!name) {
            throw new Error('Missing control function name');
        }

        this.name = name;
        this.parameters = params;
    }

    toXML() {
        return 'stuff';
    }
}

export default {
    ControlFunction
};
