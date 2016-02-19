import {
  isArray,
  isObject,
  isString,
  forEach,
  joinPath
} from './utils';

function create(separator, parentPath, current) {
    return function path(name) {
        return joinPath(separator, parentPath, current, name);
    };
}

function transform(separator, parent, current) {
    forEach(current, (val, key) => {
        if (isString(val)) {
            parent[key] = create(separator, parent(), val);
        } else if (isArray(val)) {
            parent[key] = create(separator, parent(), key);

            forEach(val, i => {
                parent[key][i] = create(separator, parent[key](), i);
            });
        } else if (isObject(val)) {
            parent[key] = create(separator, parent(), key);
            transform(separator, parent[key], val);
        }
    });

    return parent;
}

export default function createPathMap(target, separator = '/') {
    return transform(separator, create(separator), target);
}