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
exports.swapCexCreateTransaction = exports.swapCexValidateAddress = exports.swapCexEstimate = exports.swapGetHistoryItem = exports.swapGetHistoryByRanges = exports.swapGetHistory = exports.swapGetPairs = exports.swapGetTonCurrencies = exports.swapGetAssets = exports.swapBuild = exports.swapEstimate = exports.swapItemToActivity = exports.swapReplaceTransactionsByRanges = exports.swapReplaceTransactions = exports.swapSubmit = exports.swapBuildTransfer = exports.initSwap = void 0;
var config_1 = require("../../config");
var account_1 = require("../../util/account");
var assert_1 = require("../../util/assert");
var decimals_1 = require("../../util/decimals");
var logs_1 = require("../../util/logs");
var schedulers_1 = require("../../util/schedulers");
var buildSwapId_1 = require("../../util/swap/buildSwapId");
var blockchains_1 = require("../blockchains");
var util_1 = require("../blockchains/ton/util");
var accounts_1 = require("../common/accounts");
var backend_1 = require("../common/backend");
var hooks_1 = require("../hooks");
var other_1 = require("./other");
var tokens_1 = require("./tokens");
var SWAP_MAX_LT = 50;
var SWAP_WAITING_TIME = 5 * 60 * 1000; // 5 min
var SWAP_WAITING_PAUSE = 1000; // 1 sec
var MAX_OLD_SWAP_ID = 41276;
var ton = blockchains_1.default.ton;
var onUpdate;
function initSwap(_onUpdate) {
    onUpdate = _onUpdate;
}
exports.initSwap = initSwap;
function swapBuildTransfer(accountId, password, params) {
    return __awaiter(this, void 0, void 0, function () {
        var network, authToken, address, _a, id, transfers, transferList, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, other_1.getBackendAuthToken)(accountId, password)];
                case 1:
                    authToken = _b.sent();
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 2:
                    address = _b.sent();
                    return [4 /*yield*/, swapBuild(authToken, params)];
                case 3:
                    _a = _b.sent(), id = _a.id, transfers = _a.transfers;
                    transferList = transfers.map(function (transfer) { return (__assign(__assign({}, transfer), { amount: BigInt(transfer.amount), isBase64Payload: true })); });
                    return [4 /*yield*/, ton.validateDexSwapTransfers(network, address, params, transferList)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, ton.checkMultiTransactionDraft(accountId, transferList)];
                case 5:
                    result = _b.sent();
                    if ('error' in result) {
                        return [2 /*return*/, result];
                    }
                    return [2 /*return*/, __assign(__assign({}, result), { id: id, transfers: transfers })];
            }
        });
    });
}
exports.swapBuildTransfer = swapBuildTransfer;
function swapSubmit(accountId, password, fee, transfers, historyItem) {
    return __awaiter(this, void 0, void 0, function () {
        var transferList, result, from, to, swap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    transferList = transfers.map(function (transfer) { return (__assign(__assign({}, transfer), { amount: BigInt(transfer.amount), isBase64Payload: true })); });
                    return [4 /*yield*/, ton.submitMultiTransfer(accountId, password, transferList)];
                case 1:
                    result = _a.sent();
                    if ('error' in result) {
                        return [2 /*return*/, result];
                    }
                    from = getSwapItemSlug(historyItem, historyItem.from);
                    to = getSwapItemSlug(historyItem, historyItem.to);
                    swap = __assign(__assign({}, historyItem), { id: (0, buildSwapId_1.buildSwapId)(historyItem.id), from: from, to: to, kind: 'swap' });
                    onUpdate({
                        type: 'newActivities',
                        accountId: accountId,
                        activities: [swap],
                    });
                    void (0, hooks_1.callHook)('onSwapCreated', accountId, swap.timestamp - 1);
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.swapSubmit = swapSubmit;
function getSwapItemSlug(item, asset) {
    if (asset === config_1.TON_SYMBOL)
        return config_1.TON_TOKEN_SLUG;
    if (item.cex)
        return asset;
    return (0, util_1.buildTokenSlug)(asset);
}
function swapReplaceTransactions(accountId, transactions, network, slug) {
    return __awaiter(this, void 0, void 0, function () {
        var address, asset, _a, fromLt, toLt, fromTime, toTime, swaps, err_1;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!transactions.length || network === 'testnet') {
                        return [2 /*return*/, transactions];
                    }
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 2:
                    address = _c.sent();
                    asset = slug ? (_b = (0, tokens_1.resolveTokenBySlug)(slug).minterAddress) !== null && _b !== void 0 ? _b : config_1.TON_SYMBOL : undefined;
                    _a = buildSwapHistoryRange(transactions), fromLt = _a.fromLt, toLt = _a.toLt, fromTime = _a.fromTime, toTime = _a.toTime;
                    return [4 /*yield*/, swapGetHistory(address, {
                            fromLt: fromLt,
                            toLt: toLt,
                            fromTimestamp: fromTime,
                            toTimestamp: toTime,
                            asset: asset,
                        })];
                case 3:
                    swaps = _c.sent();
                    if (!swaps.length) {
                        return [2 /*return*/, transactions];
                    }
                    return [2 /*return*/, replaceTransactions(transactions, swaps)];
                case 4:
                    err_1 = _c.sent();
                    (0, logs_1.logDebugError)('swapReplaceTransactions', err_1);
                    return [2 /*return*/, transactions];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.swapReplaceTransactions = swapReplaceTransactions;
function swapReplaceTransactionsByRanges(accountId, transactions, chunks, isFirstLoad) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, ranges, swaps, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    if (!chunks.length || network === 'testnet') {
                        return [2 /*return*/, transactions];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 2:
                    address = _a.sent();
                    if (!!isFirstLoad) return [3 /*break*/, 4];
                    return [4 /*yield*/, waitPendingDexSwap(address)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    ranges = chunks.map(function (txs) { return buildSwapHistoryRange(txs); });
                    return [4 /*yield*/, swapGetHistoryByRanges(address, ranges)];
                case 5:
                    swaps = _a.sent();
                    if (!swaps.length) {
                        return [2 /*return*/, __spreadArray([], transactions, true)];
                    }
                    return [2 /*return*/, replaceTransactions(transactions, swaps)];
                case 6:
                    err_2 = _a.sent();
                    (0, logs_1.logDebugError)('swapReplaceTransactionsByRanges', err_2);
                    return [2 /*return*/, __spreadArray([], transactions, true)];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.swapReplaceTransactionsByRanges = swapReplaceTransactionsByRanges;
function replaceTransactions(transactions, swaps) {
    var _a;
    var result = [];
    var hiddenTxIds = new Set();
    var skipLtRanges = []; // TODO Remove it after applying correcting script in backend
    for (var _i = 0, swaps_1 = swaps; _i < swaps_1.length; _i++) {
        var swap = swaps_1[_i];
        (_a = swap.txIds) === null || _a === void 0 ? void 0 : _a.forEach(function (txId) {
            hiddenTxIds.add(txId);
        });
        if (swap.lt && Number(swap.id) < MAX_OLD_SWAP_ID) {
            skipLtRanges.push([swap.lt, swap.lt + SWAP_MAX_LT]);
        }
        var swapActivity = swapItemToActivity(swap);
        result.push(swapActivity);
    }
    var _loop_1 = function (transaction) {
        var _c = transaction.txId.split(':'), ltString = _c[0], hash = _c[1];
        var lt = Number(ltString);
        var shortenedTxId = "".concat(lt, ":").concat(hash);
        var shouldHide = Boolean(hiddenTxIds.has(shortenedTxId)
            || skipLtRanges.find(function (_a) {
                var startLt = _a[0], endLt = _a[1];
                return lt >= startLt && lt <= endLt;
            }));
        if (shouldHide) {
            transaction = __assign(__assign({}, transaction), { shouldHide: shouldHide });
        }
        result.push(transaction);
    };
    for (var _b = 0, transactions_1 = transactions; _b < transactions_1.length; _b++) {
        var transaction = transactions_1[_b];
        _loop_1(transaction);
    }
    return result;
}
function waitPendingDexSwap(address) {
    return __awaiter(this, void 0, void 0, function () {
        var waitUntil, pendingSwaps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    waitUntil = Date.now() + SWAP_WAITING_TIME;
                    _a.label = 1;
                case 1:
                    if (!(Date.now() < waitUntil)) return [3 /*break*/, 4];
                    return [4 /*yield*/, swapGetHistory(address, {
                            status: 'pending',
                            isCex: false,
                        })];
                case 2:
                    pendingSwaps = _a.sent();
                    if (!pendingSwaps.length) {
                        return [3 /*break*/, 4];
                    }
                    return [4 /*yield*/, (0, schedulers_1.pause)(SWAP_WAITING_PAUSE)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function buildSwapHistoryRange(transactions) {
    var firstLt = (0, util_1.parseTxId)(transactions[0].txId).lt;
    var lastLt = (0, util_1.parseTxId)(transactions[transactions.length - 1].txId).lt;
    var firstTimestamp = transactions[0].timestamp;
    var lastTimestamp = transactions[transactions.length - 1].timestamp;
    var _a = firstLt > lastLt ? [lastLt, lastTimestamp] : [firstLt, firstTimestamp], fromLt = _a[0], fromTime = _a[1];
    var _b = firstLt > lastLt ? [firstLt, firstTimestamp] : [lastLt, lastTimestamp], toLt = _b[0], toTime = _b[1];
    var slug = transactions[0].slug;
    var asset = slug === config_1.TON_TOKEN_SLUG ? config_1.TON_SYMBOL : (0, tokens_1.resolveTokenBySlug)(slug).minterAddress;
    return {
        asset: asset,
        fromLt: Math.floor(fromLt / 100) * 100,
        toLt: toLt,
        fromTime: fromTime,
        toTime: toTime,
    };
}
function swapItemToActivity(swap) {
    return __assign(__assign({}, swap), { id: (0, buildSwapId_1.buildSwapId)(swap.id), kind: 'swap', from: getSwapItemSlug(swap, swap.from), to: getSwapItemSlug(swap, swap.to) });
}
exports.swapItemToActivity = swapItemToActivity;
function swapEstimate(params) {
    return (0, backend_1.callBackendPost)('/swap/ton/estimate', params, {
        isAllowBadRequest: true,
    });
}
exports.swapEstimate = swapEstimate;
function swapBuild(authToken, params) {
    return (0, backend_1.callBackendPost)('/swap/ton/build', params, {
        authToken: authToken,
    });
}
exports.swapBuild = swapBuild;
function swapGetAssets() {
    return (0, backend_1.callBackendGet)('/swap/assets');
}
exports.swapGetAssets = swapGetAssets;
function swapGetTonCurrencies() {
    return (0, backend_1.callBackendGet)('/swap/ton/tokens');
}
exports.swapGetTonCurrencies = swapGetTonCurrencies;
function swapGetPairs(symbolOrMinter) {
    return (0, backend_1.callBackendGet)('/swap/pairs', { asset: symbolOrMinter });
}
exports.swapGetPairs = swapGetPairs;
function swapGetHistory(address, params) {
    return (0, backend_1.callBackendGet)("/swap/history/".concat(address), params);
}
exports.swapGetHistory = swapGetHistory;
function swapGetHistoryByRanges(address, ranges) {
    return (0, backend_1.callBackendPost)("/swap/history-ranges/".concat(address), { ranges: ranges });
}
exports.swapGetHistoryByRanges = swapGetHistoryByRanges;
function swapGetHistoryItem(address, id) {
    return (0, backend_1.callBackendGet)("/swap/history/".concat(address, "/").concat(id));
}
exports.swapGetHistoryItem = swapGetHistoryItem;
function swapCexEstimate(params) {
    return (0, backend_1.callBackendPost)('/swap/cex/estimate', params);
}
exports.swapCexEstimate = swapCexEstimate;
function swapCexValidateAddress(params) {
    return (0, backend_1.callBackendGet)('/swap/cex/validate-address', params);
}
exports.swapCexValidateAddress = swapCexValidateAddress;
function swapCexCreateTransaction(accountId, password, params) {
    return __awaiter(this, void 0, void 0, function () {
        var authToken, swap, activity, transfer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, other_1.getBackendAuthToken)(accountId, password)];
                case 1:
                    authToken = _a.sent();
                    return [4 /*yield*/, (0, backend_1.callBackendPost)('/swap/cex/createTransaction', params, {
                            authToken: authToken,
                        })];
                case 2:
                    swap = (_a.sent()).swap;
                    activity = swapItemToActivity(swap);
                    if (params.from === config_1.TON_SYMBOL) {
                        transfer = {
                            toAddress: swap.cex.payinAddress,
                            amount: (0, decimals_1.fromDecimal)(swap.fromAmount),
                        };
                        (0, assert_1.assert)(transfer.amount <= (0, decimals_1.fromDecimal)(params.fromAmount));
                    }
                    onUpdate({
                        type: 'newActivities',
                        accountId: accountId,
                        activities: [activity],
                    });
                    void (0, hooks_1.callHook)('onSwapCreated', accountId, swap.timestamp - 1);
                    return [2 /*return*/, { swap: swap, activity: activity, transfer: transfer }];
            }
        });
    });
}
exports.swapCexCreateTransaction = swapCexCreateTransaction;
