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
exports.changePassword = exports.removeAccount = exports.resetAccounts = exports.removeNetworkAccounts = exports.importNewWalletVersion = exports.importMnemonic = exports.validateMnemonic = exports.createWallet = exports.generateMnemonic = void 0;
var tonCore_1 = require("../blockchains/ton/util/tonCore");
var types_1 = require("../types");
var config_1 = require("../../config");
var account_1 = require("../../util/account");
var blockchains_1 = require("../blockchains");
var accounts_1 = require("../common/accounts");
var utils_1 = require("../common/utils");
var db_1 = require("../db");
var environment_1 = require("../environment");
var errors_1 = require("../errors");
var storages_1 = require("../storages");
var accounts_2 = require("./accounts");
var dapps_1 = require("./dapps");
function generateMnemonic() {
    return blockchains_1.default.ton.generateMnemonic();
}
exports.generateMnemonic = generateMnemonic;
function createWallet(network, mnemonic, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, mnemonicToSeed, seedToKeyPair, publicKeyToAddress, seedBase64, publicKey, version, address, accountId, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = blockchains_1.default.ton, mnemonicToSeed = _a.mnemonicToSeed, seedToKeyPair = _a.seedToKeyPair, publicKeyToAddress = _a.publicKeyToAddress;
                    return [4 /*yield*/, validateMnemonic(mnemonic)];
                case 1:
                    if (!(_b.sent())) {
                        throw new Error('Invalid mnemonic');
                    }
                    return [4 /*yield*/, mnemonicToSeed(mnemonic)];
                case 2:
                    seedBase64 = _b.sent();
                    publicKey = seedToKeyPair(seedBase64).publicKey;
                    version = config_1.DEFAULT_WALLET_VERSION;
                    address = publicKeyToAddress(network, publicKey, version);
                    return [4 /*yield*/, (0, accounts_1.getNewAccountId)(network)];
                case 3:
                    accountId = _b.sent();
                    return [4 /*yield*/, storeAccount(accountId, mnemonic, password, {
                            address: address,
                            publicKey: (0, utils_1.bytesToHex)(publicKey),
                            version: version,
                        })];
                case 4:
                    result = _b.sent();
                    if ('error' in result) {
                        return [2 /*return*/, result];
                    }
                    void (0, accounts_2.activateAccount)(accountId);
                    return [2 /*return*/, {
                            accountId: accountId,
                            address: address,
                        }];
            }
        });
    });
}
exports.createWallet = createWallet;
function validateMnemonic(mnemonic) {
    return blockchains_1.default.ton.validateMnemonic(mnemonic);
}
exports.validateMnemonic = validateMnemonic;
function importMnemonic(network, mnemonic, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, mnemonicToSeed, seedToKeyPair, pickBestWallet, seedBase64, publicKey, wallet, version, err_1, address, accountId, result;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = blockchains_1.default.ton, mnemonicToSeed = _a.mnemonicToSeed, seedToKeyPair = _a.seedToKeyPair, pickBestWallet = _a.pickBestWallet;
                    return [4 /*yield*/, validateMnemonic(mnemonic)];
                case 1:
                    if (!(_c.sent())) {
                        throw new Error('Invalid mnemonic');
                    }
                    return [4 /*yield*/, mnemonicToSeed(mnemonic)];
                case 2:
                    seedBase64 = _c.sent();
                    publicKey = seedToKeyPair(seedBase64).publicKey;
                    _c.label = 3;
                case 3:
                    _c.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, pickBestWallet(network, publicKey)];
                case 4:
                    (_b = _c.sent(), wallet = _b.wallet, version = _b.version);
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _c.sent();
                    return [2 /*return*/, (0, errors_1.handleServerError)(err_1)];
                case 6:
                    address = (0, tonCore_1.toBase64Address)(wallet.address, false, network);
                    return [4 /*yield*/, (0, accounts_1.getNewAccountId)(network)];
                case 7:
                    accountId = _c.sent();
                    return [4 /*yield*/, storeAccount(accountId, mnemonic, password, {
                            publicKey: (0, utils_1.bytesToHex)(publicKey),
                            address: address,
                            version: version,
                        })];
                case 8:
                    result = _c.sent();
                    if ('error' in result) {
                        return [2 /*return*/, result];
                    }
                    void (0, accounts_2.activateAccount)(accountId);
                    return [2 /*return*/, {
                            accountId: accountId,
                            address: address,
                        }];
            }
        });
    });
}
exports.importMnemonic = importMnemonic;
function importNewWalletVersion(accountId, version) {
    return __awaiter(this, void 0, void 0, function () {
        var publicKeyToAddress, network, account, mnemonicEncrypted, publicKey, newAddress, newAccountId, newAccount;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    publicKeyToAddress = blockchains_1.default.ton.publicKeyToAddress;
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAccount)(accountId)];
                case 1:
                    account = _a.sent();
                    return [4 /*yield*/, (0, accounts_1.getAccountValue)(accountId, 'mnemonicsEncrypted')];
                case 2:
                    mnemonicEncrypted = _a.sent();
                    publicKey = (0, utils_1.hexToBytes)(account.publicKey);
                    newAddress = publicKeyToAddress(network, publicKey, version);
                    return [4 /*yield*/, (0, accounts_1.getNewAccountId)(network)];
                case 3:
                    newAccountId = _a.sent();
                    newAccount = {
                        address: newAddress,
                        publicKey: account.publicKey,
                        version: version,
                    };
                    return [4 /*yield*/, Promise.all([
                            (0, accounts_1.setAccountValue)(newAccountId, 'mnemonicsEncrypted', mnemonicEncrypted),
                            (0, accounts_1.setAccountValue)(newAccountId, 'accounts', newAccount),
                        ])];
                case 4:
                    _a.sent();
                    void (0, accounts_2.activateAccount)(newAccountId);
                    return [2 /*return*/, {
                            accountId: newAccountId,
                            address: newAddress,
                        }];
            }
        });
    });
}
exports.importNewWalletVersion = importNewWalletVersion;
function storeAccount(accountId, mnemonic, password, account) {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonicEncrypted, decryptedMnemonic;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, blockchains_1.default.ton.encryptMnemonic(mnemonic, password)];
                case 1:
                    mnemonicEncrypted = _a.sent();
                    return [4 /*yield*/, blockchains_1.default.ton.decryptMnemonic(mnemonicEncrypted, password)
                            .catch(function () { return undefined; })];
                case 2:
                    decryptedMnemonic = _a.sent();
                    if (!password || !decryptedMnemonic) {
                        return [2 /*return*/, { error: types_1.ApiCommonError.DebugError }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, accounts_1.setAccountValue)(accountId, 'mnemonicsEncrypted', mnemonicEncrypted),
                            (0, accounts_1.setAccountValue)(accountId, 'accounts', account),
                        ])];
                case 3:
                    _a.sent();
                    return [2 /*return*/, {}];
            }
        });
    });
}
function removeNetworkAccounts(network) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, accounts_2.deactivateAllAccounts)();
                    return [4 /*yield*/, Promise.all([
                            (0, accounts_1.removeNetworkAccountsValue)(network, 'mnemonicsEncrypted'),
                            (0, accounts_1.removeNetworkAccountsValue)(network, 'accounts'),
                            (0, environment_1.getEnvironment)().isDappSupported && (0, dapps_1.removeNetworkDapps)(network),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeNetworkAccounts = removeNetworkAccounts;
function resetAccounts() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    (0, accounts_2.deactivateAllAccounts)();
                    return [4 /*yield*/, Promise.all([
                            storages_1.storage.removeItem('mnemonicsEncrypted'),
                            storages_1.storage.removeItem('accounts'),
                            storages_1.storage.removeItem('currentAccountId'),
                            (0, environment_1.getEnvironment)().isDappSupported && (0, dapps_1.removeAllDapps)(),
                            db_1.apiDb.nfts.clear(),
                        ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.resetAccounts = resetAccounts;
function removeAccount(accountId, nextAccountId, newestTxIds) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (0, accounts_1.removeAccountValue)(accountId, 'mnemonicsEncrypted'),
                        (0, accounts_1.removeAccountValue)(accountId, 'accounts'),
                        (0, environment_1.getEnvironment)().isDappSupported && (0, dapps_1.removeAccountDapps)(accountId),
                        db_1.apiDb.nfts.where({ accountId: accountId }).delete(),
                    ])];
                case 1:
                    _a.sent();
                    (0, accounts_2.deactivateCurrentAccount)();
                    return [4 /*yield*/, (0, accounts_2.activateAccount)(nextAccountId, newestTxIds)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeAccount = removeAccount;
function changePassword(oldPassword, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, accountId, mnemonic, encryptedMnemonic;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0;
                    return [4 /*yield*/, (0, accounts_1.getAccountIds)()];
                case 1:
                    _a = _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    accountId = _a[_i];
                    return [4 /*yield*/, blockchains_1.default.ton.fetchMnemonic(accountId, oldPassword)];
                case 3:
                    mnemonic = _b.sent();
                    if (!mnemonic) {
                        throw new Error('Incorrect password');
                    }
                    return [4 /*yield*/, blockchains_1.default.ton.encryptMnemonic(mnemonic, password)];
                case 4:
                    encryptedMnemonic = _b.sent();
                    return [4 /*yield*/, (0, accounts_1.setAccountValue)(accountId, 'mnemonicsEncrypted', encryptedMnemonic)];
                case 5:
                    _b.sent();
                    _b.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.changePassword = changePassword;
