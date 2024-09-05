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
exports.fetchPriceHistory = exports.setBaseCurrency = exports.getBaseCurrency = void 0;
var config_1 = require("../../config");
var backend_1 = require("../common/backend");
var storages_1 = require("../storages");
var preload_1 = require("./preload");
var tokens_1 = require("./tokens");
function getBaseCurrency() {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, storages_1.storage.getItem('baseCurrency')];
                case 1: return [2 /*return*/, (_a = (_b.sent())) !== null && _a !== void 0 ? _a : config_1.DEFAULT_PRICE_CURRENCY];
            }
        });
    });
}
exports.getBaseCurrency = getBaseCurrency;
function setBaseCurrency(currency) {
    return storages_1.storage.setItem('baseCurrency', currency);
}
exports.setBaseCurrency = setBaseCurrency;
function fetchPriceHistory(slug_1, period_1) {
    return __awaiter(this, arguments, void 0, function (slug, period, baseCurrency) {
        var token;
        var _a;
        if (baseCurrency === void 0) { baseCurrency = config_1.DEFAULT_PRICE_CURRENCY; }
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, (0, preload_1.waitDataPreload)()];
                case 1:
                    _b.sent();
                    token = (0, tokens_1.resolveTokenBySlug)(slug);
                    if (!token) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, (0, backend_1.callBackendGet)("/prices/chart/".concat((_a = token.minterAddress) !== null && _a !== void 0 ? _a : config_1.TON_SYMBOL), {
                            base: baseCurrency,
                            period: period,
                        })];
            }
        });
    });
}
exports.fetchPriceHistory = fetchPriceHistory;
