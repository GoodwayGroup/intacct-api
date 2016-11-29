function cleanArray(item) {
    const rebuild = {};

    Object.keys(item).forEach((key) => {
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

    Object.keys(item).forEach((key) => {
        if (Array.isArray(item[key])) {
            rebuild[key] = item[key].map((subitem) => {
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

export default {
    cleanArray,
    recursivelyCleanArray
};
