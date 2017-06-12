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
        keys: '', fields: '*', returnFormat: 'json', docparid: ''
    },
    readByName: {
        keys: '', fields: '*', returnFormat: 'json', docparid: ''
    },
    readByQuery: {
        query: '', fields: '*', pagesize: 20, returnFormat: 'json', docparid: ''
    },
    readRelated: {
        keys: '', fields: '*', relation: '', returnFormat: 'json'
    },
    readReport: {
        '@returnDef': false, report: '', waitTime: 30, listSeparator: '', pagesize: 100, returnFormat: 'json'
    },
    readView: {
        filters: '', pagesize: 100, returnFormat: 'json'
    }
};

export default {
    FUNCTION_NAMES,
    FUNCTION_PARAM_DEFAULTS
};
