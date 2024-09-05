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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixTokenActivitiesAddressForm = exports.fetchNewestTxId = exports.waitUntilTransactionAppears = exports.decryptComment = exports.sendSignedMessages = exports.sendSignedMessage = exports.waitLastTransfer = exports.submitMultiTransfer = exports.checkMultiTransactionDraft = exports.getTokenTransactionSlice = exports.getMergedTransactionSlice = exports.getAccountTransactionSlice = exports.getAccountNewestTxId = exports.resolveTransactionError = exports.submitTransfer = exports.checkTransactionDraft = exports.checkHasTransaction = void 0;
var core_1 = require("@ton/core");
var types_1 = require("../../types");
var config_1 = require("../../../config");
var account_1 = require("../../../util/account");
var bigint_1 = require("../../../util/bigint");
var compareActivities_1 = require("../../../util/compareActivities");
var iteratees_1 = require("../../../util/iteratees");
var logs_1 = require("../../../util/logs");
var schedulers_1 = require("../../../util/schedulers");
var stringFormat_1 = require("../../../util/stringFormat");
var withCacheAsync_1 = require("../../../util/withCacheAsync");
var util_1 = require("./util");
var apiV3_1 = require("./util/apiV3");
var encryption_1 = require("./util/encryption");
var metadata_1 = require("./util/metadata");
var tonCore_1 = require("./util/tonCore");
var accounts_1 = require("../../common/accounts");
var addresses_1 = require("../../common/addresses");
var helpers_1 = require("../../common/helpers");
var utils_1 = require("../../common/utils");
var errors_1 = require("../../errors");
var address_1 = require("./address");
var auth_1 = require("./auth");
var constants_1 = require("./constants");
var tokens_1 = require("./tokens");
var wallet_1 = require("./wallet");
var DEFAULT_EXPIRE_AT_TIMEOUT_SEC = 60; // 60 sec.
var GET_TRANSACTIONS_LIMIT = 50;
var GET_TRANSACTIONS_MAX_LIMIT = 100;
var WAIT_SEQNO_TIMEOUT = 40000; // 40 sec.
var WAIT_SEQNO_PAUSE = 5000; // 5 sec.
var WAIT_TRANSACTION_PAUSE = 500; // 0.5 sec.
var lastTransfers = {
    mainnet: {},
    testnet: {},
};
exports.checkHasTransaction = (0, withCacheAsync_1.default)(function (network, address) { return __awaiter(void 0, void 0, void 0, function () {
    var transactions;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, apiV3_1.fetchTransactions)(network, address, 1)];
            case 1:
                transactions = _a.sent();
                return [2 /*return*/, Boolean(transactions.length)];
        }
    });
}); });
function checkTransactionDraft(accountId, tokenSlug, toAddress, amount, data, stateInit, shouldEncrypt, isBase64Data) {
    return __awaiter(this, void 0, void 0, function () {
        var network, result, resolved, _a, isValid, isUserFriendly, isTestOnly, isBounceable, regex, isUrlSafe, _b, isInitialized, isLedgerAllowed, _c, addressInfo, wallet, toPublicKey, account, isLedger, error, address, tokenAmount, tokenWallet, tokenBalance, transaction, realFee, balance, err_1;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    result = {};
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 19, , 20]);
                    return [4 /*yield*/, (0, address_1.resolveAddress)(network, toAddress)];
                case 2:
                    resolved = _e.sent();
                    if (resolved) {
                        result.addressName = resolved.domain;
                        toAddress = resolved.address;
                    }
                    else {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.DomainNotResolved })];
                    }
                    _a = (0, tonCore_1.parseAddress)(toAddress), isValid = _a.isValid, isUserFriendly = _a.isUserFriendly, isTestOnly = _a.isTestOnly, isBounceable = _a.isBounceable;
                    if (!isValid) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.InvalidToAddress })];
                    }
                    regex = /[+=/]/;
                    isUrlSafe = !regex.test(toAddress);
                    if (!isUserFriendly || !isUrlSafe || (network === 'mainnet' && isTestOnly)) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.InvalidAddressFormat })];
                    }
                    return [4 /*yield*/, (0, wallet_1.getContractInfo)(network, toAddress)];
                case 3:
                    _b = _e.sent(), isInitialized = _b.isInitialized, isLedgerAllowed = _b.isLedgerAllowed;
                    if (!(isBounceable && !isInitialized)) return [3 /*break*/, 5];
                    _c = result;
                    return [4 /*yield*/, (0, exports.checkHasTransaction)(network, toAddress)];
                case 4:
                    _c.isToAddressNew = !(_e.sent());
                    if (tokenSlug === config_1.TON_TOKEN_SLUG) {
                        // Force non-bounceable for non-initialized recipients
                        toAddress = (0, tonCore_1.toBase64Address)(toAddress, false, network);
                    }
                    _e.label = 5;
                case 5:
                    result.resolvedAddress = toAddress;
                    return [4 /*yield*/, (0, addresses_1.getAddressInfo)((0, tonCore_1.toBase64Address)(toAddress, true))];
                case 6:
                    addressInfo = _e.sent();
                    if (addressInfo === null || addressInfo === void 0 ? void 0 : addressInfo.name)
                        result.addressName = addressInfo.name;
                    if (addressInfo === null || addressInfo === void 0 ? void 0 : addressInfo.isScam)
                        result.isScam = addressInfo.isScam;
                    if (amount < 0n) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.InvalidAmount })];
                    }
                    return [4 /*yield*/, (0, wallet_1.pickAccountWallet)(accountId)];
                case 7:
                    wallet = _e.sent();
                    if (!wallet) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiCommonError.Unexpected })];
                    }
                    if (typeof data === 'string' && isBase64Data) {
                        data = (0, utils_1.base64ToBytes)(data);
                    }
                    if (!(data && typeof data === 'string' && shouldEncrypt)) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, tonCore_1.getWalletPublicKey)(network, toAddress)];
                case 8:
                    toPublicKey = _e.sent();
                    if (!toPublicKey) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.WalletNotInitialized })];
                    }
                    _e.label = 9;
                case 9: return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 10:
                    account = _e.sent();
                    isLedger = !!account.ledger;
                    if (isLedger && !isLedgerAllowed) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.UnsupportedHardwareContract })];
                    }
                    if (data && typeof data === 'string' && !isBase64Data && !isLedger) {
                        data = (0, tonCore_1.commentToBytes)(data);
                    }
                    if (!(tokenSlug === config_1.TON_TOKEN_SLUG)) return [3 /*break*/, 11];
                    if (data && isLedger && (typeof data !== 'string' || shouldEncrypt)) {
                        error = void 0;
                        if (typeof data !== 'string') {
                            error = types_1.ApiTransactionDraftError.UnsupportedHardwareOperation;
                        }
                        else if (shouldEncrypt) {
                            error = types_1.ApiTransactionDraftError.EncryptedDataNotSupported;
                        }
                        else {
                            error = !(0, stringFormat_1.isAscii)(data)
                                ? types_1.ApiTransactionDraftError.NonAsciiCommentForHardwareOperation
                                : types_1.ApiTransactionDraftError.TooLongCommentForHardwareOperation;
                        }
                        return [2 /*return*/, __assign(__assign({}, result), { error: error })];
                    }
                    if (data instanceof Uint8Array) {
                        data = (0, tonCore_1.packBytesAsSnake)(data);
                    }
                    return [3 /*break*/, 15];
                case 11: return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 12:
                    address = _e.sent();
                    tokenAmount = amount;
                    tokenWallet = void 0;
                    return [4 /*yield*/, (0, tokens_1.buildTokenTransfer)(network, tokenSlug, address, toAddress, amount, data)];
                case 13:
                    (_d = _e.sent(), tokenWallet = _d.tokenWallet, amount = _d.amount, toAddress = _d.toAddress, data = _d.payload);
                    return [4 /*yield*/, tokenWallet.getJettonBalance()];
                case 14:
                    tokenBalance = _e.sent();
                    if (tokenBalance < tokenAmount) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.InsufficientBalance })];
                    }
                    _e.label = 15;
                case 15: return [4 /*yield*/, signTransaction(network, wallet, toAddress, amount, data, stateInit)];
                case 16:
                    transaction = (_e.sent()).transaction;
                    return [4 /*yield*/, calculateFee(network, wallet, transaction, account.isInitialized)];
                case 17:
                    realFee = _e.sent();
                    result.fee = (0, bigint_1.bigintMultiplyToNumber)(realFee, constants_1.FEE_FACTOR);
                    return [4 /*yield*/, (0, wallet_1.getWalletBalance)(network, wallet)];
                case 18:
                    balance = _e.sent();
                    if (balance < amount + realFee) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.InsufficientBalance })];
                    }
                    return [2 /*return*/, result];
                case 19:
                    err_1 = _e.sent();
                    return [2 /*return*/, __assign(__assign({}, (0, errors_1.handleServerError)(err_1)), result)];
                case 20: return [2 /*return*/];
            }
        });
    });
}
exports.checkTransactionDraft = checkTransactionDraft;
function submitTransfer(accountId, password, tokenSlug, toAddress, amount, data, stateInit, shouldEncrypt, isBase64Data) {
    return __awaiter(this, void 0, void 0, function () {
        var network, _a, wallet, account, keyPair, fromAddress, _b, publicKey, secretKey, encryptedComment, toPublicKey, balance, _c, seqno, transaction, fee, err_2;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    _e.label = 1;
                case 1:
                    _e.trys.push([1, 17, , 18]);
                    return [4 /*yield*/, Promise.all([
                            (0, wallet_1.pickAccountWallet)(accountId),
                            (0, accounts_1.fetchStoredAccount)(accountId),
                            (0, auth_1.fetchKeyPair)(accountId, password),
                        ])];
                case 2:
                    _a = _e.sent(), wallet = _a[0], account = _a[1], keyPair = _a[2];
                    fromAddress = account.address;
                    _b = keyPair, publicKey = _b.publicKey, secretKey = _b.secretKey;
                    encryptedComment = void 0;
                    if (!(typeof data === 'string')) return [3 /*break*/, 8];
                    if (!!data) return [3 /*break*/, 3];
                    data = undefined;
                    return [3 /*break*/, 8];
                case 3:
                    if (!isBase64Data) return [3 /*break*/, 4];
                    data = (0, tonCore_1.parseBase64)(data);
                    return [3 /*break*/, 8];
                case 4:
                    if (!shouldEncrypt) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, tonCore_1.getWalletPublicKey)(network, toAddress)];
                case 5:
                    toPublicKey = (_e.sent());
                    return [4 /*yield*/, (0, encryption_1.encryptMessageComment)(data, publicKey, toPublicKey, secretKey, fromAddress)];
                case 6:
                    data = _e.sent();
                    encryptedComment = Buffer.from(data.slice(4)).toString('base64');
                    return [3 /*break*/, 8];
                case 7:
                    data = (0, tonCore_1.commentToBytes)(data);
                    _e.label = 8;
                case 8:
                    if (!(tokenSlug === config_1.TON_TOKEN_SLUG)) return [3 /*break*/, 9];
                    if (data instanceof Uint8Array) {
                        data = (0, tonCore_1.packBytesAsSnake)(data);
                    }
                    return [3 /*break*/, 11];
                case 9: return [4 /*yield*/, (0, tokens_1.buildTokenTransfer)(network, tokenSlug, fromAddress, toAddress, amount, data)];
                case 10:
                    (_d = _e.sent(), amount = _d.amount, toAddress = _d.toAddress, data = _d.payload);
                    _e.label = 11;
                case 11: return [4 /*yield*/, waitLastTransfer(network, fromAddress)];
                case 12:
                    _e.sent();
                    return [4 /*yield*/, (0, wallet_1.getWalletInfo)(network, wallet)];
                case 13:
                    balance = (_e.sent()).balance;
                    return [4 /*yield*/, signTransaction(network, wallet, toAddress, amount, data, stateInit, secretKey)];
                case 14:
                    _c = _e.sent(), seqno = _c.seqno, transaction = _c.transaction;
                    return [4 /*yield*/, calculateFee(network, wallet, transaction, account.isInitialized)];
                case 15:
                    fee = _e.sent();
                    if (balance < amount + fee) {
                        return [2 /*return*/, { error: types_1.ApiTransactionError.InsufficientBalance }];
                    }
                    return [4 /*yield*/, wallet.send(transaction)];
                case 16:
                    _e.sent();
                    updateLastTransfer(network, fromAddress, seqno);
                    return [2 /*return*/, {
                            amount: amount,
                            seqno: seqno,
                            encryptedComment: encryptedComment,
                            toAddress: toAddress,
                        }];
                case 17:
                    err_2 = _e.sent();
                    (0, logs_1.logDebugError)('submitTransfer', err_2);
                    return [2 /*return*/, { error: resolveTransactionError(err_2) }];
                case 18: return [2 /*return*/];
            }
        });
    });
}
exports.submitTransfer = submitTransfer;
function resolveTransactionError(error) {
    if (error instanceof errors_1.ApiServerError) {
        if (error.message.includes('exitcode=35,')) {
            return types_1.ApiTransactionError.IncorrectDeviceTime;
        }
        else if (error.displayError) {
            return error.displayError;
        }
    }
    return types_1.ApiTransactionError.UnsuccesfulTransfer;
}
exports.resolveTransactionError = resolveTransactionError;
function signTransaction(network_1, wallet_2, toAddress_1, amount_1, payload_1, stateInit_1) {
    return __awaiter(this, arguments, void 0, function (network, wallet, toAddress, amount, payload, stateInit, privateKey) {
        var seqno, init, transaction;
        if (privateKey === void 0) { privateKey = new Uint8Array(64); }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, wallet_1.getWalletInfo)(network, wallet)];
                case 1:
                    seqno = (_a.sent()).seqno;
                    if (payload instanceof Uint8Array) {
                        payload = (0, tonCore_1.packBytesAsSnake)(payload, 0);
                    }
                    init = stateInit ? {
                        code: stateInit.refs[0],
                        data: stateInit.refs[1],
                    } : undefined;
                    transaction = wallet.createTransfer({
                        seqno: seqno,
                        secretKey: Buffer.from(privateKey),
                        messages: [(0, core_1.internal)({
                                value: amount,
                                to: toAddress,
                                body: payload,
                                init: init,
                                bounce: (0, tonCore_1.parseAddress)(toAddress).isBounceable,
                            })],
                        sendMode: core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS,
                    });
                    return [2 /*return*/, { seqno: seqno, transaction: transaction }];
            }
        });
    });
}
function getAccountNewestTxId(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [2 /*return*/, fetchNewestTxId(network, address)];
            }
        });
    });
}
exports.getAccountNewestTxId = getAccountNewestTxId;
function getAccountTransactionSlice(accountId, toTxId, fromTxId, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [4 /*yield*/, (0, apiV3_1.fetchTransactions)(network, address, limit !== null && limit !== void 0 ? limit : GET_TRANSACTIONS_LIMIT, toTxId, fromTxId)];
                case 2:
                    transactions = _a.sent();
                    return [4 /*yield*/, Promise.all(transactions.map(function (transaction) { return (0, metadata_1.parseWalletTransactionBody)(network, transaction); }))];
                case 3:
                    transactions = _a.sent();
                    return [2 /*return*/, transactions
                            .map(updateTransactionType)
                            .map(helpers_1.updateTransactionMetadata)
                            .map(omitExtraData)
                            .map(transactionToActivity)];
            }
        });
    });
}
exports.getAccountTransactionSlice = getAccountTransactionSlice;
function getMergedTransactionSlice(accountId, lastTxIds, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var lastTonTxId, tokenLastTxIds, tonTxs, lastTonTxLt, results, allTxs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastTonTxId = lastTxIds.toncoin, tokenLastTxIds = __rest(lastTxIds, ["toncoin"]);
                    return [4 /*yield*/, getAccountTransactionSlice(accountId, lastTonTxId, undefined, limit)];
                case 1:
                    tonTxs = _a.sent();
                    if (!tonTxs.length) {
                        return [2 /*return*/, []];
                    }
                    lastTonTxId = tonTxs[tonTxs.length - 1].txId;
                    lastTonTxLt = (0, util_1.parseTxId)(lastTonTxId).lt;
                    return [4 /*yield*/, Promise.all(Object.entries(tokenLastTxIds).map(function (_a) {
                            var slug = _a[0], lastTxId = _a[1];
                            if (lastTxId && (0, util_1.parseTxId)(lastTxId).lt < lastTonTxLt) {
                                return [];
                            }
                            return getTokenTransactionSlice(accountId, slug, lastTxId, lastTonTxId, GET_TRANSACTIONS_MAX_LIMIT);
                        }))];
                case 2:
                    results = _a.sent();
                    allTxs = __spreadArray(__spreadArray([], tonTxs, true), results.flat(), true);
                    allTxs.sort(function (a, b) { return (0, compareActivities_1.compareActivities)(a, b); });
                    return [2 /*return*/, allTxs];
            }
        });
    });
}
exports.getMergedTransactionSlice = getMergedTransactionSlice;
function getTokenTransactionSlice(accountId, tokenSlug, toTxId, fromTxId, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, minterAddress, tokenWalletAddress, transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (tokenSlug === config_1.TON_TOKEN_SLUG) {
                        return [2 /*return*/, getAccountTransactionSlice(accountId, toTxId, fromTxId, limit)];
                    }
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    minterAddress = (0, tokens_1.resolveTokenBySlug)(tokenSlug).minterAddress;
                    return [4 /*yield*/, (0, tonCore_1.resolveTokenWalletAddress)(network, address, minterAddress)];
                case 2:
                    tokenWalletAddress = _a.sent();
                    return [4 /*yield*/, (0, apiV3_1.fetchTransactions)(network, tokenWalletAddress, limit !== null && limit !== void 0 ? limit : GET_TRANSACTIONS_LIMIT, toTxId, fromTxId)];
                case 3:
                    transactions = _a.sent();
                    return [2 /*return*/, transactions
                            .map(function (tx) { return (0, tokens_1.parseTokenTransaction)(network, tx, tokenSlug, address); })
                            .filter(Boolean)
                            .map(helpers_1.updateTransactionMetadata)
                            .map(omitExtraData)
                            .map(transactionToActivity)];
            }
        });
    });
}
exports.getTokenTransactionSlice = getTokenTransactionSlice;
function omitExtraData(tx) {
    return (0, iteratees_1.omit)(tx, ['extraData']);
}
function updateTransactionType(transaction) {
    var comment = transaction.comment, amount = transaction.amount, extraData = transaction.extraData;
    var fromAddress = (0, tonCore_1.toBase64Address)(transaction.fromAddress, true);
    var toAddress = (0, tonCore_1.toBase64Address)(transaction.toAddress, true);
    var type;
    if ((0, utils_1.isKnownStakingPool)(fromAddress) && amount > config_1.ONE_TON) {
        type = 'unstake';
    }
    else if ((0, utils_1.isKnownStakingPool)(toAddress)) {
        if (comment === constants_1.STAKE_COMMENT) {
            type = 'stake';
        }
        else if (comment === constants_1.UNSTAKE_COMMENT) {
            type = 'unstakeRequest';
        }
    }
    else if (extraData === null || extraData === void 0 ? void 0 : extraData.parsedPayload) {
        var payload = extraData.parsedPayload;
        if (payload.type === 'tokens:burn' && payload.isLiquidUnstakeRequest) {
            type = 'unstakeRequest';
        }
        else if (payload.type === 'liquid-staking:deposit') {
            type = 'stake';
        }
        else if (payload.type === 'liquid-staking:withdrawal' || payload.type === 'liquid-staking:withdrawal-nft') {
            type = 'unstake';
        }
    }
    return __assign(__assign({}, transaction), { type: type });
}
function transactionToActivity(transaction) {
    return __assign(__assign({}, transaction), { kind: 'transaction', id: transaction.txId });
}
function checkMultiTransactionDraft(accountId, messages) {
    return __awaiter(this, void 0, void 0, function () {
        var network, result, totalAmount, account, _i, messages_1, _a, toAddress, amount, isMainnet, _b, isValid, isTestOnly, wallet, balance, transaction, realFee, err_3;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    result = {};
                    totalAmount = 0n;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    account = _c.sent();
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 7, , 8]);
                    for (_i = 0, messages_1 = messages; _i < messages_1.length; _i++) {
                        _a = messages_1[_i], toAddress = _a.toAddress, amount = _a.amount;
                        if (amount < 0n) {
                            return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.InvalidAmount })];
                        }
                        isMainnet = network === 'mainnet';
                        _b = (0, tonCore_1.parseAddress)(toAddress), isValid = _b.isValid, isTestOnly = _b.isTestOnly;
                        if (!isValid || (isMainnet && isTestOnly)) {
                            return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.InvalidToAddress })];
                        }
                        totalAmount += amount;
                    }
                    return [4 /*yield*/, (0, wallet_1.pickAccountWallet)(accountId)];
                case 3:
                    wallet = _c.sent();
                    if (!wallet) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiCommonError.Unexpected })];
                    }
                    return [4 /*yield*/, (0, wallet_1.getWalletInfo)(network, wallet)];
                case 4:
                    balance = (_c.sent()).balance;
                    return [4 /*yield*/, signMultiTransaction(network, wallet, messages)];
                case 5:
                    transaction = (_c.sent()).transaction;
                    return [4 /*yield*/, calculateFee(network, wallet, transaction, account.isInitialized)];
                case 6:
                    realFee = _c.sent();
                    result.totalAmount = totalAmount;
                    result.fee = (0, bigint_1.bigintMultiplyToNumber)(realFee, constants_1.FEE_FACTOR);
                    if (balance < totalAmount + realFee) {
                        return [2 /*return*/, __assign(__assign({}, result), { error: types_1.ApiTransactionDraftError.InsufficientBalance })];
                    }
                    return [2 /*return*/, result];
                case 7:
                    err_3 = _c.sent();
                    return [2 /*return*/, (0, errors_1.handleServerError)(err_3)];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.checkMultiTransactionDraft = checkMultiTransactionDraft;
