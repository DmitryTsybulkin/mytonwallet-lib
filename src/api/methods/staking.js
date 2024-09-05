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
exports.tryUpdateStakingCommonData = exports.onStakingChangeExpected = exports.getStakingHistory = exports.fetchBackendStakingState = exports.getBackendStakingState = exports.submitUnstake = exports.submitStake = exports.checkUnstakeDraft = exports.checkStakeDraft = exports.initStaking = void 0;
var config_1 = require("../../config");
var decimals_1 = require("../../util/decimals");
var logs_1 = require("../../util/logs");
var blockchains_1 = require("../blockchains");
var constants_1 = require("../blockchains/ton/constants");
var accounts_1 = require("../common/accounts");
var backend_1 = require("../common/backend");
var cache_1 = require("../common/cache");
var helpers_1 = require("../common/helpers");
var utils_1 = require("../common/utils");
var environment_1 = require("../environment");
var other_1 = require("./other");
var transactions_1 = require("./transactions");
var CACHE_TTL = 5000; // 5 s.
var backendStakingStateByAddress = {};
// let onUpdate: OnApiUpdate;
function initStaking() {
    // onUpdate = _onUpdate;
}
exports.initStaking = initStaking;
function checkStakeDraft(accountId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchain, backendState;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
                    return [4 /*yield*/, getBackendStakingState(accountId)];
                case 1:
                    backendState = _a.sent();
                    return [2 /*return*/, blockchain.checkStakeDraft(accountId, amount, backendState)];
            }
        });
    });
}
exports.checkStakeDraft = checkStakeDraft;
function checkUnstakeDraft(accountId, amount) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchain, backendState;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
                    return [4 /*yield*/, getBackendStakingState(accountId)];
                case 1:
                    backendState = _a.sent();
                    return [2 /*return*/, blockchain.checkUnstakeDraft(accountId, amount, backendState)];
            }
        });
    });
}
exports.checkUnstakeDraft = checkUnstakeDraft;
function submitStake(accountId, password, amount, type, fee) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchain, fromAddress, backendState, result, localTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    fromAddress = _a.sent();
                    return [4 /*yield*/, getBackendStakingState(accountId)];
                case 2:
                    backendState = _a.sent();
                    return [4 /*yield*/, blockchain.submitStake(accountId, password, amount, type, backendState)];
                case 3:
                    result = _a.sent();
                    if ('error' in result) {
                        return [2 /*return*/, false];
                    }
                    onStakingChangeExpected();
                    localTransaction = (0, transactions_1.createLocalTransaction)(accountId, {
                        amount: result.amount,
                        fromAddress: fromAddress,
                        toAddress: result.toAddress,
                        comment: constants_1.STAKE_COMMENT,
                        fee: fee || 0n,
                        type: 'stake',
                        slug: config_1.TON_TOKEN_SLUG,
                    });
                    return [2 /*return*/, __assign(__assign({}, result), { txId: localTransaction.txId })];
            }
        });
    });
}
exports.submitStake = submitStake;
function submitUnstake(accountId, password, type, amount, fee) {
    return __awaiter(this, void 0, void 0, function () {
        var blockchain, fromAddress, backendState, result, localTransaction;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    blockchain = blockchains_1.default[(0, helpers_1.resolveBlockchainKey)(accountId)];
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    fromAddress = _a.sent();
                    return [4 /*yield*/, getBackendStakingState(accountId)];
                case 2:
                    backendState = _a.sent();
                    return [4 /*yield*/, blockchain.submitUnstake(accountId, password, type, amount, backendState)];
                case 3:
                    result = _a.sent();
                    if ('error' in result) {
                        return [2 /*return*/, false];
                    }
                    onStakingChangeExpected();
                    localTransaction = (0, transactions_1.createLocalTransaction)(accountId, {
                        amount: result.amount,
                        fromAddress: fromAddress,
                        toAddress: result.toAddress,
                        comment: constants_1.UNSTAKE_COMMENT,
                        fee: fee || 0n,
                        type: 'unstakeRequest',
                        slug: config_1.TON_TOKEN_SLUG,
                    });
                    return [2 /*return*/, __assign(__assign({}, result), { txId: localTransaction.txId })];
            }
        });
    });
}
exports.submitUnstake = submitUnstake;
function getBackendStakingState(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, address, ledger, state;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    _a = _b.sent(), address = _a.address, ledger = _a.ledger;
                    return [4 /*yield*/, fetchBackendStakingState(address, Boolean(ledger))];
                case 2:
                    state = _b.sent();
                    return [2 /*return*/, __assign(__assign({}, state), { nominatorsPool: __assign(__assign({}, state.nominatorsPool), { start: state.nominatorsPool.start * 1000, end: state.nominatorsPool.end * 1000 }) })];
            }
        });
    });
}
exports.getBackendStakingState = getBackendStakingState;
function fetchBackendStakingState(address, isLedger) {
    return __awaiter(this, void 0, void 0, function () {
        var cacheItem, headers, _a, _b, stakingState;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    cacheItem = backendStakingStateByAddress[address];
                    if (cacheItem && cacheItem[0] > Date.now()) {
                        return [2 /*return*/, cacheItem[1]];
                    }
                    _a = [__assign({}, (0, environment_1.getEnvironment)().apiHeaders)];
                    _c = { 'X-App-Version': config_1.APP_VERSION };
                    _b = 'X-App-ClientID';
                    return [4 /*yield*/, (0, other_1.getClientId)()];
                case 1:
                    headers = __assign.apply(void 0, _a.concat([(_c[_b] = _d.sent(), _c['X-App-Env'] = config_1.APP_ENV, _c)]));
                    return [4 /*yield*/, (0, backend_1.callBackendGet)("/staking/state/".concat(address), {
                            isLedger: isLedger,
                        }, headers)];
                case 2:
                    stakingState = _d.sent();
                    stakingState.balance = (0, decimals_1.fromDecimal)(stakingState.balance);
                    stakingState.totalProfit = (0, decimals_1.fromDecimal)(stakingState.totalProfit);
                    if (!(0, utils_1.isKnownStakingPool)(stakingState.nominatorsPool.address)) {
                        throw Error('Unexpected pool address, likely a malicious activity');
                    }
                    backendStakingStateByAddress[address] = [Date.now() + CACHE_TTL, stakingState];
                    return [2 /*return*/, stakingState];
            }
        });
    });
}
exports.fetchBackendStakingState = fetchBackendStakingState;
function getStakingHistory(accountId, limit, offset) {
    return __awaiter(this, void 0, void 0, function () {
        var address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [2 /*return*/, (0, backend_1.callBackendGet)("/staking/profits/".concat(address), { limit: limit, offset: offset })];
            }
        });
    });
}
exports.getStakingHistory = getStakingHistory;
function onStakingChangeExpected() {
    backendStakingStateByAddress = {};
}
exports.onStakingChangeExpected = onStakingChangeExpected;
function tryUpdateStakingCommonData() {
    return __awaiter(this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, backend_1.callBackendGet)('/staking/common')];
                case 1:
                    data = _a.sent();
                    data.round.start *= 1000;
                    data.round.end *= 1000;
                    data.round.unlock *= 1000;
                    data.prevRound.start *= 1000;
                    data.prevRound.end *= 1000;
                    data.prevRound.unlock *= 1000;
                    data.liquid.available = (0, decimals_1.fromDecimal)(data.liquid.available);
                    (0, cache_1.setStakingCommonCache)(data);
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    (0, logs_1.logDebugError)('tryUpdateLiquidStakingState', err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.tryUpdateStakingCommonData = tryUpdateStakingCommonData;
