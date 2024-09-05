"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIsPositiveDecimal = exports.roundDecimal = exports.toBig = exports.toDecimal = exports.fromDecimal = void 0;
var config_1 = require("../config");
var big_js_1 = require("../lib/big.js");
big_js_1.Big.RM = 0; // RoundDown
big_js_1.Big.NE = -100000; // Disable exponential form
big_js_1.Big.PE = 100000; // Disable exponential form
var ten = (0, big_js_1.Big)(10);
function fromDecimal(value, decimals) {
    return BigInt((0, big_js_1.Big)(value).mul(ten.pow(decimals !== null && decimals !== void 0 ? decimals : config_1.DEFAULT_DECIMAL_PLACES)).round().toString());
}
exports.fromDecimal = fromDecimal;
function toDecimal(value, decimals, noFloor) {
    if (noFloor === void 0) { noFloor = false; }
    return toBig(value, decimals !== null && decimals !== void 0 ? decimals : config_1.DEFAULT_DECIMAL_PLACES, noFloor).toString();
}
exports.toDecimal = toDecimal;
function toBig(value, decimals, noFloor) {
    if (decimals === void 0) { decimals = config_1.DEFAULT_DECIMAL_PLACES; }
    if (noFloor === void 0) { noFloor = false; }
    return (0, big_js_1.Big)(value.toString()).div(ten.pow(decimals)).round(decimals, noFloor ? big_js_1.Big.roundHalfUp : undefined);
}
exports.toBig = toBig;
function roundDecimal(value, decimals) {
    return (0, big_js_1.Big)(value).round(decimals).toString();
}
exports.roundDecimal = roundDecimal;
function getIsPositiveDecimal(value) {
    return !value.startsWith('-');
}
exports.getIsPositiveDecimal = getIsPositiveDecimal;
