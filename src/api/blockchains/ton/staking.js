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
exports.getStakingState = exports.buildLiquidStakingWithdraw = exports.submitUnstake = exports.submitStake = exports.checkUnstakeDraft = exports.checkStakeDraft = void 0;
var core_1 = require("@ton/core");
var types_1 = require("../../types");
var config_1 = require("../../../config");
var account_1 = require("../../../util/account");
var bigint_1 = require("../../../util/bigint");
var decimals_1 = require("../../../util/decimals");
var tonCore_1 = require("./util/tonCore");
var NominatorPool_1 = require("./contracts/NominatorPool");
var accounts_1 = require("../../common/accounts");
var cache_1 = require("../../common/cache");
var db_1 = require("../../db");
var constants_1 = require("./constants");
var transactions_1 = require("./transactions");
var wallet_1 = require("./wallet");
function checkStakeDraft(accountId, amount, backendState) {
    return __awaiter(this, void 0, void 0, function () {
        var staked, type, result, poolAddress, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getStakingState(accountId, backendState)];
                case 1:
                    staked = _a.sent();
                    if (!((staked === null || staked === void 0 ? void 0 : staked.type) === 'nominators' && amount >= config_1.ONE_TON)) return [3 /*break*/, 3];
                    type = 'nominators';
                    poolAddress = backendState.nominatorsPool.address;
                    amount += config_1.ONE_TON;
                    return [4 /*yield*/, (0, transactions_1.checkTransactionDraft)(accountId, config_1.TON_TOKEN_SLUG, poolAddress, amount, constants_1.STAKE_COMMENT)];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 6];
                case 3:
                    if (!(amount < config_1.ONE_TON)) return [3 /*break*/, 4];
                    return [2 /*return*/, { error: types_1.ApiTransactionDraftError.InvalidAmount }];
                case 4:
                    type = 'liquid';
                    body = (0, tonCore_1.buildLiquidStakingDepositBody)();
                    return [4 /*yield*/, (0, transactions_1.checkTransactionDraft)(accountId, config_1.TON_TOKEN_SLUG, config_1.LIQUID_POOL, amount, body)];
                case 5:
                    result = _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/, __assign(__assign({}, result), { type: type })];
            }
        });
    });
}
exports.checkStakeDraft = checkStakeDraft;
function checkUnstakeDraft(accountId, amount, backendState) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, commonData, staked, type, result, tokenAmount, poolAddress, params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    commonData = (0, cache_1.getStakingCommonCache)();
                    return [4 /*yield*/, getStakingState(accountId, backendState)];
                case 2:
                    staked = _a.sent();
                    if (!(staked.type === 'nominators')) return [3 /*break*/, 4];
                    type = 'nominators';
                    poolAddress = backendState.nominatorsPool.address;
                    return [4 /*yield*/, (0, transactions_1.checkTransactionDraft)(accountId, config_1.TON_TOKEN_SLUG, poolAddress, config_1.ONE_TON, constants_1.UNSTAKE_COMMENT)];
                case 3:
                    result = _a.sent();
                    return [3 /*break*/, 8];
                case 4:
                    if (!(staked.type === 'liquid')) return [3 /*break*/, 7];
                    type = 'liquid';
                    if (amount > staked.amount) {
                        return [2 /*return*/, { error: types_1.ApiTransactionDraftError.InsufficientBalance }];
                    }
                    else if (amount === staked.amount) {
                        tokenAmount = staked.tokenAmount;
                    }
                    else {
                        tokenAmount = (0, bigint_1.bigintDivideToNumber)(amount, commonData.liquid.currentRate);
                    }
                    return [4 /*yield*/, buildLiquidStakingWithdraw(network, address, tokenAmount)];
                case 5:
                    params = _a.sent();
                    return [4 /*yield*/, (0, transactions_1.checkTransactionDraft)(accountId, config_1.TON_TOKEN_SLUG, params.toAddress, params.amount, params.payload)];
                case 6:
                    result = _a.sent();
                    return [3 /*break*/, 8];
                case 7: return [2 /*return*/, { error: types_1.ApiCommonError.Unexpected }];
                case 8: return [2 /*return*/, __assign(__assign({}, result), { type: type, tokenAmount: tokenAmount })];
            }
        });
    });
}
exports.checkUnstakeDraft = checkUnstakeDraft;
function submitStake(accountId, password, amount, type, backendState) {
    return __awaiter(this, void 0, void 0, function () {
        var result, network, address, poolAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    if (!(type === 'liquid')) return [3 /*break*/, 3];
                    amount += config_1.ONE_TON;
                    return [4 /*yield*/, (0, transactions_1.submitTransfer)(accountId, password, config_1.TON_TOKEN_SLUG, config_1.LIQUID_POOL, amount, (0, tonCore_1.buildLiquidStakingDepositBody)())];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    poolAddress = backendState.nominatorsPool.address;
                    return [4 /*yield*/, (0, transactions_1.submitTransfer)(accountId, password, config_1.TON_TOKEN_SLUG, (0, tonCore_1.toBase64Address)(poolAddress, true, network), amount, constants_1.STAKE_COMMENT)];
                case 4:
                    result = _a.sent();
                    _a.label = 5;
                case 5:
                    if (!('error' in result)) {
                        (0, cache_1.updateAccountCache)(accountId, address, { stakedAt: Date.now() });
                    }
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.submitStake = submitStake;
function submitUnstake(accountId, password, type, amount, backendState) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, staked, result, mode, params, poolAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [4 /*yield*/, getStakingState(accountId, backendState)];
                case 2:
                    staked = _a.sent();
                    if (!(type === 'liquid')) return [3 /*break*/, 5];
                    mode = staked.type === 'liquid' && !staked.instantAvailable
                        ? types_1.ApiLiquidUnstakeMode.BestRate
                        : types_1.ApiLiquidUnstakeMode.Default;
                    return [4 /*yield*/, buildLiquidStakingWithdraw(network, address, amount, mode)];
                case 3:
                    params = _a.sent();
                    return [4 /*yield*/, (0, transactions_1.submitTransfer)(accountId, password, config_1.TON_TOKEN_SLUG, params.toAddress, params.amount, params.payload)];
                case 4:
                    result = _a.sent();
                    return [3 /*break*/, 7];
                case 5:
                    poolAddress = backendState.nominatorsPool.address;
                    return [4 /*yield*/, (0, transactions_1.submitTransfer)(accountId, password, config_1.TON_TOKEN_SLUG, (0, tonCore_1.toBase64Address)(poolAddress, true, network), config_1.ONE_TON, constants_1.UNSTAKE_COMMENT)];
                case 6:
                    result = _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/, result];
            }
        });
    });
}
exports.submitUnstake = submitUnstake;
function buildLiquidStakingWithdraw(network_1, address_1, amount_1) {
    return __awaiter(this, arguments, void 0, function (network, address, amount, mode) {
        var tokenWalletAddress, payload;
        if (mode === void 0) { mode = types_1.ApiLiquidUnstakeMode.Default; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, tonCore_1.resolveTokenWalletAddress)(network, address, config_1.LIQUID_JETTON)];
                case 1:
                    tokenWalletAddress = _a.sent();
                    payload = (0, tonCore_1.buildLiquidStakingWithdrawBody)({
                        amount: amount,
                        responseAddress: address,
                        fillOrKill: mode === types_1.ApiLiquidUnstakeMode.Instant,
                        waitTillRoundEnd: mode === types_1.ApiLiquidUnstakeMode.BestRate,
                    });
                    return [2 /*return*/, {
                            amount: config_1.ONE_TON,
                            toAddress: tokenWalletAddress,
                            payload: payload,
                        }];
            }
        });
    });
}
exports.buildLiquidStakingWithdraw = buildLiquidStakingWithdraw;
function getStakingState(accountId, backendState) {
    return __awaiter(this, void 0, void 0, function () {
        var commonData, network, address, _a, currentRate, collection, tokenBalance, unstakeAmount, nfts, _i, nfts_1, nft, billAmount, loyaltyType, shouldUseNominators, accountCache, stakedAt, isInstantUnstake, liquidAvailable, liquidApy, fullTokenAmount, amount, poolAddress, nominatorPool, nominators, addressObject_1, currentNominator;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    commonData = (0, cache_1.getStakingCommonCache)();
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _g.sent();
                    _a = commonData.liquid, currentRate = _a.currentRate, collection = _a.collection;
                    return [4 /*yield*/, getLiquidStakingTokenBalance(accountId)];
                case 2:
                    tokenBalance = _g.sent();
                    unstakeAmount = 0n;
                    if (!collection) return [3 /*break*/, 4];
                    return [4 /*yield*/, db_1.apiDb.nfts.where({
                            accountId: accountId,
                            collectionAddress: collection,
                        }).toArray()];
                case 3:
                    nfts = _g.sent();
                    for (_i = 0, nfts_1 = nfts; _i < nfts_1.length; _i++) {
                        nft = nfts_1[_i];
                        billAmount = (_d = (_c = (_b = nft.name) === null || _b === void 0 ? void 0 : _b.match(/Bill for (?<amount>[\d.]+) Pool Jetton/)) === null || _c === void 0 ? void 0 : _c.groups) === null || _d === void 0 ? void 0 : _d.amount;
                        if (billAmount) {
                            unstakeAmount += (0, decimals_1.fromDecimal)(billAmount);
                        }
                    }
                    _g.label = 4;
                case 4:
                    loyaltyType = backendState.loyaltyType, shouldUseNominators = backendState.shouldUseNominators;
                    accountCache = (0, cache_1.getAccountCache)(accountId, address);
                    stakedAt = Math.max((_e = accountCache.stakedAt) !== null && _e !== void 0 ? _e : 0, (_f = backendState.stakedAt) !== null && _f !== void 0 ? _f : 0);
                    isInstantUnstake = Date.now() - stakedAt > config_1.VALIDATION_PERIOD_MS;
                    liquidAvailable = isInstantUnstake ? commonData.liquid.available : 0n;
                    liquidApy = commonData.liquid.apy;
                    if (loyaltyType && loyaltyType in commonData.liquid.loyaltyApy) {
                        liquidApy = commonData.liquid.loyaltyApy[loyaltyType];
                    }
                    if (tokenBalance > 0n || unstakeAmount > 0n) {
                        fullTokenAmount = tokenBalance + unstakeAmount;
                        amount = (0, bigint_1.bigintMultiplyToNumber)(fullTokenAmount, currentRate);
                        return [2 /*return*/, {
                                type: 'liquid',
                                tokenAmount: tokenBalance,
                                amount: amount,
                                unstakeRequestAmount: unstakeAmount,
                                apy: liquidApy,
                                instantAvailable: liquidAvailable,
                            }];
                    }
                    poolAddress = backendState.nominatorsPool.address;
                    if (!(backendState.type === 'nominators')) return [3 /*break*/, 6];
                    nominatorPool = getPoolContract(network, poolAddress);
                    return [4 /*yield*/, nominatorPool.getListNominators()];
                case 5:
                    nominators = _g.sent();
                    addressObject_1 = core_1.Address.parse(address);
                    currentNominator = nominators.find(function (n) { return n.address.equals(addressObject_1); });
                    if (currentNominator) {
                        return [2 /*return*/, {
                                type: 'nominators',
                                amount: backendState.balance,
                                pendingDepositAmount: currentNominator.pendingDepositAmount,
                                isUnstakeRequested: currentNominator.withdrawRequested,
                            }];
                    }
                    _g.label = 6;
                case 6:
                    if (shouldUseNominators) {
                        return [2 /*return*/, {
                                type: 'nominators',
                                amount: 0n,
                                pendingDepositAmount: 0n,
                                isUnstakeRequested: false,
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                type: 'liquid',
                                tokenAmount: 0n,
                                amount: 0n,
                                unstakeRequestAmount: 0n,
                                apy: liquidApy,
                                instantAvailable: liquidAvailable,
                            }];
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.getStakingState = getStakingState;
function getPoolContract(network, poolAddress) {
    return (0, tonCore_1.getTonClient)(network).open(new NominatorPool_1.NominatorPool(core_1.Address.parse(poolAddress)));
}
function getLiquidStakingTokenBalance(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, walletAddress, isInitialized;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    if (network !== 'mainnet') {
                        return [2 /*return*/, 0n];
                    }
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [4 /*yield*/, (0, tonCore_1.resolveTokenWalletAddress)(network, address, config_1.LIQUID_JETTON)];
                case 2:
                    walletAddress = _a.sent();
                    return [4 /*yield*/, (0, wallet_1.isAddressInitialized)(network, walletAddress)];
                case 3:
                    isInitialized = _a.sent();
                    if (!isInitialized) {
                        return [2 /*return*/, 0n];
                    }
                    return [2 /*return*/, (0, tonCore_1.getTokenBalance)(network, walletAddress)];
            }
        });
    });
}
