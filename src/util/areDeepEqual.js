"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.areDeepEqual = void 0;
function areDeepEqual(value1, value2) {
    var type1 = typeof value1;
    var type2 = typeof value2;
    if (type1 !== type2) {
        return false;
    }
    // eslint-disable-next-line no-null/no-null
    if (type1 !== 'object' || value1 === null || value2 === null) {
        return value1 === value2;
    }
    var isArray1 = Array.isArray(value1);
    var isArray2 = Array.isArray(value2);
    if (isArray1 !== isArray2) {
        return false;
    }
    if (isArray1) {
        var array1 = value1;
        var array2_1 = value2;
        if (array1.length !== array2_1.length) {
            return false;
        }
        return array1.every(function (member1, i) { return areDeepEqual(member1, array2_1[i]); });
    }
    var object1 = value1;
    var object2 = value2;
    var keys1 = Object.keys(object1);
    return keys1.every(function (key1) { return areDeepEqual(object1[key1], object2[key1]); });
}
exports.areDeepEqual = areDeepEqual;
