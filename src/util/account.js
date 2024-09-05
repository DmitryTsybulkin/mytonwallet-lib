"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAccountId = exports.parseAccountId = void 0;
function parseAccountId(accountId) {
    var _a = accountId.split('-'), id = _a[0], _b = _a[1], blockchain = _b === void 0 ? 'ton' : _b, // Handle deprecated case when `accountId = '0'`
    _c = _a[2], // Handle deprecated case when `accountId = '0'`
    network = _c === void 0 ? 'mainnet' : _c;
    return {
        id: Number(id),
        blockchain: blockchain,
        network: network,
    };
}
exports.parseAccountId = parseAccountId;
function buildAccountId(account) {
    var id = account.id, network = account.network, blockchain = account.blockchain;
    return "".concat(id, "-").concat(blockchain, "-").concat(network);
}
exports.buildAccountId = buildAccountId;
