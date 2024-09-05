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
exports.getStakingCommonCache = exports.setStakingCommonCache = exports.updateAccountCache = exports.getAccountCache = void 0;
var stakingCommonCache;
var accountCache = {};
function getAccountCache(accountId, address) {
    var _a;
    return (_a = accountCache["".concat(accountId, ":").concat(address)]) !== null && _a !== void 0 ? _a : {};
}
exports.getAccountCache = getAccountCache;
function updateAccountCache(accountId, address, partial) {
    var key = "".concat(accountId, ":").concat(address);
    accountCache[key] = __assign(__assign({}, accountCache[key]), partial);
}
exports.updateAccountCache = updateAccountCache;
function setStakingCommonCache(data) {
    stakingCommonCache = data;
}
exports.setStakingCommonCache = setStakingCommonCache;
function getStakingCommonCache() {
    return stakingCommonCache;
}
exports.getStakingCommonCache = getStakingCommonCache;
