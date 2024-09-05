"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKnownStakingPool = exports.base64ToString = exports.base64ToBytes = exports.bytesToBase64 = exports.hexToBytes = exports.bytesToHex = exports.sha256 = void 0;
var config_1 = require("../../config");
function sha256(bytes) {
    return crypto.subtle.digest('SHA-256', bytes);
}
exports.sha256 = sha256;
function bytesToHex(bytes) {
    return Buffer.from(bytes).toString('hex');
}
exports.bytesToHex = bytesToHex;
function hexToBytes(hex) {
    return Uint8Array.from(Buffer.from(hex, 'hex'));
}
exports.hexToBytes = hexToBytes;
function bytesToBase64(bytes) {
    return Buffer.from(bytes).toString('base64');
}
exports.bytesToBase64 = bytesToBase64;
function base64ToBytes(base64) {
    return Uint8Array.from(Buffer.from(base64, 'base64'));
}
exports.base64ToBytes = base64ToBytes;
function base64ToString(base64) {
    return Buffer.from(base64, 'base64').toString('utf-8');
}
exports.base64ToString = base64ToString;
function isKnownStakingPool(address) {
    return config_1.STAKING_POOLS.some(function (poolPart) { return address.endsWith(poolPart); });
}
exports.isKnownStakingPool = isKnownStakingPool;
