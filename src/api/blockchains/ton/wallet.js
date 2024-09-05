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
exports.resolveWalletVersion = exports.pickAccountWallet = exports.pickWalletByAddress = exports.getWalletStateInit = exports.getWalletVersions = exports.getWalletVersionInfos = exports.pickBestWallet = exports.getWalletSeqno = exports.getWalletBalance = exports.getAccountBalance = exports.getContractInfo = exports.getWalletInfo = exports.buildWallet = exports.publicKeyToAddress = exports.isActiveSmartContract = exports.isAddressInitialized = void 0;
var core_1 = require("@ton/core");
var types_1 = require("../../types");
var config_1 = require("../../../config");
var account_1 = require("../../../util/account");
var iteratees_1 = require("../../../util/iteratees");
var withCacheAsync_1 = require("../../../util/withCacheAsync");
var util_1 = require("./util");
var tonCore_1 = require("./util/tonCore");
var accounts_1 = require("../../common/accounts");
var utils_1 = require("../../common/utils");
var constants_1 = require("./constants");
exports.isAddressInitialized = (0, withCacheAsync_1.default)(function (network, walletOrAddress) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getWalletInfo(network, walletOrAddress)];
            case 1: return [2 /*return*/, (_a.sent()).isInitialized];
        }
    });
}); });
exports.isActiveSmartContract = (0, withCacheAsync_1.default)(function (network, address) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, isInitialized, isWallet;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, getWalletInfo(network, address)];
            case 1:
                _a = _b.sent(), isInitialized = _a.isInitialized, isWallet = _a.isWallet;
                return [2 /*return*/, isInitialized ? !isWallet : undefined];
        }
    });
}); }, function (value) { return value !== undefined; });
function publicKeyToAddress(network, publicKey, walletVersion) {
    var wallet = buildWallet(network, publicKey, walletVersion);
    return (0, tonCore_1.toBase64Address)(wallet.address, false, network);
}
exports.publicKeyToAddress = publicKeyToAddress;
function buildWallet(network, publicKey, walletVersion) {
    var client = (0, tonCore_1.getTonClient)(network);
    var WalletClass = tonCore_1.walletClassMap[walletVersion];
    return client.open(WalletClass.create({
        publicKey: Buffer.from(publicKey),
        workchain: types_1.WORKCHAIN,
    }));
}
exports.buildWallet = buildWallet;
function getWalletInfo(network, walletOrAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var address, _a, accountState, isWallet, _b, seqno, balance, _c, lt, hash;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    address = typeof walletOrAddress === 'string'
                        ? walletOrAddress
                        : (0, tonCore_1.toBase64Address)(walletOrAddress.address, undefined, network);
                    return [4 /*yield*/, (0, tonCore_1.getTonClient)(network).getWalletInfo(address)];
                case 1:
                    _a = _d.sent(), accountState = _a.account_state, isWallet = _a.wallet, _b = _a.seqno, seqno = _b === void 0 ? 0 : _b, balance = _a.balance, _c = _a.last_transaction_id, lt = _c.lt, hash = _c.hash;
                    return [2 /*return*/, {
                            isInitialized: accountState === 'active',
                            isWallet: isWallet,
                            seqno: seqno,
                            balance: BigInt(balance || '0'),
                            lastTxId: lt === '0'
                                ? undefined
                                : (0, util_1.stringifyTxId)({ lt: lt, hash: hash }),
                        }];
            }
        });
    });
}
exports.getWalletInfo = getWalletInfo;
function getContractInfo(network, address) {
    return __awaiter(this, void 0, void 0, function () {
        var data, code, state, codeHash, _a, _b, contractInfo, isInitialized, isWallet, isLedgerAllowed, isSwapAllowed;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, (0, tonCore_1.getTonClient)(network).getAddressInfo(address)];
                case 1:
                    data = _c.sent();
                    code = data.code, state = data.state;
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, (0, utils_1.sha256)((0, utils_1.base64ToBytes)(code))];
                case 2:
                    codeHash = _b.apply(_a, [_c.sent()]).toString('hex');
                    contractInfo = Object.values(constants_1.KnownContracts).find(function (info) { return info.hash === codeHash; });
                    isInitialized = state === 'active';
                    isWallet = state === 'active' ? (contractInfo === null || contractInfo === void 0 ? void 0 : contractInfo.type) === 'wallet' : undefined;
                    isLedgerAllowed = Boolean(!isInitialized || (contractInfo === null || contractInfo === void 0 ? void 0 : contractInfo.isLedgerAllowed));
                    isSwapAllowed = contractInfo === null || contractInfo === void 0 ? void 0 : contractInfo.isSwapAllowed;
                    return [2 /*return*/, {
                            isInitialized: isInitialized,
                            isWallet: isWallet,
                            isLedgerAllowed: isLedgerAllowed,
                            isSwapAllowed: isSwapAllowed,
                            contractInfo: contractInfo,
                            codeHash: codeHash,
                        }];
            }
        });
    });
}
exports.getContractInfo = getContractInfo;
function getAccountBalance(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [2 /*return*/, getWalletBalance(network, address)];
            }
        });
    });
}
exports.getAccountBalance = getAccountBalance;
function getWalletBalance(network, walletOrAddress) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getWalletInfo(network, walletOrAddress)];
                case 1: return [2 /*return*/, (_a.sent()).balance];
            }
        });
    });
}
exports.getWalletBalance = getWalletBalance;
function getWalletSeqno(network, walletOrAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var seqno;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getWalletInfo(network, walletOrAddress)];
                case 1:
                    seqno = (_a.sent()).seqno;
                    return [2 /*return*/, seqno || 0];
            }
        });
    });
}
exports.getWalletSeqno = getWalletSeqno;
function pickBestWallet(network, publicKey) {
    return __awaiter(this, void 0, void 0, function () {
        var allWallets, withBiggestBalance, version, wallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getWalletVersionInfos(network, publicKey)];
                case 1:
                    allWallets = _a.sent();
                    withBiggestBalance = allWallets.reduce(function (best, current) {
                        return best && best.balance > current.balance ? best : current;
                    }, undefined);
                    if (!withBiggestBalance || !withBiggestBalance.balance) {
                        version = config_1.DEFAULT_WALLET_VERSION;
                        wallet = buildWallet(network, publicKey, version);
                        return [2 /*return*/, { wallet: wallet, version: version, balance: 0n }];
                    }
                    return [2 /*return*/, withBiggestBalance];
            }
        });
    });
}
exports.pickBestWallet = pickBestWallet;
function getWalletVersionInfos(network, publicKey, versions) {
    var _this = this;
    if (versions === void 0) { versions = constants_1.ALL_WALLET_VERSIONS; }
    return Promise.all(versions.map(function (version) { return __awaiter(_this, void 0, void 0, function () {
        var wallet, address, walletInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wallet = buildWallet(network, publicKey, version);
                    address = (0, tonCore_1.toBase64Address)(wallet.address, false, network);
                    return [4 /*yield*/, getWalletInfo(network, wallet)];
                case 1:
                    walletInfo = _a.sent();
                    return [2 /*return*/, __assign({ wallet: wallet, address: address, version: version }, (0, iteratees_1.pick)(walletInfo, ['isInitialized', 'balance', 'lastTxId']))];
            }
        });
    }); }));
}
exports.getWalletVersionInfos = getWalletVersionInfos;
function getWalletVersions(network, publicKey, versions) {
    if (versions === void 0) { versions = constants_1.ALL_WALLET_VERSIONS; }
    return versions.map(function (version) {
        var wallet = buildWallet(network, publicKey, version);
        var address = (0, tonCore_1.toBase64Address)(wallet.address, false, network);
        return {
            wallet: wallet,
            address: address,
            version: version,
        };
    });
}
exports.getWalletVersions = getWalletVersions;
function getWalletStateInit(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var wallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pickAccountWallet(accountId)];
                case 1:
                    wallet = _a.sent();
                    return [2 /*return*/, (0, core_1.beginCell)()
                            .storeWritable((0, core_1.storeStateInit)(wallet.init))
                            .endCell()];
            }
        });
    });
}
exports.getWalletStateInit = getWalletStateInit;
function pickWalletByAddress(network, publicKey, address) {
    address = (0, tonCore_1.toBase64Address)(address, false, network);
    var allWallets = getWalletVersions(network, publicKey);
    return allWallets.find(function (w) { return w.address === address; });
}
exports.pickWalletByAddress = pickWalletByAddress;
function pickAccountWallet(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var network, _a, publicKey, version, publicKeyBytes;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    _a = _b.sent(), publicKey = _a.publicKey, version = _a.version;
                    publicKeyBytes = (0, utils_1.hexToBytes)(publicKey);
                    return [2 /*return*/, buildWallet(network, publicKeyBytes, version)];
            }
        });
    });
}
exports.pickAccountWallet = pickAccountWallet;
function resolveWalletVersion(wallet) {
    var _a;
    return (_a = Object.entries(tonCore_1.walletClassMap)
        .find(function (_a) {
        var walletClass = _a[1];
        return wallet instanceof walletClass;
    })) === null || _a === void 0 ? void 0 : _a[0];
}
exports.resolveWalletVersion = resolveWalletVersion;
