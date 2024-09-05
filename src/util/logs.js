"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logDebug = exports.logDebugError = void 0;
var config_1 = require("../config");
function logDebugError(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (config_1.DEBUG) {
        // eslint-disable-next-line no-console
        console.error.apply(console, __spreadArray(["[DEBUG][".concat(message, "]")], args, false));
    }
}
exports.logDebugError = logDebugError;
function logDebug(message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    if (config_1.DEBUG) {
        // eslint-disable-next-line no-console
        console.log.apply(console, __spreadArray(["[DEBUG] ".concat(message)], args, false));
    }
}
exports.logDebug = logDebug;
