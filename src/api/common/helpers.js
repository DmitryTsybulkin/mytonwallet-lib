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
exports.migrateStorage = exports.waitStorageMigration = exports.startStorageMigration = exports.isUpdaterAlive = exports.disconnectUpdater = exports.connectUpdater = exports.updateTransactionMetadata = exports.buildLocalTransaction = exports.buildInternalAccountId = exports.toInternalAccountId = exports.resolveBlockchainKey = void 0;
var config_1 = require("../../config");
var account_1 = require("../../util/account");
var areDeepEqual_1 = require("../../util/areDeepEqual");
var tonCore_1 = require("../blockchains/ton/util/tonCore");
var db_1 = require("../db");
var environment_1 = require("../environment");
var storages_1 = require("../storages");
var capacitorStorage_1 = require("../storages/capacitorStorage");
var idb_1 = require("../storages/idb");
var addresses_1 = require("./addresses");
var utils_1 = require("./utils");
var localCounter = 0;
var getNextLocalId = function () { return "".concat(Date.now(), "|").concat(localCounter++); };
var actualStateVersion = 15;
var migrationEnsurePromise;
function resolveBlockchainKey(accountId) {
    return (0, account_1.parseAccountId)(accountId).blockchain;
}
exports.resolveBlockchainKey = resolveBlockchainKey;
function toInternalAccountId(accountId) {
    return buildInternalAccountId((0, account_1.parseAccountId)(accountId));
}
exports.toInternalAccountId = toInternalAccountId;
function buildInternalAccountId(account) {
    var id = account.id, blockchain = account.blockchain;
    return "".concat(id, "-").concat(blockchain);
}
exports.buildInternalAccountId = buildInternalAccountId;
function buildLocalTransaction(params, normalizedAddress) {
    var amount = params.amount, restParams = __rest(params, ["amount"]);
    var transaction = updateTransactionMetadata(__assign(__assign({}, restParams), { txId: getNextLocalId(), timestamp: Date.now(), isIncoming: false, amount: -amount, normalizedAddress: normalizedAddress, extraData: {} }));
    return __assign(__assign({}, transaction), { id: transaction.txId, kind: 'transaction' });
}
exports.buildLocalTransaction = buildLocalTransaction;
function updateTransactionMetadata(transaction) {
    var normalizedAddress = transaction.normalizedAddress, comment = transaction.comment;
    var _a = transaction.metadata, metadata = _a === void 0 ? {} : _a;
    var knownAddresses = (0, addresses_1.getKnownAddresses)();
    var scamMarkers = (0, addresses_1.getScamMarkers)();
    if (normalizedAddress in knownAddresses) {
        metadata = __assign(__assign({}, metadata), knownAddresses[normalizedAddress]);
    }
    if (comment && scamMarkers.map(function (sm) { return sm.test(comment); }).find(Boolean)) {
        metadata.isScam = true;
    }
    return __assign(__assign({}, transaction), { metadata: metadata });
}
exports.updateTransactionMetadata = updateTransactionMetadata;
var currentOnUpdate;
function connectUpdater(onUpdate) {
    currentOnUpdate = onUpdate;
}
exports.connectUpdater = connectUpdater;
function disconnectUpdater() {
    currentOnUpdate = undefined;
}
exports.disconnectUpdater = disconnectUpdater;
function isUpdaterAlive(onUpdate) {
    return currentOnUpdate === onUpdate;
}
exports.isUpdaterAlive = isUpdaterAlive;
function startStorageMigration(onUpdate, ton) {
    migrationEnsurePromise = migrateStorage(onUpdate, ton);
    return migrationEnsurePromise;
}
exports.startStorageMigration = startStorageMigration;
function waitStorageMigration() {
    return migrationEnsurePromise;
}
exports.waitStorageMigration = waitStorageMigration;
function migrateStorage(onUpdate, ton) {
    return __awaiter(this, void 0, void 0, function () {
        var version, _a, idbVersion, _b, idbData, mnemonicEncrypted, _i, _c, field, raw, oldItem, newItem, addresses, _d, _e, field, newValue, _f, _g, key, rawData, dapps, _h, _j, accountDapps, _k, _l, dapp, _m, _o, key, data, addresses, publicKeys, accounts, _p, _q, _r, accountId, oldAddress, newAddress, dapps, items, _s, _t, accountDapps, _u, _v, dapp, data, _w, _x, _y, key, value, newValue, accounts, _z, _0, account, publicKey, address, walletVersion, publicKeyBytes, walletInfo, accounts, _1, _2, _3, accountId, account, network, keys, _4, keys_1, key, value;
        var _5;
        var _6, _7, _8;
        return __generator(this, function (_9) {
            switch (_9.label) {
                case 0:
                    _a = Number;
                    return [4 /*yield*/, storages_1.storage.getItem('stateVersion', true)];
                case 1:
                    version = _a.apply(void 0, [_9.sent()]);
                    if (version === actualStateVersion) {
                        return [2 /*return*/];
                    }
                    if (!(config_1.IS_CAPACITOR && !version)) return [3 /*break*/, 5];
                    return [4 /*yield*/, storages_1.storage.getItem('accounts', true)];
                case 2:
                    if (!_9.sent()) return [3 /*break*/, 3];
                    // Fix broken version
                    version = 10;
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, idb_1.default.getItem('stateVersion')];
                case 4:
                    idbVersion = _9.sent();
                    if (idbVersion) {
                        version = Number(idbVersion);
                    }
                    _9.label = 5;
                case 5:
                    _b = config_1.IS_EXTENSION && !version;
                    if (!_b) return [3 /*break*/, 7];
                    return [4 /*yield*/, storages_1.storage.getItem('addresses')];
                case 6:
                    _b = !(_9.sent());
                    _9.label = 7;
                case 7:
                    if (!_b) return [3 /*break*/, 11];
                    return [4 /*yield*/, idb_1.default.getItem('stateVersion')];
                case 8:
                    version = _9.sent();
                    if (!version) return [3 /*break*/, 11];
                    return [4 /*yield*/, idb_1.default.getAll()];
                case 9:
                    idbData = _9.sent();
                    return [4 /*yield*/, storages_1.storage.setMany(idbData)];
                case 10:
                    _9.sent();
                    _9.label = 11;
                case 11:
                    if (!!version) return [3 /*break*/, 13];
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', actualStateVersion)];
                case 12:
                    _9.sent();
                    return [2 /*return*/];
                case 13:
                    if (!!version) return [3 /*break*/, 24];
                    return [4 /*yield*/, storages_1.storage.getItem('mnemonicEncrypted')];
                case 14:
                    mnemonicEncrypted = _9.sent();
                    if (!mnemonicEncrypted) return [3 /*break*/, 17];
                    return [4 /*yield*/, storages_1.storage.setItem('mnemonicsEncrypted', JSON.stringify((_5 = {},
                            _5[config_1.MAIN_ACCOUNT_ID] = mnemonicEncrypted,
                            _5)))];
                case 15:
                    _9.sent();
                    return [4 /*yield*/, storages_1.storage.removeItem('mnemonicEncrypted')];
                case 16:
                    _9.sent();
                    _9.label = 17;
                case 17:
                    if (!!mnemonicEncrypted) return [3 /*break*/, 22];
                    _i = 0, _c = ['mnemonicsEncrypted', 'addresses', 'publicKeys'];
                    _9.label = 18;
                case 18:
                    if (!(_i < _c.length)) return [3 /*break*/, 22];
                    field = _c[_i];
                    return [4 /*yield*/, storages_1.storage.getItem(field)];
                case 19:
                    raw = _9.sent();
                    if (!raw)
                        return [3 /*break*/, 21];
                    oldItem = JSON.parse(raw);
                    newItem = Object.entries(oldItem).reduce(function (prevValue, _a) {
                        var accountId = _a[0], data = _a[1];
                        prevValue[toInternalAccountId(accountId)] = data;
                        return prevValue;
                    }, {});
                    return [4 /*yield*/, storages_1.storage.setItem(field, JSON.stringify(newItem))];
                case 20:
                    _9.sent();
                    _9.label = 21;
                case 21:
                    _i++;
                    return [3 /*break*/, 18];
                case 22:
                    version = 1;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 23:
                    _9.sent();
                    _9.label = 24;
                case 24:
                    if (!(version === 1)) return [3 /*break*/, 32];
                    return [4 /*yield*/, storages_1.storage.getItem('addresses')];
                case 25:
                    addresses = _9.sent();
                    if (!(addresses && addresses.includes('-undefined'))) return [3 /*break*/, 30];
                    _d = 0, _e = ['mnemonicsEncrypted', 'addresses', 'publicKeys'];
                    _9.label = 26;
                case 26:
                    if (!(_d < _e.length)) return [3 /*break*/, 30];
                    field = _e[_d];
                    return [4 /*yield*/, storages_1.storage.getItem(field)];
                case 27:
                    newValue = (_9.sent()).replace('-undefined', '-ton');
                    return [4 /*yield*/, storages_1.storage.setItem(field, newValue)];
                case 28:
                    _9.sent();
                    _9.label = 29;
                case 29:
                    _d++;
                    return [3 /*break*/, 26];
                case 30:
                    version = 2;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 31:
                    _9.sent();
                    _9.label = 32;
                case 32:
                    if (!(version >= 2 && version <= 4)) return [3 /*break*/, 39];
                    _f = 0, _g = ['addresses', 'mnemonicsEncrypted', 'publicKeys', 'dapps'];
                    _9.label = 33;
                case 33:
                    if (!(_f < _g.length)) return [3 /*break*/, 37];
                    key = _g[_f];
                    return [4 /*yield*/, storages_1.storage.getItem(key)];
                case 34:
                    rawData = _9.sent();
                    if (!(typeof rawData === 'string')) return [3 /*break*/, 36];
                    return [4 /*yield*/, storages_1.storage.setItem(key, JSON.parse(rawData))];
                case 35:
                    _9.sent();
                    _9.label = 36;
                case 36:
                    _f++;
                    return [3 /*break*/, 33];
                case 37:
                    version = 5;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 38:
                    _9.sent();
                    _9.label = 39;
                case 39:
                    if (!(version === 5)) return [3 /*break*/, 44];
                    return [4 /*yield*/, storages_1.storage.getItem('dapps')];
                case 40:
                    dapps = _9.sent();
                    if (!dapps) return [3 /*break*/, 42];
                    for (_h = 0, _j = Object.values(dapps); _h < _j.length; _h++) {
                        accountDapps = _j[_h];
                        for (_k = 0, _l = Object.values(accountDapps); _k < _l.length; _k++) {
                            dapp = _l[_k];
                            dapp.connectedAt = 1;
                        }
                    }
                    return [4 /*yield*/, storages_1.storage.setItem('dapps', dapps)];
                case 41:
                    _9.sent();
                    _9.label = 42;
                case 42:
                    version = 6;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 43:
                    _9.sent();
                    _9.label = 44;
                case 44:
                    if (!(version === 6)) return [3 /*break*/, 51];
                    _m = 0, _o = ['addresses', 'mnemonicsEncrypted', 'publicKeys', 'accounts', 'dapps'];
                    _9.label = 45;
                case 45:
                    if (!(_m < _o.length)) return [3 /*break*/, 49];
                    key = _o[_m];
                    return [4 /*yield*/, storages_1.storage.getItem(key)];
                case 46:
                    data = _9.sent();
                    if (!data)
                        return [3 /*break*/, 48];
                    data = Object.entries(data).reduce(function (byAccountId, _a) {
                        var _b;
                        var internalAccountId = _a[0], accountData = _a[1];
                        var parsed = (0, account_1.parseAccountId)(internalAccountId);
                        var mainnetAccountId = (0, account_1.buildAccountId)(__assign(__assign({}, parsed), { network: 'mainnet' }));
                        var testnetAccountId = (0, account_1.buildAccountId)(__assign(__assign({}, parsed), { network: 'testnet' }));
                        return __assign(__assign({}, byAccountId), (_b = {}, _b[mainnetAccountId] = accountData, _b[testnetAccountId] = accountData, _b));
                    }, {});
                    return [4 /*yield*/, storages_1.storage.setItem(key, data)];
                case 47:
                    _9.sent();
                    _9.label = 48;
                case 48:
                    _m++;
                    return [3 /*break*/, 45];
                case 49:
                    version = 7;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 50:
                    _9.sent();
                    _9.label = 51;
                case 51:
                    if (!(version === 7)) return [3 /*break*/, 60];
                    return [4 /*yield*/, storages_1.storage.getItem('addresses')];
                case 52:
                    addresses = (_9.sent());
                    if (!addresses) return [3 /*break*/, 58];
                    return [4 /*yield*/, storages_1.storage.getItem('publicKeys')];
                case 53:
                    publicKeys = (_9.sent());
                    return [4 /*yield*/, storages_1.storage.getItem('accounts')];
                case 54:
                    accounts = ((_6 = _9.sent()) !== null && _6 !== void 0 ? _6 : {});
                    for (_p = 0, _q = Object.entries(addresses); _p < _q.length; _p++) {
                        _r = _q[_p], accountId = _r[0], oldAddress = _r[1];
                        newAddress = (0, tonCore_1.toBase64Address)(oldAddress, false);
                        accounts[accountId] = __assign(__assign({}, accounts[accountId]), { address: newAddress, publicKey: publicKeys[accountId] });
                        onUpdate({
                            type: 'updateAccount',
                            accountId: accountId,
                            partial: {
                                address: newAddress,
                            },
                        });
                    }
                    return [4 /*yield*/, storages_1.storage.setItem('accounts', accounts)];
                case 55:
                    _9.sent();
                    return [4 /*yield*/, storages_1.storage.removeItem('addresses')];
                case 56:
                    _9.sent();
                    return [4 /*yield*/, storages_1.storage.removeItem('publicKeys')];
                case 57:
                    _9.sent();
                    _9.label = 58;
                case 58:
                    version = 8;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 59:
                    _9.sent();
                    _9.label = 60;
                case 60:
                    if (!(version === 8)) return [3 /*break*/, 65];
                    if (!(0, environment_1.getEnvironment)().isSseSupported) return [3 /*break*/, 63];
                    return [4 /*yield*/, storages_1.storage.getItem('dapps')];
                case 61:
                    dapps = _9.sent();
                    if (!dapps) return [3 /*break*/, 63];
                    items = [];
                    for (_s = 0, _t = Object.values(dapps); _s < _t.length; _s++) {
                        accountDapps = _t[_s];
                        for (_u = 0, _v = Object.values(accountDapps); _u < _v.length; _u++) {
                            dapp = _v[_u];
                            if ((_7 = dapp.sse) === null || _7 === void 0 ? void 0 : _7.appClientId) {
                                items.push({ clientId: (_8 = dapp.sse) === null || _8 === void 0 ? void 0 : _8.appClientId });
                            }
                        }
                    }
                    if (!items.length) return [3 /*break*/, 63];
                    return [4 /*yield*/, db_1.apiDb.sseConnections.bulkPut(items)];
                case 62:
                    _9.sent();
                    _9.label = 63;
                case 63:
                    version = 9;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 64:
                    _9.sent();
                    _9.label = 65;
                case 65:
                    if (!(version === 9)) return [3 /*break*/, 75];
                    if (!config_1.IS_CAPACITOR) return [3 /*break*/, 73];
                    return [4 /*yield*/, idb_1.default.getAll()];
                case 66:
                    data = _9.sent();
                    _w = 0, _x = Object.entries(data);
                    _9.label = 67;
                case 67:
                    if (!(_w < _x.length)) return [3 /*break*/, 71];
                    _y = _x[_w], key = _y[0], value = _y[1];
                    return [4 /*yield*/, capacitorStorage_1.default.setItem(key, value)];
                case 68:
                    _9.sent();
                    return [4 /*yield*/, capacitorStorage_1.default.getItem(key, true)];
                case 69:
                    newValue = _9.sent();
                    if (!(0, areDeepEqual_1.areDeepEqual)(value, newValue)) {
                        throw new Error('Migration error!');
                    }
                    _9.label = 70;
                case 70:
                    _w++;
                    return [3 /*break*/, 67];
                case 71: return [4 /*yield*/, idb_1.default.clear()];
                case 72:
                    _9.sent();
                    _9.label = 73;
                case 73:
                    version = 10;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 74:
                    _9.sent();
                    _9.label = 75;
                case 75:
                    if (!(version === 10 || version === 11 || version === 12)) return [3 /*break*/, 80];
                    return [4 /*yield*/, storages_1.storage.getItem('accounts', true)];
                case 76:
                    accounts = _9.sent();
                    if (!accounts) return [3 /*break*/, 78];
                    for (_z = 0, _0 = Object.values(accounts); _z < _0.length; _z++) {
                        account = _0[_z];
                        publicKey = account.publicKey, address = account.address, walletVersion = account.version;
                        if (walletVersion)
                            continue;
                        publicKeyBytes = (0, utils_1.hexToBytes)(publicKey);
                        walletInfo = ton.pickWalletByAddress('mainnet', publicKeyBytes, address);
                        account.version = walletInfo.version;
                    }
                    return [4 /*yield*/, storages_1.storage.setItem('accounts', accounts)];
                case 77:
                    _9.sent();
                    _9.label = 78;
                case 78:
                    version = 13;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 79:
                    _9.sent();
                    _9.label = 80;
                case 80:
                    if (!(version === 13)) return [3 /*break*/, 83];
                    return [4 /*yield*/, storages_1.storage.getItem('accounts', true)];
                case 81:
                    accounts = _9.sent();
                    if (!accounts) return [3 /*break*/, 83];
                    for (_1 = 0, _2 = Object.entries(accounts); _1 < _2.length; _1++) {
                        _3 = _2[_1], accountId = _3[0], account = _3[1];
                        network = (0, account_1.parseAccountId)(accountId).network;
                        if (network === 'testnet') {
                            account.address = (0, tonCore_1.toBase64Address)(account.address, false, network);
                            onUpdate({
                                type: 'updateAccount',
                                accountId: accountId,
                                partial: {
                                    address: account.address,
                                },
                            });
                        }
                    }
                    return [4 /*yield*/, storages_1.storage.setItem('accounts', accounts)];
                case 82:
                    _9.sent();
                    _9.label = 83;
                case 83:
                    if (!(version === 14)) return [3 /*break*/, 92];
                    if (!(0, environment_1.getEnvironment)().isIosApp) return [3 /*break*/, 90];
                    return [4 /*yield*/, capacitorStorage_1.default.getKeys()];
                case 84:
                    keys = _9.sent();
                    if (!(keys === null || keys === void 0 ? void 0 : keys.length)) return [3 /*break*/, 90];
                    _4 = 0, keys_1 = keys;
                    _9.label = 85;
                case 85:
                    if (!(_4 < keys_1.length)) return [3 /*break*/, 90];
                    key = keys_1[_4];
                    return [4 /*yield*/, capacitorStorage_1.default.getItem(key, true)];
                case 86:
                    value = _9.sent();
                    return [4 /*yield*/, capacitorStorage_1.default.removeItem(key)];
                case 87:
                    _9.sent();
                    return [4 /*yield*/, capacitorStorage_1.default.setItem(key, value)];
                case 88:
                    _9.sent();
                    _9.label = 89;
                case 89:
                    _4++;
                    return [3 /*break*/, 85];
                case 90:
                    version = 15;
                    return [4 /*yield*/, storages_1.storage.setItem('stateVersion', version)];
                case 91:
                    _9.sent();
                    _9.label = 92;
                case 92: return [2 /*return*/];
            }
        });
    });
}
exports.migrateStorage = migrateStorage;