function submitMultiTransfer(accountId, password, messages, expireAt) {
    return __awaiter(this, void 0, void 0, function () {
        var network, _a, wallet, account, privateKey, fromAddress, totalAmount_1, balance, _b, seqno, transaction, externalMessage, boc, fee, err_4;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 8, , 9]);
                    return [4 /*yield*/, Promise.all([
                            (0, wallet_1.pickAccountWallet)(accountId),
                            (0, accounts_1.fetchStoredAccount)(accountId),
                            (0, auth_1.fetchPrivateKey)(accountId, password),
                        ])];
                case 2:
                    _a = _c.sent(), wallet = _a[0], account = _a[1], privateKey = _a[2];
                    fromAddress = account.address;
                    totalAmount_1 = 0n;
                    messages.forEach(function (message) {
                        totalAmount_1 += BigInt(message.amount);
                    });
                    return [4 /*yield*/, waitLastTransfer(network, fromAddress)];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, (0, wallet_1.getWalletInfo)(network, wallet)];
                case 4:
                    balance = (_c.sent()).balance;
                    return [4 /*yield*/, signMultiTransaction(network, wallet, messages, privateKey, expireAt)];
                case 5:
                    _b = _c.sent(), seqno = _b.seqno, transaction = _b.transaction, externalMessage = _b.externalMessage;
                    boc = externalMessage.toBoc().toString('base64');
                    return [4 /*yield*/, calculateFee(network, wallet, transaction, account.isInitialized)];
                case 6:
                    fee = _c.sent();
                    if (BigInt(balance) < BigInt(totalAmount_1) + BigInt(fee)) {
                        return [2 /*return*/, { error: types_1.ApiTransactionError.InsufficientBalance }];
                    }
                    return [4 /*yield*/, wallet.send(transaction)];
                case 7:
                    _c.sent();
                    updateLastTransfer(network, fromAddress, seqno);
                    return [2 /*return*/, {
                            seqno: seqno,
                            amount: totalAmount_1.toString(),
                            messages: messages,
                            boc: boc,
                        }];
                case 8:
                    err_4 = _c.sent();
                    (0, logs_1.logDebugError)('submitMultiTransfer', err_4);
                    return [2 /*return*/, { error: resolveTransactionError(err_4) }];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.submitMultiTransfer = submitMultiTransfer;
