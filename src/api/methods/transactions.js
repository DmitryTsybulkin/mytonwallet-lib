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
exports.createLocalTransaction = exports.decryptComment = exports.sendSignedTransferMessages = exports.sendSignedTransferMessage = exports.waitLastTransfer = exports.submitTransfer = exports.checkTransactionDraft = exports.fetchAllActivitySlice = exports.fetchTokenActivitySlice = exports.initTransactions = void 0;
var account_1 = require("../../util/account");
var logs_1 = require("../../util/logs");
var blockchains_1 = require("../blockchains");
var accounts_1 = require("../common/accounts");
var helpers_1 = require("../common/helpers");
var errors_1 = require("../errors");
var swap_1 = require("./swap");
var onUpdate;
function initTransactions(_onUpdate) {
    onUpdate = _onUpdate;
}
exports.initTransactions = initTransactions;
function fetchTokenActivitySlice(accountId, slug, fromTxId, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, network, blockchain, activeBlockchain, transactions, activities, err_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, account_1.parseAccountId)(accountId), network = _a.network, blockchain = _a.blockchain;
                    activeBlockchain = blockchains_1.default[blockchain];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, activeBlockchain.getTokenTransactionSlice(accountId, slug, fromTxId, undefined, limit)];
                case 2:
                    transactions = _b.sent();
                    return [4 /*yield*/, (0, swap_1.swapReplaceTransactions)(accountId, transactions, network, slug)];
                case 3:
                    activities = _b.sent();
                    return [4 /*yield*/, activeBlockchain.fixTokenActivitiesAddressForm(network, activities)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, activities];
                case 5:
                    err_1 = _b.sent();
                    (0, logs_1.logDebugError)('fetchTokenActivitySlice', err_1);
                    return [2 /*return*/, (0, errors_1.handleServerError)(err_1)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.fetchTokenActivitySlice = fetchTokenActivitySlice;
function fetchAllActivitySlice(accountId, lastTxIds, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, network, blockchain, activeBlockchain, transactions, activities, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, account_1.parseAccountId)(accountId), network = _a.network, blockchain = _a.blockchain;
                    activeBlockchain = blockchains_1.default[blockchain];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, activeBlockchain.getMergedTransactionSlice(accountId, lastTxIds, limit)];
                case 2:
                    transactions = _b.sent();
                    return [4 /*yield*/, (0, swap_1.swapReplaceTransactions)(accountId, transactions, network)];
                case 3:
                    activities = _b.sent();
                    return [4 /*yield*/, activeBlockchain.fixTokenActivitiesAddressForm(network, activities)];
                case 4:
                    _b.sent();
                    return [2 /*return*/, activities];
                case 5:
                    err_2 = _b.sent();
                    (0, logs_1.logDebugError)('fetchAllActivitySlice', err_2);
                    return [2 /*return*/, (0, errors_1.handleServerError)(err_2)];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.fetchAllActivitySlice = fetchAllActivitySlice;
function checkTransactionDraft(accountId, slug, toAddress, amount, comment, shouldEncrypt) {
    var blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
    return blockchain.checkTransactionDraft(accountId, slug, toAddress, amount, comment, undefined, shouldEncrypt);
}
exports.checkTransactionDraft = checkTransactionDraft;
function submitTransfer(options_1) {
    return __awaiter(this, arguments, void 0, function (options, shouldCreateLocalTransaction) {
        var accountId, password, slug, toAddress, amount, comment, fee, shouldEncrypt, blockchain, fromAddress, result, encryptedComment, localTransaction;
        if (shouldCreateLocalTransaction === void 0) { shouldCreateLocalTransaction = true; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accountId = options.accountId, password = options.password, slug = options.slug, toAddress = options.toAddress, amount = options.amount, comment = options.comment, fee = options.fee, shouldEncrypt = options.shouldEncrypt;
                    blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    fromAddress = _a.sent();
                    return [4 /*yield*/, blockchain.submitTransfer(accountId, password, slug, toAddress, amount, comment, undefined, shouldEncrypt)];
                case 2:
                    result = _a.sent();
                    if ('error' in result) {
                        return [2 /*return*/, result];
                    }
                    encryptedComment = result.encryptedComment;
                    if (!shouldCreateLocalTransaction) {
                        return [2 /*return*/, result];
                    }
                    localTransaction = createLocalTransaction(accountId, {
                        amount: amount,
                        fromAddress: fromAddress,
                        toAddress: toAddress,
                        comment: shouldEncrypt ? undefined : comment,
                        encryptedComment: encryptedComment,
                        fee: fee || 0n,
                        slug: slug,
                    });
                    return [2 /*return*/, __assign(__assign({}, result), { txId: localTransaction.txId })];
            }
        });
    });
}
exports.submitTransfer = submitTransfer;
function waitLastTransfer(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchain, network, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockchain = blockchains_1.default.ton;
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [2 /*return*/, blockchain.waitLastTransfer(network, address)];
            }
        });
    });
}
exports.waitLastTransfer = waitLastTransfer;
function sendSignedTransferMessage(accountId, message) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchain, localTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
                    return [4 /*yield*/, blockchain.sendSignedMessage(accountId, message)];
                case 1:
                    _a.sent();
                    localTransaction = createLocalTransaction(accountId, message.params);
                    return [2 /*return*/, localTransaction.txId];
            }
        });
    });
}
exports.sendSignedTransferMessage = sendSignedTransferMessage;
function sendSignedTransferMessages(accountId, messages) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchain, result, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockchain = blockchains_1.default.ton;
                    return [4 /*yield*/, blockchain.sendSignedMessages(accountId, messages)];
                case 1:
                    result = _a.sent();
                    for (i = 0; i < result.successNumber; i++) {
                        createLocalTransaction(accountId, messages[i].params);
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.sendSignedTransferMessages = sendSignedTransferMessages;
function decryptComment(accountId, encryptedComment, fromAddress, password) {
    var blockchain = blockchains_1.default.ton;
    return blockchain.decryptComment(accountId, encryptedComment, fromAddress, password);
}
exports.decryptComment = decryptComment;
function createLocalTransaction(accountId, params) {
    var _a = (0, account_1.parseAccountId)(accountId), blockchainKey = _a.blockchain, network = _a.network;
    var blockchain = blockchains_1.default[blockchainKey];
    var toAddress = params.toAddress;
    var normalizedAddress = blockchain.normalizeAddress(toAddress, network);
    var localTransaction = (0, helpers_1.buildLocalTransaction)(params, normalizedAddress);
    onUpdate({
        type: 'newLocalTransaction',
        transaction: localTransaction,
        accountId: accountId,
    });
    return localTransaction;
}
exports.createLocalTransaction = createLocalTransaction;
