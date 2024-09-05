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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWalletVersionsPolling = exports.setupSwapPolling = exports.sendUpdateTokens = exports.tryUpdateConfig = exports.tryLoadSwapTokens = exports.tryUpdateTokens = exports.tryUpdatePrices = exports.setupLongBackendPolling = exports.setupBackendPolling = exports.setupStakingPolling = exports.setupBalanceBasedPolling = exports.initPolling = void 0;
var config_1 = require("../../config");
var account_1 = require("../../util/account");
var areDeepEqual_1 = require("../../util/areDeepEqual");
var compareActivities_1 = require("../../util/compareActivities");
var iteratees_1 = require("../../util/iteratees");
var logs_1 = require("../../util/logs");
var pauseOrFocus_1 = require("../../util/pauseOrFocus");
var blockchains_1 = require("../blockchains");
var tokens_1 = require("../blockchains/ton/tokens");
var accounts_1 = require("../common/accounts");
var addresses_1 = require("../common/addresses");
var backend_1 = require("../common/backend");
var cache_1 = require("../common/cache");
var helpers_1 = require("../common/helpers");
var txCallbacks_1 = require("../common/txCallbacks");
var utils_1 = require("../common/utils");
var nfts_1 = require("./nfts");
var preload_1 = require("./preload");
var prices_1 = require("./prices");
var staking_1 = require("./staking");
var swap_1 = require("./swap");
var SEC = 1000;
var BALANCE_BASED_INTERVAL = 1.1 * SEC;
var BALANCE_BASED_INTERVAL_WHEN_NOT_FOCUSED = 10 * SEC;
var STAKING_INTERVAL = 1.1 * SEC;
var STAKING_INTERVAL_WHEN_NOT_FOCUSED = 10 * SEC;
var BACKEND_INTERVAL = 30 * SEC;
var LONG_BACKEND_INTERVAL = 60 * SEC;
var NFT_FULL_INTERVAL = 60 * SEC;
var SWAP_POLLING_INTERVAL = 3 * SEC;
var SWAP_POLLING_INTERVAL_WHEN_NOT_FOCUSED = 10 * SEC;
var SWAP_FINISHED_STATUSES = new Set(['failed', 'completed', 'expired']);
var VERSIONS_INTERVAL = 5 * 60 * SEC;
var VERSIONS_INTERVAL_WHEN_NOT_FOCUSED = 15 * 60 * SEC;
var FIRST_TRANSACTIONS_LIMIT = 50;
var DOUBLE_CHECK_TOKENS_PAUSE = 30 * SEC;
var onUpdate;
var isAccountActive;
var prices = {
    baseCurrency: config_1.DEFAULT_PRICE_CURRENCY,
    bySlug: {},
};
var swapPollingAccountId;
var lastBalanceCache = {};
function initPolling(_onUpdate, _isAccountActive) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    onUpdate = _onUpdate;
                    isAccountActive = _isAccountActive;
                    return [4 /*yield*/, tryUpdatePrices()];
                case 1:
                    _a.sent();
                    Promise.all([
                        (0, addresses_1.tryUpdateKnownAddresses)(),
                        tryUpdateTokens(_onUpdate),
                        tryLoadSwapTokens(_onUpdate),
                        (0, staking_1.tryUpdateStakingCommonData)(),
                    ]).then(function () { return (0, preload_1.resolveDataPreloadPromise)(); });
                    void tryUpdateConfig(_onUpdate);
                    void setupBackendPolling();
                    void setupLongBackendPolling();
                    return [2 /*return*/];
            }
        });
    });
}
exports.initPolling = initPolling;
function registerNewTokens(tokenBalances) {
    var tokens = (0, tokens_1.getKnownTokens)();
    var areNewTokensFound = false;
    for (var _i = 0, _a = tokenBalances.filter(Boolean); _i < _a.length; _i++) {
        var token = _a[_i].token;
        if (token.slug in tokens)
            continue;
        areNewTokensFound = true;
        tokens[token.slug] = __assign(__assign({}, token), { quote: prices.bySlug[token.slug] || {
                price: 0.0,
                priceUsd: 0.0,
                percentChange24h: 0.0,
            } });
    }
    if (areNewTokensFound) {
        sendUpdateTokens();
    }
}
function setupBalanceBasedPolling(accountId_1) {
    return __awaiter(this, arguments, void 0, function (accountId, newestTxIds) {
        var blockchain, network, account, address, isInitialized, nftFromSec, nftUpdates, lastNftFullUpdate, doubleCheckTokensTime, tokenBalances, localOnUpdate, _loop_1, state_1;
        if (newestTxIds === void 0) { newestTxIds = {}; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
                    delete lastBalanceCache[accountId];
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    account = _a.sent();
                    address = account.address;
                    isInitialized = account.isInitialized;
                    nftFromSec = Math.round(Date.now() / 1000);
                    lastNftFullUpdate = 0;
                    localOnUpdate = onUpdate;
                    _loop_1 = function () {
                        var walletInfo, _b, balance, lastTxId, nfts, cache_2, changedTokenSlugs_1, isTonBalanceChanged, balancesToUpdate_1, newTxIds, nftResult, _c, err_1;
                        return __generator(this, function (_d) {
                            switch (_d.label) {
                                case 0:
                                    _d.trys.push([0, 16, , 17]);
                                    return [4 /*yield*/, blockchain.getWalletInfo(network, address)];
                                case 1:
                                    walletInfo = _d.sent();
                                    if (!isAlive(localOnUpdate, accountId))
                                        return [2 /*return*/, { value: void 0 }];
                                    _b = walletInfo !== null && walletInfo !== void 0 ? walletInfo : {}, balance = _b.balance, lastTxId = _b.lastTxId;
                                    if (!(Date.now() - lastNftFullUpdate > NFT_FULL_INTERVAL)) return [3 /*break*/, 3];
                                    return [4 /*yield*/, blockchain.getAccountNfts(accountId).catch(logAndRescue)];
                                case 2:
                                    nfts = _d.sent();
                                    lastNftFullUpdate = Date.now();
                                    if (!isAlive(localOnUpdate, accountId))
                                        return [2 /*return*/, { value: void 0 }];
                                    if (nfts) {
                                        nftFromSec = Math.round(Date.now() / 1000);
                                        if (!isAlive(localOnUpdate, accountId))
                                            return [2 /*return*/, { value: void 0 }];
                                        void (0, nfts_1.updateNfts)(accountId, nfts);
                                    }
                                    _d.label = 3;
                                case 3:
                                    cache_2 = lastBalanceCache[accountId];
                                    changedTokenSlugs_1 = [];
                                    isTonBalanceChanged = balance !== undefined && balance !== (cache_2 === null || cache_2 === void 0 ? void 0 : cache_2.balance);
                                    balancesToUpdate_1 = {};
                                    if (isTonBalanceChanged) {
                                        balancesToUpdate_1[config_1.TON_TOKEN_SLUG] = balance;
                                        lastBalanceCache[accountId] = __assign(__assign({}, lastBalanceCache[accountId]), { balance: balance });
                                    }
                                    if (!(isTonBalanceChanged || (doubleCheckTokensTime && doubleCheckTokensTime < Date.now()))) return [3 /*break*/, 5];
                                    doubleCheckTokensTime = isTonBalanceChanged ? Date.now() + DOUBLE_CHECK_TOKENS_PAUSE : undefined;
                                    return [4 /*yield*/, blockchain.getAccountTokenBalances(accountId).catch(logAndRescue)];
                                case 4:
                                    tokenBalances = _d.sent();
                                    if (!isAlive(localOnUpdate, accountId))
                                        return [2 /*return*/, { value: void 0 }];
                                    if (tokenBalances) {
                                        registerNewTokens(tokenBalances);
                                        tokenBalances.forEach(function (_a) {
                                            var slug = _a.slug, tokenBalance = _a.balance;
                                            var cachedBalance = (cache_2 === null || cache_2 === void 0 ? void 0 : cache_2.tokenBalances) && cache_2.tokenBalances[slug];
                                            if (cachedBalance === tokenBalance)
                                                return;
                                            changedTokenSlugs_1.push(slug);
                                            balancesToUpdate_1[slug] = tokenBalance;
                                        });
                                        lastBalanceCache[accountId] = __assign(__assign({}, lastBalanceCache[accountId]), { tokenBalances: Object.fromEntries(tokenBalances.map(function (_a) {
                                                var slug = _a.slug, tokenBalance = _a.balance;
                                                return [slug, tokenBalance];
                                            })) });
                                    }
                                    if (Object.keys(balancesToUpdate_1).length > 0) {
                                        onUpdate({
                                            type: 'updateBalances',
                                            accountId: accountId,
                                            balancesToUpdate: balancesToUpdate_1,
                                        });
                                    }
                                    _d.label = 5;
                                case 5:
                                    if (!(isTonBalanceChanged || changedTokenSlugs_1.length)) return [3 /*break*/, 9];
                                    if (!lastTxId) return [3 /*break*/, 7];
                                    return [4 /*yield*/, blockchain.waitUntilTransactionAppears(network, address, lastTxId)];
                                case 6:
                                    _d.sent();
                                    _d.label = 7;
                                case 7: return [4 /*yield*/, processNewActivities(accountId, newestTxIds, changedTokenSlugs_1, tokenBalances)];
                                case 8:
                                    newTxIds = _d.sent();
                                    newestTxIds = __assign(__assign({}, newestTxIds), newTxIds);
                                    _d.label = 9;
                                case 9:
                                    if (!isTonBalanceChanged) return [3 /*break*/, 11];
                                    return [4 /*yield*/, blockchain.getNftUpdates(accountId, nftFromSec).catch(logAndRescue)];
                                case 10:
                                    nftResult = _d.sent();
                                    if (!isAlive(localOnUpdate, accountId))
                                        return [2 /*return*/, { value: void 0 }];
                                    if (nftResult) {
                                        nftFromSec = nftResult[0], nftUpdates = nftResult[1];
                                        void (0, nfts_1.processNftUpdates)(accountId, nftUpdates);
                                    }
                                    _d.label = 11;
                                case 11:
                                    _c = isTonBalanceChanged && !isInitialized;
                                    if (!_c) return [3 /*break*/, 13];
                                    return [4 /*yield*/, blockchain.isAddressInitialized(network, address)];
                                case 12:
                                    _c = (_d.sent());
                                    _d.label = 13;
                                case 13:
                                    if (!_c) return [3 /*break*/, 15];
                                    isInitialized = true;
                                    return [4 /*yield*/, (0, accounts_1.updateStoredAccount)(accountId, { isInitialized: isInitialized })];
                                case 14:
                                    _d.sent();
                                    _d.label = 15;
                                case 15: return [3 /*break*/, 17];
                                case 16:
                                    err_1 = _d.sent();
                                    (0, logs_1.logDebugError)('setupBalanceBasedPolling', err_1);
                                    return [3 /*break*/, 17];
                                case 17: return [4 /*yield*/, (0, pauseOrFocus_1.pauseOrFocus)(BALANCE_BASED_INTERVAL, BALANCE_BASED_INTERVAL_WHEN_NOT_FOCUSED)];
                                case 18:
                                    _d.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _a.label = 2;
                case 2:
                    if (!isAlive(localOnUpdate, accountId)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1()];
                case 3:
                    state_1 = _a.sent();
                    if (typeof state_1 === "object")
                        return [2 /*return*/, state_1.value];
                    return [3 /*break*/, 2];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.setupBalanceBasedPolling = setupBalanceBasedPolling;
function setupStakingPolling(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, blockchainKey, network, blockchain, localOnUpdate, lastState, stakingCommonData, backendStakingState, stakingState, state, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, account_1.parseAccountId)(accountId), blockchainKey = _a.blockchain, network = _a.network;
                    blockchain = blockchains_1.default[blockchainKey];
                    if (network !== 'mainnet') {
                        return [2 /*return*/];
                    }
                    localOnUpdate = onUpdate;
                    _b.label = 1;
                case 1:
                    if (!isAlive(localOnUpdate, accountId)) return [3 /*break*/, 8];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 5, , 6]);
                    stakingCommonData = (0, cache_1.getStakingCommonCache)();
                    return [4 /*yield*/, (0, staking_1.getBackendStakingState)(accountId)];
                case 3:
                    backendStakingState = _b.sent();
                    return [4 /*yield*/, blockchain.getStakingState(accountId, backendStakingState)];
                case 4:
                    stakingState = _b.sent();
                    if (!isAlive(localOnUpdate, accountId))
                        return [2 /*return*/];
                    state = {
                        stakingCommonData: stakingCommonData,
                        backendStakingState: backendStakingState,
                        stakingState: stakingState,
                    };
                    if (!(0, areDeepEqual_1.areDeepEqual)(state, lastState)) {
                        lastState = state;
                        onUpdate(__assign({ type: 'updateStaking', accountId: accountId }, state));
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _b.sent();
                    (0, logs_1.logDebugError)('setupStakingPolling', err_2);
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, (0, pauseOrFocus_1.pauseOrFocus)(STAKING_INTERVAL, STAKING_INTERVAL_WHEN_NOT_FOCUSED)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.setupStakingPolling = setupStakingPolling;
function processNewActivities(accountId, newestTxIds, tokenSlugs, tokenBalances) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, network, blockchain, activeBlockchain, chunks, result, slug, newestTxId, transactions, tokenBalanceByAddress_1, allTransactions, isFirstRun, activities;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, account_1.parseAccountId)(accountId), network = _a.network, blockchain = _a.blockchain;
                    activeBlockchain = blockchains_1.default[blockchain];
                    chunks = [];
                    result = [];
                    slug = config_1.TON_TOKEN_SLUG;
                    newestTxId = newestTxIds[slug];
                    return [4 /*yield*/, activeBlockchain.getTokenTransactionSlice(accountId, slug, undefined, newestTxId, FIRST_TRANSACTIONS_LIMIT)];
                case 1:
                    transactions = _b.sent();
                    if (transactions.length) {
                        newestTxId = transactions[0].txId;
                        chunks.push(transactions);
                    }
                    result.push([slug, newestTxId]);
                    tokenBalanceByAddress_1 = (0, iteratees_1.buildCollectionByKey)(tokenBalances !== null && tokenBalances !== void 0 ? tokenBalances : [], 'jettonWallet');
                    transactions.forEach(function (_a) {
                        var isIncoming = _a.isIncoming, toAddress = _a.toAddress, fromAddress = _a.fromAddress;
                        var address = isIncoming ? fromAddress : toAddress;
                        var tokenBalance = tokenBalanceByAddress_1[address];
                        if (tokenBalance && !tokenSlugs.includes(tokenBalance.slug)) {
                            tokenSlugs = tokenSlugs.concat([tokenBalance.slug]);
                        }
                    });
                    // Process token transactions
                    return [4 /*yield*/, Promise.all(tokenSlugs.map(function (slug) { return __awaiter(_this, void 0, void 0, function () {
                            var newestTxId, transactions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        newestTxId = newestTxIds[slug];
                                        return [4 /*yield*/, activeBlockchain.getTokenTransactionSlice(accountId, slug, undefined, newestTxId, FIRST_TRANSACTIONS_LIMIT)];
                                    case 1:
                                        transactions = _a.sent();
                                        if (transactions.length) {
                                            newestTxId = transactions[0].txId;
                                            chunks.push(transactions);
                                        }
                                        result.push([slug, newestTxId]);
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 2:
                    // Process token transactions
                    _b.sent();
                    allTransactions = chunks.flat().sort(function (a, b) { return (0, compareActivities_1.compareActivities)(a, b); });
                    isFirstRun = !Object.keys(newestTxIds).length;
                    return [4 /*yield*/, (0, swap_1.swapReplaceTransactionsByRanges)(accountId, allTransactions, chunks, isFirstRun)];
                case 3:
                    activities = _b.sent();
                    allTransactions.sort(function (a, b) { return (0, compareActivities_1.compareActivities)(a, b, true); });
                    allTransactions.forEach(function (transaction) {
                        txCallbacks_1.txCallbacks.runCallbacks(transaction);
                    });
                    return [4 /*yield*/, activeBlockchain.fixTokenActivitiesAddressForm(network, activities)];
                case 4:
                    _b.sent();
                    onUpdate({
                        type: 'newActivities',
                        activities: activities,
                        accountId: accountId,
                    });
                    return [2 /*return*/, Object.fromEntries(result)];
            }
        });
    });
}
function setupBackendPolling() {
    return __awaiter(this, void 0, void 0, function () {
        var localOnUpdate, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localOnUpdate = onUpdate;
                    _a.label = 1;
                case 1:
                    if (!(0, helpers_1.isUpdaterAlive)(localOnUpdate)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, pauseOrFocus_1.pauseOrFocus)(BACKEND_INTERVAL)];
                case 2:
                    _a.sent();
                    if (!(0, helpers_1.isUpdaterAlive)(localOnUpdate))
                        return [2 /*return*/];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, tryUpdatePrices(localOnUpdate)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tryUpdateTokens(localOnUpdate)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    err_3 = _a.sent();
                    (0, logs_1.logDebugError)('setupBackendPolling', err_3);
                    return [3 /*break*/, 7];
                case 7: return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.setupBackendPolling = setupBackendPolling;
function setupLongBackendPolling() {
    return __awaiter(this, void 0, void 0, function () {
        var localOnUpdate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localOnUpdate = onUpdate;
                    _a.label = 1;
                case 1:
                    if (!(0, helpers_1.isUpdaterAlive)(localOnUpdate)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, pauseOrFocus_1.pauseOrFocus)(LONG_BACKEND_INTERVAL)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, Promise.all([
                            (0, addresses_1.tryUpdateKnownAddresses)(),
                            (0, staking_1.tryUpdateStakingCommonData)(),
                            tryUpdateConfig(localOnUpdate),
                        ])];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.setupLongBackendPolling = setupLongBackendPolling;
function tryUpdatePrices(localOnUpdate) {
    return __awaiter(this, void 0, void 0, function () {
        var baseCurrency, pricesData, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!localOnUpdate) {
                        localOnUpdate = onUpdate;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, (0, prices_1.getBaseCurrency)()];
                case 2:
                    baseCurrency = _a.sent();
                    return [4 /*yield*/, (0, backend_1.callBackendGet)('/prices/current', {
                            base: baseCurrency,
                        })];
                case 3:
                    pricesData = _a.sent();
                    if (!(0, helpers_1.isUpdaterAlive)(localOnUpdate))
                        return [2 /*return*/];
                    prices.bySlug = (0, iteratees_1.buildCollectionByKey)(Object.values(pricesData), 'slug');
                    prices.baseCurrency = baseCurrency;
                    return [3 /*break*/, 5];
                case 4:
                    err_4 = _a.sent();
                    (0, logs_1.logDebugError)('tryUpdatePrices', err_4);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.tryUpdatePrices = tryUpdatePrices;
function tryUpdateTokens(localOnUpdate) {
    return __awaiter(this, void 0, void 0, function () {
        var tokens, err_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!localOnUpdate) {
                        localOnUpdate = onUpdate;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, backend_1.callBackendGet)('/known-tokens')];
                case 2:
                    tokens = _a.sent();
                    if (!(0, helpers_1.isUpdaterAlive)(localOnUpdate))
                        return [2 /*return*/];
                    (0, tokens_1.addKnownTokens)(tokens);
                    sendUpdateTokens();
                    return [3 /*break*/, 4];
                case 3:
                    err_5 = _a.sent();
                    (0, logs_1.logDebugError)('tryUpdateTokens', err_5);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.tryUpdateTokens = tryUpdateTokens;
function tryLoadSwapTokens(localOnUpdate) {
    return __awaiter(this, void 0, void 0, function () {
        var assets, tokens, err_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!localOnUpdate) {
                        localOnUpdate = onUpdate;
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, (0, swap_1.swapGetAssets)()];
                case 2:
                    assets = _a.sent();
                    if (!(0, helpers_1.isUpdaterAlive)(localOnUpdate))
                        return [2 /*return*/];
                    tokens = assets.reduce(function (acc, asset) {
                        var _a, _b, _c;
                        acc[asset.slug] = __assign(__assign({}, asset), { contract: (_a = asset.contract) !== null && _a !== void 0 ? _a : asset.slug, price: (_c = (_b = prices.bySlug[asset.slug]) === null || _b === void 0 ? void 0 : _b.price) !== null && _c !== void 0 ? _c : 0 });
                        return acc;
                    }, {});
                    onUpdate({
                        type: 'updateSwapTokens',
                        tokens: tokens,
                    });
                    return [3 /*break*/, 4];
                case 3:
                    err_6 = _a.sent();
                    (0, logs_1.logDebugError)('tryLoadSwapTokens', err_6);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.tryLoadSwapTokens = tryLoadSwapTokens;
function tryUpdateConfig(localOnUpdate) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, isLimited, _b, isCopyStorageEnabled, err_7;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, backend_1.callBackendGet)('/utils/get-config')];
                case 1:
                    _a = _c.sent(), isLimited = _a.isLimited, _b = _a.isCopyStorageEnabled, isCopyStorageEnabled = _b === void 0 ? false : _b;
                    if (!(0, helpers_1.isUpdaterAlive)(localOnUpdate))
                        return [2 /*return*/];
                    onUpdate({
                        type: 'updateConfig',
                        isLimited: isLimited,
                        isCopyStorageEnabled: isCopyStorageEnabled,
                    });
                    return [3 /*break*/, 3];
                case 2:
                    err_7 = _c.sent();
                    (0, logs_1.logDebugError)('tryUpdateRegion', err_7);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.tryUpdateConfig = tryUpdateConfig;
function sendUpdateTokens() {
    var tokens = (0, tokens_1.getKnownTokens)();
    Object.values(tokens).forEach(function (token) {
        if (token.slug in prices.bySlug) {
            token.quote = prices.bySlug[token.slug];
        }
    });
    onUpdate({
        type: 'updateTokens',
        tokens: tokens,
        baseCurrency: prices.baseCurrency,
    });
}
exports.sendUpdateTokens = sendUpdateTokens;
function setupSwapPolling(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, address, lastFinishedSwapTimestamp, fromTimestamp, _b, localOnUpdate, swapById, swaps, isLastFinishedSwapUpdated, isPrevFinished, _i, swaps_1, swap, isFinished, err_8;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (swapPollingAccountId === accountId)
                        return [2 /*return*/]; // Double launch is not allowed
                    swapPollingAccountId = accountId;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    _a = _e.sent(), address = _a.address, lastFinishedSwapTimestamp = _a.lastFinishedSwapTimestamp;
                    if (!(lastFinishedSwapTimestamp !== null && lastFinishedSwapTimestamp !== void 0)) return [3 /*break*/, 2];
                    _b = lastFinishedSwapTimestamp;
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, getActualLastFinishedSwapTimestamp(accountId, address)];
                case 3:
                    _b = _e.sent();
                    _e.label = 4;
                case 4:
                    fromTimestamp = _b;
                    localOnUpdate = onUpdate;
                    swapById = {};
                    _e.label = 5;
                case 5:
                    if (!isAlive(localOnUpdate, accountId)) return [3 /*break*/, 13];
                    _e.label = 6;
                case 6:
                    _e.trys.push([6, 10, , 11]);
                    return [4 /*yield*/, (0, swap_1.swapGetHistory)(address, {
                            fromTimestamp: fromTimestamp,
                        })];
                case 7:
                    swaps = _e.sent();
                    if (!isAlive(localOnUpdate, accountId))
                        return [3 /*break*/, 13];
                    if (!swaps.length)
                        return [3 /*break*/, 13];
                    swaps.reverse();
                    isLastFinishedSwapUpdated = false;
                    isPrevFinished = true;
                    for (_i = 0, swaps_1 = swaps; _i < swaps_1.length; _i++) {
                        swap = swaps_1[_i];
                        if (swap.cex) {
                            if (swap.cex.status === ((_c = swapById[swap.id]) === null || _c === void 0 ? void 0 : _c.cex.status)) {
                                continue;
                            }
                        }
                        else if (swap.status === ((_d = swapById[swap.id]) === null || _d === void 0 ? void 0 : _d.status)) {
                            continue;
                        }
                        swapById[swap.id] = swap;
                        isFinished = SWAP_FINISHED_STATUSES.has(swap.status);
                        if (isFinished && isPrevFinished) {
                            fromTimestamp = swap.timestamp;
                            isLastFinishedSwapUpdated = true;
                        }
                        isPrevFinished = isFinished;
                        if (!swap.cex && swap.status !== 'completed') {
                            // Completed onchain swaps are processed in swapReplaceTransactions
                            onUpdate({
                                type: 'newActivities',
                                accountId: accountId,
                                activities: [(0, swap_1.swapItemToActivity)(swap)],
                            });
                        }
                    }
                    if (!isLastFinishedSwapUpdated) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, accounts_1.updateStoredAccount)(accountId, {
                            lastFinishedSwapTimestamp: fromTimestamp,
                        })];
                case 8:
                    _e.sent();
                    _e.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    err_8 = _e.sent();
                    (0, logs_1.logDebugError)('setupSwapPolling', err_8);
                    return [3 /*break*/, 11];
                case 11: return [4 /*yield*/, (0, pauseOrFocus_1.pauseOrFocus)(SWAP_POLLING_INTERVAL, SWAP_POLLING_INTERVAL_WHEN_NOT_FOCUSED)];
                case 12:
                    _e.sent();
                    return [3 /*break*/, 5];
                case 13:
                    if (accountId === swapPollingAccountId) {
                        swapPollingAccountId = undefined;
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.setupSwapPolling = setupSwapPolling;
function isAlive(localOnUpdate, accountId) {
    return (0, helpers_1.isUpdaterAlive)(localOnUpdate) && isAccountActive(accountId);
}
function getActualLastFinishedSwapTimestamp(accountId, address) {
    return __awaiter(this, void 0, void 0, function () {
        var swaps, timestamp, _i, swaps_2, swap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, swap_1.swapGetHistory)(address, {})];
                case 1:
                    swaps = _a.sent();
                    swaps.reverse();
                    timestamp = Date.now();
                    for (_i = 0, swaps_2 = swaps; _i < swaps_2.length; _i++) {
                        swap = swaps_2[_i];
                        if (SWAP_FINISHED_STATUSES.has(swap.status)) {
                            timestamp = swap.timestamp;
                        }
                        else {
                            break;
                        }
                    }
                    return [4 /*yield*/, (0, accounts_1.updateStoredAccount)(accountId, {
                            lastFinishedSwapTimestamp: timestamp,
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, timestamp];
            }
        });
    });
}
function logAndRescue(err) {
    (0, logs_1.logDebugError)('Polling error', err);
    return undefined;
}
function setupWalletVersionsPolling(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var ton, localOnUpdate, _a, publicKey, version, publicKeyBytes, network, versions, lastResult, versionInfos, filteredVersions, err_9;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ton = blockchains_1.default.ton;
                    localOnUpdate = onUpdate;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    _a = _b.sent(), publicKey = _a.publicKey, version = _a.version;
                    publicKeyBytes = (0, utils_1.hexToBytes)(publicKey);
                    network = (0, account_1.parseAccountId)(accountId).network;
                    versions = config_1.POPULAR_WALLET_VERSIONS.filter(function (value) { return value !== version; });
                    _b.label = 2;
                case 2:
                    if (!isAlive(localOnUpdate, accountId)) return [3 /*break*/, 8];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, ton.getWalletVersionInfos(network, publicKeyBytes, versions)];
                case 4:
                    versionInfos = (_b.sent()).filter(function (_a) {
                        var lastTxId = _a.lastTxId;
                        return !!lastTxId;
                    });
                    filteredVersions = versionInfos.map(function (_a) {
                        var wallet = _a.wallet, rest = __rest(_a, ["wallet"]);
                        return rest;
                    });
                    if (!isAlive(localOnUpdate, accountId))
                        return [2 /*return*/];
                    if (!(0, areDeepEqual_1.areDeepEqual)(versionInfos, lastResult)) {
                        lastResult = versionInfos;
                        onUpdate({
                            type: 'updateWalletVersions',
                            accountId: accountId,
                            currentVersion: version,
                            versions: filteredVersions,
                        });
                    }
                    return [3 /*break*/, 6];
                case 5:
                    err_9 = _b.sent();
                    (0, logs_1.logDebugError)('setupWalletVersionsPolling', err_9);
                    return [3 /*break*/, 6];
                case 6: return [4 /*yield*/, (0, pauseOrFocus_1.pauseOrFocus)(VERSIONS_INTERVAL, VERSIONS_INTERVAL_WHEN_NOT_FOCUSED)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 2];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.setupWalletVersionsPolling = setupWalletVersionsPolling;
