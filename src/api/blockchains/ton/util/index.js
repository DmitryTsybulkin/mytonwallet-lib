"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTokenSlug = exports.parseTxId = exports.stringifyTxId = exports.cloneDeep = void 0;
var bigint_1 = require("../../../../util/bigint");
function cloneDeep(value) {
    return JSON.parse(JSON.stringify(value), bigint_1.bigintReviver);
}
exports.cloneDeep = cloneDeep;
function stringifyTxId(_a) {
    var lt = _a.lt, hash = _a.hash;
    return "".concat(lt, ":").concat(hash);
}
exports.stringifyTxId = stringifyTxId;
function parseTxId(txId) {
    var _a = txId.split(':'), lt = _a[0], hash = _a[1];
    return { lt: Number(lt), hash: hash };
}
exports.parseTxId = parseTxId;
function buildTokenSlug(minterAddress) {
    var addressPart = minterAddress.replace(/[^a-z\d]/gi, '').slice(0, 10);
    return "ton-".concat(addressPart).toLowerCase();
}
exports.buildTokenSlug = buildTokenSlug;
