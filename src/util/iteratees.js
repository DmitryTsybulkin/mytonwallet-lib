"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractKey = exports.fromKeyValueArrays = exports.range = exports.findLast = exports.cloneDeep = exports.split = exports.areSortedArraysEqual = exports.compact = exports.unique = exports.orderBy = exports.omit = exports.pickTruthy = exports.pick = exports.mapValues = exports.buildCollectionByKey = void 0;
function buildCollectionByKey(collection, key) {
    return collection.reduce(function (byKey, member) {
        byKey[member[key]] = member;
        return byKey;
    }, {});
}
exports.buildCollectionByKey = buildCollectionByKey;
function mapValues(byKey, callback) {
    return Object.keys(byKey).reduce(function (newByKey, key, index) {
        newByKey[key] = callback(byKey[key], key, index, byKey);
        return newByKey;
    }, {});
}
exports.mapValues = mapValues;
function pick(object, keys) {
    return keys.reduce(function (result, key) {
        result[key] = object[key];
        return result;
    }, {});
}
exports.pick = pick;
function pickTruthy(object, keys) {
    return keys.reduce(function (result, key) {
        if (object[key]) {
            result[key] = object[key];
        }
        return result;
    }, {});
}
exports.pickTruthy = pickTruthy;
function omit(object, keys) {
    var stringKeys = new Set(keys.map(String));
    var savedKeys = Object.keys(object)
        .filter(function (key) { return !stringKeys.has(key); });
    return pick(object, savedKeys);
}
exports.omit = omit;
function orderBy(collection, orderRule, mode) {
    if (mode === void 0) { mode = 'asc'; }
    function compareValues(a, b, currentOrderRule, isAsc) {
        var aValue = (typeof currentOrderRule === 'function' ? currentOrderRule(a) : a[currentOrderRule]) || 0;
        var bValue = (typeof currentOrderRule === 'function' ? currentOrderRule(b) : b[currentOrderRule]) || 0;
        return isAsc ? aValue - bValue : bValue - aValue;
    }
    if (Array.isArray(orderRule)) {
        var _a = Array.isArray(mode) ? mode : [mode, mode], mode1 = _a[0], mode2 = _a[1];
        var orderRule1_1 = orderRule[0], orderRule2_1 = orderRule[1];
        var isAsc1_1 = mode1 === 'asc';
        var isAsc2_1 = mode2 === 'asc';
        return collection.sort(function (a, b) {
            return compareValues(a, b, orderRule1_1, isAsc1_1) || compareValues(a, b, orderRule2_1, isAsc2_1);
        });
    }
    var isAsc = mode === 'asc';
    return collection.sort(function (a, b) {
        return compareValues(a, b, orderRule, isAsc);
    });
}
exports.orderBy = orderBy;
function unique(array) {
    return Array.from(new Set(array));
}
exports.unique = unique;
function compact(array) {
    return array.filter(Boolean);
}
exports.compact = compact;
function areSortedArraysEqual(array1, array2) {
    if (array1.length !== array2.length) {
        return false;
    }
    return array1.every(function (item, i) { return item === array2[i]; });
}
exports.areSortedArraysEqual = areSortedArraysEqual;
function split(array, chunkSize) {
    var result = [];
    for (var i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}
exports.split = split;
function cloneDeep(value) {
    if (!isObject(value)) {
        return value;
    }
    if (Array.isArray(value)) {
        return value.map(cloneDeep);
    }
    return Object.keys(value).reduce(function (acc, key) {
        acc[key] = cloneDeep(value[key]);
        return acc;
    }, {});
}
exports.cloneDeep = cloneDeep;
function isObject(value) {
    // eslint-disable-next-line no-null/no-null
    return typeof value === 'object' && value !== null;
}
function findLast(array, predicate) {
    var cursor = array.length;
    while (cursor--) {
        if (predicate(array[cursor], cursor, array)) {
            return array[cursor];
        }
    }
    return undefined;
}
exports.findLast = findLast;
function range(start, end) {
    var arr = [];
    for (var i = start; i < end;) {
        arr.push(i++);
    }
    return arr;
}
exports.range = range;
function fromKeyValueArrays(keys, values) {
    return keys.reduce(function (acc, key, index) {
        acc[key] = Array.isArray(values) ? values[index] : values;
        return acc;
    }, {});
}
exports.fromKeyValueArrays = fromKeyValueArrays;
function extractKey(array, key) {
    return array.map(function (value) { return value[key]; });
}
exports.extractKey = extractKey;
