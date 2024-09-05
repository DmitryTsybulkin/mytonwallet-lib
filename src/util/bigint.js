"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bigintMultiplyToNumber = exports.bigintDivideToNumber = exports.bigintAbs = exports.bigintReviver = void 0;
var config_1 = require("../config");
var decimals_1 = require("./decimals");
var PREFIX = 'bigint:';
// @ts-ignore
BigInt.prototype.toJSON = function toJSON() {
    return "".concat(PREFIX).concat(this);
};
function bigintReviver(key, value) {
    if (typeof value === 'string' && value.startsWith(PREFIX)) {
        return BigInt(value.slice(7));
    }
    return value;
}
exports.bigintReviver = bigintReviver;
function bigintAbs(value) {
    return value === -0n || value < 0n ? -value : value;
}
exports.bigintAbs = bigintAbs;
function bigintDivideToNumber(value, num) {
    return (value * config_1.ONE_TON) / (0, decimals_1.fromDecimal)(num);
}
exports.bigintDivideToNumber = bigintDivideToNumber;
function bigintMultiplyToNumber(value, num) {
    return (value * (0, decimals_1.fromDecimal)(num)) / config_1.ONE_TON;
}
exports.bigintMultiplyToNumber = bigintMultiplyToNumber;