function signMultiTransaction(network_1, wallet_2, messages_2) {
    return __awaiter(this, arguments, void 0, function (network, wallet, messages, privateKey, expireAt) {
        var seqno, preparedMessages, transaction, externalMessage;
        if (privateKey === void 0) { privateKey = new Uint8Array(64); }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, wallet_1.getWalletInfo)(network, wallet)];
                case 1:
                    seqno = (_a.sent()).seqno;
                    if (!expireAt) {
                        expireAt = Math.round(Date.now() / 1000) + DEFAULT_EXPIRE_AT_TIMEOUT_SEC;
                    }
                    preparedMessages = messages.map(function (message) {
                        var amount = message.amount, toAddress = message.toAddress, stateInit = message.stateInit, isBase64Payload = message.isBase64Payload;
                        var payload = message.payload;
                        if (isBase64Payload && typeof payload === 'string') {
                            payload = core_1.Cell.fromBase64(payload);
                        }
                        var init = stateInit ? {
                            code: stateInit.refs[0],
                            data: stateInit.refs[1],
                        } : undefined;
                        return (0, core_1.internal)({
                            value: amount,
                            to: toAddress,
                            body: payload, // TODO Fix Uint8Array type
                            bounce: (0, tonCore_1.parseAddress)(toAddress).isBounceable,
                            init: init,
                        });
                    });
                    transaction = wallet.createTransfer({
                        seqno: seqno,
                        secretKey: Buffer.from(privateKey),
                        messages: preparedMessages,
                        sendMode: core_1.SendMode.PAY_GAS_SEPARATELY + core_1.SendMode.IGNORE_ERRORS,
                        timeout: expireAt,
                    });
                    externalMessage = toExternalMessage(wallet, seqno, transaction);
                    return [2 /*return*/, { seqno: seqno, transaction: transaction, externalMessage: externalMessage }];
            }
        });
    });
}
function toExternalMessage(contract, seqno, body) {
    return (0, core_1.beginCell)()
        .storeWritable((0, core_1.storeMessage)((0, core_1.external)({
        to: contract.address,
        init: seqno === 0 ? contract.init : undefined,
        body: body,
    })))
        .endCell();
}
function updateLastTransfer(network, address, seqno) {
    lastTransfers[network][address] = {
        timestamp: Date.now(),
        seqno: seqno,
    };
}
function waitLastTransfer(network, address) {
    return __awaiter(this, void 0, void 0, function () {
        var lastTransfer, seqno, timestamp, waitUntil, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lastTransfer = lastTransfers[network][address];
                    if (!lastTransfer)
                        return [2 /*return*/];
                    seqno = lastTransfer.seqno, timestamp = lastTransfer.timestamp;
                    waitUntil = timestamp + WAIT_SEQNO_TIMEOUT;
                    return [4 /*yield*/, waitIncrementSeqno(network, address, seqno, waitUntil)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        delete lastTransfers[network][address];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.waitLastTransfer = waitLastTransfer;
function waitIncrementSeqno(network, address, seqno, waitUntil) {
    return __awaiter(this, void 0, void 0, function () {
        var currentSeqno, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!waitUntil) {
                        waitUntil = Date.now() + WAIT_SEQNO_TIMEOUT;
                    }
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < waitUntil)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, (0, wallet_1.getWalletInfo)(network, address)];
                case 3:
                    currentSeqno = (_a.sent()).seqno;
                    if (currentSeqno > seqno) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, (0, schedulers_1.pause)(WAIT_SEQNO_PAUSE)];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    err_5 = _a.sent();
                    (0, logs_1.logDebugError)('waitIncrementSeqno', err_5);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 1];
                case 7: return [2 /*return*/, false];
            }
        });
    });
}
function calculateFee(network, wallet, transaction, isInitialized) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, code, _c, data, fees;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _a = !isInitialized ? wallet.init : {}, _b = _a.code, code = _b === void 0 ? null : _b, _c = _a.data, data = _c === void 0 ? null : _c;
                    return [4 /*yield*/, (0, tonCore_1.getTonClient)(network).estimateExternalMessageFee(wallet.address, {
                            body: transaction,
                            initCode: code,
                            initData: data,
                            ignoreSignature: true,
                        })];
                case 1:
                    fees = (_d.sent()).source_fees;
                    return [2 /*return*/, BigInt(fees.in_fwd_fee + fees.storage_fee + fees.gas_fee + fees.fwd_fee)];
            }
        });
    });
}
function sendSignedMessage(accountId, message) {
    return __awaiter(this, void 0, void 0, function () {
        var network, _a, fromAddress, publicKey, version, wallet, client, contract, base64, seqno;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    _a = _b.sent(), fromAddress = _a.address, publicKey = _a.publicKey, version = _a.version;
                    wallet = (0, tonCore_1.getTonWalletContract)(publicKey, version);
                    client = (0, tonCore_1.getTonClient)(network);
                    contract = client.open(wallet);
                    base64 = message.base64, seqno = message.seqno;
                    return [4 /*yield*/, contract.send(core_1.Cell.fromBase64(base64))];
                case 2:
                    _b.sent();
                    updateLastTransfer(network, fromAddress, seqno);
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendSignedMessage = sendSignedMessage;
function sendSignedMessages(accountId, messages) {
    return __awaiter(this, void 0, void 0, function () {
        var network, _a, fromAddress, publicKey, version, wallet, client, contract, attempts, index, attempt, firstExternalMessage, _b, base64, seqno, err_6;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    _a = _c.sent(), fromAddress = _a.address, publicKey = _a.publicKey, version = _a.version;
                    wallet = (0, tonCore_1.getTonWalletContract)(publicKey, version);
                    client = (0, tonCore_1.getTonClient)(network);
                    contract = client.open(wallet);
                    attempts = constants_1.ATTEMPTS + messages.length;
                    index = 0;
                    attempt = 0;
                    firstExternalMessage = toExternalMessage(contract, messages[0].seqno, core_1.Cell.fromBase64(messages[0].base64));
                    _c.label = 2;
                case 2:
                    if (!(index < messages.length && attempt < attempts)) return [3 /*break*/, 8];
                    _b = messages[index], base64 = _b.base64, seqno = _b.seqno;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, waitLastTransfer(network, fromAddress)];
                case 4:
                    _c.sent();
                    return [4 /*yield*/, contract.send(core_1.Cell.fromBase64(base64))];
                case 5:
                    _c.sent();
                    updateLastTransfer(network, fromAddress, seqno);
                    index++;
                    return [3 /*break*/, 7];
                case 6:
                    err_6 = _c.sent();
                    (0, logs_1.logDebugError)('sendSignedMessages', err_6);
                    return [3 /*break*/, 7];
                case 7:
                    attempt++;
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/, { successNumber: index, externalMessage: firstExternalMessage }];
            }
        });
    });
}
exports.sendSignedMessages = sendSignedMessages;
function decryptComment(accountId, encryptedComment, fromAddress, password) {
    return __awaiter(this, void 0, void 0, function () {
        var keyPair, secretKey, publicKey, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, auth_1.fetchKeyPair)(accountId, password)];
                case 1:
                    keyPair = _a.sent();
                    if (!keyPair) {
                        return [2 /*return*/, undefined];
                    }
                    secretKey = keyPair.secretKey, publicKey = keyPair.publicKey;
                    buffer = Buffer.from(encryptedComment, 'base64');
                    return [2 /*return*/, (0, encryption_1.decryptMessageComment)(buffer, publicKey, secretKey, fromAddress)];
            }
        });
    });
}
exports.decryptComment = decryptComment;
function waitUntilTransactionAppears(network, address, txId) {
    return __awaiter(this, void 0, void 0, function () {
        var lt, latestTxId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    lt = (0, util_1.parseTxId)(txId).lt;
                    if (lt === 0) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, apiV3_1.fetchLatestTxId)(network, address)];
                case 2:
                    latestTxId = _a.sent();
                    if (latestTxId && (0, util_1.parseTxId)(latestTxId).lt >= lt) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, schedulers_1.pause)(WAIT_TRANSACTION_PAUSE)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.waitUntilTransactionAppears = waitUntilTransactionAppears;
