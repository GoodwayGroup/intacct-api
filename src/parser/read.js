import { recursivelyCleanArray } from '../clean_array';

function read(data) {
    const res = {};
    const attr = data[0].$;
    const list = data[0][attr.listtype];

    res.$ = attr;

    res[attr.listtype] = list ? list.map(recursivelyCleanArray) : [];

    return res;
}

export default {
    read
};
