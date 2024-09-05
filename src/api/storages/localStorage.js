"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var iteratees_1 = require("../../util/iteratees");
function withPromise(fn) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return Promise.resolve(fn.apply(void 0, args));
    };
}
exports.default = (typeof localStorage === 'object' ? {
    getItem: withPromise(localStorage.getItem),
    setItem: localStorage.setItem,
    removeItem: localStorage.removeItem,
    clear: localStorage.clear,
    getAll: withPromise(function () { return (__assign({}, localStorage)); }),
    getMany: withPromise(function (keys) { return (0, iteratees_1.pick)(localStorage, keys); }),
    setMany: function (items) {
        Object.assign(localStorage, items);
    },
} : {});
