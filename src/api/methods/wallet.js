"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWalletBalance = exports.isWalletInitialized = exports.fetchAddress = exports.getWalletSeqno = exports.cancelDappRequest = exports.confirmDappRequestConnect = exports.confirmDappRequest = exports.verifyPassword = exports.getMnemonicWordList = exports.getMnemonic = void 0;
var tonWebMnemonic = require("tonweb-mnemonic");
var account_1 = require("../../util/account");
var blockchains_1 = require("../blockchains");
var accounts_1 = require("../common/accounts");
var dappPromises = require("../common/dappPromises");
var helpers_1 = require("../common/helpers");
var ton = blockchains_1.default.ton;
function getMnemonic(accountId, password) {
    var blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
    return blockchain.fetchMnemonic(accountId, password);
}
exports.getMnemonic = getMnemonic;
function getMnemonicWordList() {
    return tonWebMnemonic.wordlists.default;
}
exports.getMnemonicWordList = getMnemonicWordList;
function verifyPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        var accountId, blockchain;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, accounts_1.getAccountIdWithMnemonic)()];
                case 1:
                    accountId = _a.sent();
                    if (!accountId) {
                        throw new Error('The user is not authorized in the wallet');
                    }
                    blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
                    return [2 /*return*/, blockchain.verifyPassword(accountId, password)];
            }
        });
    });
}
exports.verifyPassword = verifyPassword;
function confirmDappRequest(promiseId, data) {
    dappPromises.resolveDappPromise(promiseId, data);
}
exports.confirmDappRequest = confirmDappRequest;
function confirmDappRequestConnect(promiseId, data) {
    dappPromises.resolveDappPromise(promiseId, data);
}
exports.confirmDappRequestConnect = confirmDappRequestConnect;
function cancelDappRequest(promiseId, reason) {
    dappPromises.rejectDappPromise(promiseId, reason);
}
exports.cancelDappRequest = cancelDappRequest;
function getWalletSeqno(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [2 /*return*/, ton.getWalletSeqno(network, address)];
            }
        });
    });
}
exports.getWalletSeqno = getWalletSeqno;
function fetchAddress(accountId) {
    return (0, accounts_1.fetchStoredAddress)(accountId);
}
exports.fetchAddress = fetchAddress;
function isWalletInitialized(network, address) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.isAddressInitialized(network, address);
}
exports.isWalletInitialized = isWalletInitialized;
function getWalletBalance(network, address) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.getWalletBalance(network, address);
}
exports.getWalletBalance = getWalletBalance;
