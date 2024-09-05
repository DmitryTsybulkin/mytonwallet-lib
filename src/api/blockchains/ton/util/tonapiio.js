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
exports.fetchAccountEvents = exports.fetchAccountNfts = exports.fetchNftItems = exports.fetchJettonBalances = void 0;
var tonapi_sdk_js_1 = require("tonapi-sdk-js");
var config_1 = require("../../../../config");
var fetch_1 = require("../../../../util/fetch");
var environment_1 = require("../../../environment");
var MAX_LIMIT = 500;
var EVENTS_LIMIT = 100;
var apiByNetwork;
function getApi(network) {
    if (!apiByNetwork) {
        var headers = __assign(__assign({}, (0, environment_1.getEnvironment)().apiHeaders), { 'Content-Type': 'application/json' });
        apiByNetwork = {
            mainnet: new tonapi_sdk_js_1.Api(new tonapi_sdk_js_1.HttpClient({
                baseUrl: config_1.TONAPIIO_MAINNET_URL,
                baseApiParams: { headers: headers },
                customFetch: fetch_1.fetchWithRetry,
            })),
            testnet: new tonapi_sdk_js_1.Api(new tonapi_sdk_js_1.HttpClient({
                baseUrl: config_1.TONAPIIO_TESTNET_URL,
                baseApiParams: { headers: headers },
                customFetch: fetch_1.fetchWithRetry,
            })),
        };
    }
    return apiByNetwork[network];
}
function fetchJettonBalances(network, account) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getApi(network).accounts.getAccountJettonsBalances(account)];
                case 1: return [2 /*return*/, (_a.sent()).balances];
            }
        });
    });
}
exports.fetchJettonBalances = fetchJettonBalances;
function fetchNftItems(network, addresses) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getApi(network).nft.getNftItemsByAddresses({
                        account_ids: addresses,
                    })];
                case 1: return [2 /*return*/, (_a.sent()).nft_items];
            }
        });
    });
}
exports.fetchNftItems = fetchNftItems;
function fetchAccountNfts(network, address, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, collection, offset, limit;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = options !== null && options !== void 0 ? options : {}, collection = _a.collection, offset = _a.offset, limit = _a.limit;
                    return [4 /*yield*/, getApi(network).accounts.getAccountNftItems(address, {
                            offset: offset !== null && offset !== void 0 ? offset : 0,
                            limit: limit !== null && limit !== void 0 ? limit : MAX_LIMIT,
                            indirect_ownership: true,
                            collection: collection,
                        })];
                case 1: return [2 /*return*/, (_b.sent()).nft_items];
            }
        });
    });
}
exports.fetchAccountNfts = fetchAccountNfts;
function fetchAccountEvents(network, address, fromSec, limit) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getApi(network).accounts.getAccountEvents(address, {
                        limit: limit !== null && limit !== void 0 ? limit : EVENTS_LIMIT,
                        start_date: fromSec,
                    })];
                case 1: return [2 /*return*/, (_a.sent()).events];
            }
        });
    });
}
exports.fetchAccountEvents = fetchAccountEvents;
