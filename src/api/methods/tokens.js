"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTokenBalancesByAddress = exports.fetchTokenBalances = exports.buildTokenSlug = exports.resolveTokenMinterAddress = exports.resolveTokenWalletAddress = exports.resolveTokenBySlug = exports.fetchToken = void 0;
var account_1 = require("../../util/account");
var blockchains_1 = require("../blockchains");
function fetchToken(accountId, address) {
    var _a = (0, account_1.parseAccountId)(accountId), network = _a.network, blockchainKey = _a.blockchain;
    var blockchain = blockchains_1.default[blockchainKey];
    return blockchain.fetchToken(network, address);
}
exports.fetchToken = fetchToken;
function resolveTokenBySlug(slug) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.resolveTokenBySlug(slug);
}
exports.resolveTokenBySlug = resolveTokenBySlug;
function resolveTokenWalletAddress(network, address, minterAddress) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.resolveTokenWalletAddress(network, address, minterAddress);
}
exports.resolveTokenWalletAddress = resolveTokenWalletAddress;
function resolveTokenMinterAddress(network, tokenWalletAddress) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.resolveTokenMinterAddress(network, tokenWalletAddress);
}
exports.resolveTokenMinterAddress = resolveTokenMinterAddress;
function buildTokenSlug(address) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.buildTokenSlug(address);
}
exports.buildTokenSlug = buildTokenSlug;
function fetchTokenBalances(accountId) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.getAccountTokenBalances(accountId);
}
exports.fetchTokenBalances = fetchTokenBalances;
function fetchTokenBalancesByAddress(address, network) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.getAddressTokenBalances(address, network);
}
exports.fetchTokenBalancesByAddress = fetchTokenBalancesByAddress;
