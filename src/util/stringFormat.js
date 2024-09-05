"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertSubstring = exports.isAscii = void 0;
function isAscii(str) {
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) > 127) {
            return false;
        }
    }
    return true;
}
exports.isAscii = isAscii;
function insertSubstring(str, start, newSubStr) {
    if (start < 0) {
        start = str.length - start;
    }
    return str.slice(0, start) + newSubStr + str.slice(start);
}
exports.insertSubstring = insertSubstring;