function fetchNewestTxId(network, address) {
    return __awaiter(this, void 0, void 0, function () {
        var transactions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, apiV3_1.fetchTransactions)(network, address, 1)];
                case 1:
                    transactions = _a.sent();
                    if (!transactions.length) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, transactions[0].txId];
            }
        });
    });
}
exports.fetchNewestTxId = fetchNewestTxId;
function fixTokenActivitiesAddressForm(network, activities) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenAddresses, _i, activities_1, activity, addressBook, _a, activities_2, activity;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    tokenAddresses = new Set();
                    for (_i = 0, activities_1 = activities; _i < activities_1.length; _i++) {
                        activity = activities_1[_i];
                        if (activity.kind === 'transaction' && activity.slug !== config_1.TON_TOKEN_SLUG) {
                            tokenAddresses.add(activity.fromAddress);
                            tokenAddresses.add(activity.toAddress);
                        }
                    }
                    if (!tokenAddresses.size) {
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, (0, apiV3_1.fetchAddressBook)(network, Array.from(tokenAddresses))];
                case 1:
                    addressBook = _b.sent();
                    for (_a = 0, activities_2 = activities; _a < activities_2.length; _a++) {
                        activity = activities_2[_a];
                        if (activity.kind === 'transaction' && activity.slug !== config_1.TON_TOKEN_SLUG) {
                            activity.fromAddress = addressBook[activity.fromAddress].user_friendly;
                            activity.toAddress = addressBook[activity.toAddress].user_friendly;
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.fixTokenActivitiesAddressForm = fixTokenActivitiesAddressForm;
