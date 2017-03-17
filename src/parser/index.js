import { inspect } from './inspect';
import { errormessage } from './error_message';
import { read } from './read';

export default {
    inspect,
    errormessage,
    read,
    readByQuery: read,
    readByName: read,
    readMore: read
};
