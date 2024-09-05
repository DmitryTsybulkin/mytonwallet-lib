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
exports.waitLogin = exports.getCurrentAccountId = exports.getCurrentAccountIdOrFail = exports.getCurrentNetwork = exports.removeNetworkAccountsValue = exports.setAccountValue = exports.removeAccountValue = exports.getAccountValue = exports.updateStoredAccount = exports.fetchStoredAccounts = exports.fetchStoredAccount = exports.fetchStoredAddress = exports.fetchStoredPublicKey = exports.getNewAccountId = exports.getAccountIdWithMnemonic = exports.getAccountIds = exports.loginResolve = void 0;
var account_1 = require("../../util/account");
var storages_1 = require("../storages");
var MIN_ACCOUNT_NUMBER = 0;
var loginPromise = new Promise(function (resolve) {
    exports.loginResolve = resolve;
});
function getAccountIds() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = Object).keys;
                    return [4 /*yield*/, storages_1.storage.getItem('accounts')];
                case 1: return [2 /*return*/, _b.apply(_a, [(_c.sent()) || {}])];
            }
        });
    });
}
exports.getAccountIds = getAccountIds;
function getAccountIdWithMnemonic() {
    return __awaiter(this, void 0, void 0, function () {
        var byId;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, fetchStoredAccounts()];
                case 1:
                    byId = _b.sent();
                    return [2 /*return*/, (_a = Object.entries(byId).find(function (_a) {
                            var account = _a[1];
                            return !account.ledger;
                        })) === null || _a === void 0 ? void 0 : _a[0]];
            }
        });
    });
}
exports.getAccountIdWithMnemonic = getAccountIdWithMnemonic;
function getNewAccountId(network) {
    return __awaiter(this, void 0, void 0, function () {
        var ids, id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAccountIds()];
                case 1:
                    ids = (_a.sent()).map(function (accountId) { return (0, account_1.parseAccountId)(accountId).id; });
                    id = ids.length === 0 ? MIN_ACCOUNT_NUMBER : Math.max.apply(Math, ids) + 1;
                    return [2 /*return*/, (0, account_1.buildAccountId)({
                            id: id,
                            network: network,
                            blockchain: 'ton',
                        })];
            }
        });
    });
}
exports.getNewAccountId = getNewAccountId;
function fetchStoredPublicKey(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchStoredAccount(accountId)];
                case 1: return [2 /*return*/, (_a.sent()).publicKey];
            }
        });
    });
}
exports.fetchStoredPublicKey = fetchStoredPublicKey;
function fetchStoredAddress(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchStoredAccount(accountId)];
                case 1: return [2 /*return*/, (_a.sent()).address];
            }
        });
    });
}
exports.fetchStoredAddress = fetchStoredAddress;
function fetchStoredAccount(accountId) {
    return getAccountValue(accountId, 'accounts');
}
exports.fetchStoredAccount = fetchStoredAccount;
function fetchStoredAccounts() {
    return storages_1.storage.getItem('accounts');
}
exports.fetchStoredAccounts = fetchStoredAccounts;
function updateStoredAccount(accountId, partial) {
    return __awaiter(this, void 0, void 0, function () {
        var account;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchStoredAccount(accountId)];
                case 1:
                    account = _a.sent();
                    return [2 /*return*/, setAccountValue(accountId, 'accounts', __assign(__assign({}, account), partial))];
            }
        });
    });
}
exports.updateStoredAccount = updateStoredAccount;
function getAccountValue(accountId, key) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, storages_1.storage.getItem(key)];
                case 1: return [2 /*return*/, (_a = (_b.sent())) === null || _a === void 0 ? void 0 : _a[accountId]];
            }
        });
    });
}
exports.getAccountValue = getAccountValue;
function removeAccountValue(accountId, key) {
    return __awaiter(this, void 0, void 0, function () {
        var data, _a, _b, removedValue, restData;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, storages_1.storage.getItem(key)];
                case 1:
                    data = _c.sent();
                    if (!data)
                        return [2 /*return*/];
                    _a = data, _b = accountId, removedValue = _a[_b], restData = __rest(_a, [typeof _b === "symbol" ? _b : _b + ""]);
                    return [4 /*yield*/, storages_1.storage.setItem(key, restData)];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeAccountValue = removeAccountValue;
function setAccountValue(accountId, key, value) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, storages_1.storage.getItem(key)];
                case 1:
                    data = _b.sent();
                    return [4 /*yield*/, storages_1.storage.setItem(key, __assign(__assign({}, data), (_a = {}, _a[accountId] = value, _a)))];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setAccountValue = setAccountValue;
function removeNetworkAccountsValue(network, key) {
    return __awaiter(this, void 0, void 0, function () {
        var data, _i, _a, accountId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, storages_1.storage.getItem(key)];
                case 1:
                    data = _b.sent();
                    if (!data)
                        return [2 /*return*/];
                    for (_i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
                        accountId = _a[_i];
                        if ((0, account_1.parseAccountId)(accountId).network === network) {
                            delete data[accountId];
                        }
                    }
                    return [4 /*yield*/, storages_1.storage.setItem(key, data)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeNetworkAccountsValue = removeNetworkAccountsValue;
function getCurrentNetwork() {
    return __awaiter(this, void 0, void 0, function () {
        var accountId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCurrentAccountId()];
                case 1:
                    accountId = _a.sent();
                    if (!accountId)
                        return [2 /*return*/, undefined];
                    return [2 /*return*/, (0, account_1.parseAccountId)(accountId).network];
            }
        });
    });
}
exports.getCurrentNetwork = getCurrentNetwork;
function getCurrentAccountIdOrFail() {
    return __awaiter(this, void 0, void 0, function () {
        var accountId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getCurrentAccountId()];
                case 1:
                    accountId = _a.sent();
                    if (!accountId) {
                        throw new Error('The user is not authorized in the wallet');
                    }
                    return [2 /*return*/, accountId];
            }
        });
    });
}
exports.getCurrentAccountIdOrFail = getCurrentAccountIdOrFail;
function getCurrentAccountId() {
    return storages_1.storage.getItem('currentAccountId');
}
exports.getCurrentAccountId = getCurrentAccountId;
function waitLogin() {
    return loginPromise;
}
exports.waitLogin = waitLogin;
