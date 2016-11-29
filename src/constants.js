const FUNCTION_NAMES = [
    'consolidate',
    'create',
    'delete',
    'getAPISession',
    'getUserPermissions',
    'inspect',
    'installApp',
    'read',
    'readByName',
    'readByQuery',
    'readMore',
    'readRelated',
    'readReport',
    'readView',
    'update'
];

const FUNCTION_PARAM_DEFAULTS = {
    read: {
        keys: '', fields: '*', returnFormat: 'xml', docparid: ''
    },
    readByName: {
        keys: '', fields: '*', returnFormat: 'xml', docparid: ''
    },
    readByQuery: {
        query: '', fields: '*', pagesize: 100, returnFormat: 'xml', docparid: ''
    },
    readRelated: {
        keys: '', fields: '*', relation: '', returnFormat: 'xml'
    },
    readReport: {
        '@returnDef': false, report: '', waitTime: 30, listSeparator: '', pagesize: 100, returnFormat: 'xml'
    },
    readView: {
        filters: '', pagesize: 100, returnFormat: 'xml'
    }
};

export default {
    FUNCTION_NAMES,
    FUNCTION_PARAM_DEFAULTS
};
