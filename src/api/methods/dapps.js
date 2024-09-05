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
exports.fetchDappCatalog = exports.setSseLastEventId = exports.getSseLastEventId = exports.removeNetworkDapps = exports.removeAllDapps = exports.removeAccountDapps = exports.getDappsState = exports.findLastConnectedAccount = exports.getDappsByOrigin = exports.getDapps = exports.deleteAllDapps = exports.deleteDapp = exports.addDapp = exports.getDapp = exports.updateDapp = exports.isDappActive = exports.deactivateAllDapps = exports.deactivateAccountDapp = exports.findActiveDappAccount = exports.deactivateDapp = exports.getActiveDapp = exports.activateDapp = exports.onActiveDappAccountUpdated = exports.initDapps = void 0;
var account_1 = require("../../util/account");
var accounts_1 = require("../common/accounts");
var backend_1 = require("../common/backend");
var helpers_1 = require("../common/helpers");
var hooks_1 = require("../hooks");
var storages_1 = require("../storages");
var activeDappByAccountId = {};
var onUpdate;
function initDapps(_onUpdate) {
    onUpdate = _onUpdate;
}
exports.initDapps = initDapps;
function onActiveDappAccountUpdated(accountId) {
    var activeDappOrigin = getActiveDapp(accountId);
    onUpdate({
        type: 'updateActiveDapp',
        accountId: accountId,
        origin: activeDappOrigin,
    });
}
exports.onActiveDappAccountUpdated = onActiveDappAccountUpdated;
function activateDapp(accountId, origin) {
    var oldAccountId = findActiveDappAccount(origin);
    activeDappByAccountId[accountId] = origin;
    // The method can be called in headless mode (tonConnect:reconnect)
    if (!onUpdate || !(0, helpers_1.isUpdaterAlive)(onUpdate)) {
        return;
    }
    if (oldAccountId) {
        onUpdate({
            type: 'updateActiveDapp',
            accountId: oldAccountId,
        });
    }
    onUpdate({
        type: 'updateActiveDapp',
        accountId: accountId,
        origin: origin,
    });
}
exports.activateDapp = activateDapp;
function getActiveDapp(accountId) {
    return activeDappByAccountId[accountId];
}
exports.getActiveDapp = getActiveDapp;
function deactivateDapp(origin) {
    var accountId = findActiveDappAccount(origin);
    if (!accountId) {
        return false;
    }
    deactivateAccountDapp(accountId);
    return true;
}
exports.deactivateDapp = deactivateDapp;
function findActiveDappAccount(origin) {
    return Object.keys(activeDappByAccountId).find(function (acc) { return origin === activeDappByAccountId[acc]; });
}
exports.findActiveDappAccount = findActiveDappAccount;
function deactivateAccountDapp(accountId) {
    var activeOrigin = activeDappByAccountId[accountId];
    if (!activeOrigin) {
        return false;
    }
    delete activeDappByAccountId[accountId];
    if (onUpdate && (0, helpers_1.isUpdaterAlive)(onUpdate)) {
        onUpdate({
            type: 'updateActiveDapp',
            accountId: accountId,
        });
    }
    return true;
}
exports.deactivateAccountDapp = deactivateAccountDapp;
function deactivateAllDapps() {
    for (var _i = 0, _a = Object.entries(activeDappByAccountId); _i < _a.length; _i++) {
        var _b = _a[_i], accountId = _b[0], value = _b[1];
        if (!value) {
            continue;
        }
        delete activeDappByAccountId[accountId];
        onUpdate({
            type: 'updateActiveDapp',
            accountId: accountId,
        });
    }
}
exports.deactivateAllDapps = deactivateAllDapps;
function isDappActive(accountId, origin) {
    return activeDappByAccountId[accountId] === origin;
}
exports.isDappActive = isDappActive;
function updateDapp(accountId, origin, updater) {
    return __awaiter(this, void 0, void 0, function () {
        var dapp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDapp(accountId, origin)];
                case 1:
                    dapp = _a.sent();
                    return [4 /*yield*/, addDapp(accountId, updater(dapp))];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateDapp = updateDapp;
function getDapp(accountId, origin) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, accounts_1.getAccountValue)(accountId, 'dapps')];
                case 1: return [2 /*return*/, (_a.sent())[origin]];
            }
        });
    });
}
exports.getDapp = getDapp;
function addDapp(accountId, dapp) {
    return __awaiter(this, void 0, void 0, function () {
        var dapps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDappsByOrigin(accountId)];
                case 1:
                    dapps = _a.sent();
                    dapps[dapp.origin] = dapp;
                    return [4 /*yield*/, (0, accounts_1.setAccountValue)(accountId, 'dapps', dapps)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.addDapp = addDapp;
function deleteDapp(accountId, origin, dontNotifyDapp) {
    return __awaiter(this, void 0, void 0, function () {
        var dapps;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDappsByOrigin(accountId)];
                case 1:
                    dapps = _a.sent();
                    if (!(origin in dapps)) {
                        return [2 /*return*/, false];
                    }
                    if (isDappActive(accountId, origin)) {
                        deactivateAccountDapp(accountId);
                    }
                    delete dapps[origin];
                    return [4 /*yield*/, (0, accounts_1.setAccountValue)(accountId, 'dapps', dapps)];
                case 2:
                    _a.sent();
                    if (onUpdate && (0, helpers_1.isUpdaterAlive)(onUpdate)) {
                        onUpdate({
                            type: 'dappDisconnect',
                            accountId: accountId,
                            origin: origin,
                        });
                    }
                    if (!!dontNotifyDapp) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, hooks_1.callHook)('onDappDisconnected', accountId, origin)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, (0, hooks_1.callHook)('onDappsChanged')];
                case 5:
                    _a.sent();
                    return [2 /*return*/, true];
            }
        });
    });
}
exports.deleteDapp = deleteDapp;
function deleteAllDapps(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var origins, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    deactivateAccountDapp(accountId);
                    _b = (_a = Object).keys;
                    return [4 /*yield*/, getDappsByOrigin(accountId)];
                case 1:
                    origins = _b.apply(_a, [_c.sent()]);
                    return [4 /*yield*/, (0, accounts_1.setAccountValue)(accountId, 'dapps', {})];
                case 2:
                    _c.sent();
                    origins.forEach(function (origin) {
                        onUpdate({
                            type: 'dappDisconnect',
                            accountId: accountId,
                            origin: origin,
                        });
                        (0, hooks_1.callHook)('onDappDisconnected', accountId, origin);
                    });
                    return [4 /*yield*/, (0, hooks_1.callHook)('onDappsChanged')];
                case 3:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteAllDapps = deleteAllDapps;
function getDapps(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _b = (_a = Object).values;
                    return [4 /*yield*/, getDappsByOrigin(accountId)];
                case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
            }
        });
    });
}
exports.getDapps = getDapps;
function getDappsByOrigin(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, accounts_1.getAccountValue)(accountId, 'dapps')];
                case 1: return [2 /*return*/, (_a.sent()) || {}];
            }
        });
    });
}
exports.getDappsByOrigin = getDappsByOrigin;
function findLastConnectedAccount(network, origin) {
    return __awaiter(this, void 0, void 0, function () {
        var dapps, connectedAt, lastConnectedAccountId;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getDappsState()];
                case 1:
                    dapps = (_a.sent()) || {};
                    connectedAt = 0;
                    Object.entries(dapps).forEach(function (_a) {
                        var accountId = _a[0], byOrigin = _a[1];
                        if (!(origin in byOrigin))
                            return;
                        if ((byOrigin[origin].connectedAt) > connectedAt) {
                            connectedAt = byOrigin[origin].connectedAt;
                            lastConnectedAccountId = accountId;
                        }
                    });
                    if (!lastConnectedAccountId) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, (0, account_1.buildAccountId)(__assign(__assign({}, (0, account_1.parseAccountId)(lastConnectedAccountId)), { network: network }))];
            }
        });
    });
}
exports.findLastConnectedAccount = findLastConnectedAccount;
function getDappsState() {
    return storages_1.storage.getItem('dapps');
}
exports.getDappsState = getDappsState;
function removeAccountDapps(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, accounts_1.removeAccountValue)(accountId, 'dapps')];
                case 1:
                    _a.sent();
                    (0, hooks_1.callHook)('onDappsChanged');
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeAccountDapps = removeAccountDapps;
function removeAllDapps() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, storages_1.storage.removeItem('dapps')];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, hooks_1.callHook)('onDappsChanged')];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.removeAllDapps = removeAllDapps;
function removeNetworkDapps(network) {
    return (0, accounts_1.removeNetworkAccountsValue)(network, 'dapps');
}
exports.removeNetworkDapps = removeNetworkDapps;
function getSseLastEventId() {
    return storages_1.storage.getItem('sseLastEventId');
}
exports.getSseLastEventId = getSseLastEventId;
function setSseLastEventId(lastEventId) {
    return storages_1.storage.setItem('sseLastEventId', lastEventId);
}
exports.setSseLastEventId = setSseLastEventId;
function fetchDappCatalog() {
    return (0, backend_1.callBackendGet)('/dapp/catalog');
}
exports.fetchDappCatalog = fetchDappCatalog;
