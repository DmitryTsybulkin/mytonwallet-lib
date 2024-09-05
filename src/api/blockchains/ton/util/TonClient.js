"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.TonClient = void 0;
var axios_1 = require("axios");
var TonClient_1 = require("@ton/ton/dist/client/TonClient");
var config_1 = require("../../../../config");
var axios_retry_1 = require("../../../../lib/axios-retry");
var fetch_1 = require("../../../../util/fetch");
var logs_1 = require("../../../../util/logs");
(0, axios_retry_1.default)(axios_1.default, {
    retries: config_1.DEFAULT_RETRIES,
    retryDelay: function (retryCount) {
        return retryCount * config_1.DEFAULT_ERROR_PAUSE;
    },
    onRetry: function (retryNumber, _, requestConfig) {
        (0, logs_1.logDebug)("Retry request #".concat(retryNumber, ":"), requestConfig.url);
    },
});
var TonClient = /** @class */ (function (_super) {
    __extends(TonClient, _super);
    function TonClient(parameters) {
        var _this = _super.call(this, parameters) || this;
        _this.initParameters = parameters;
        return _this;
    }
    TonClient.prototype.getWalletInfo = function (address) {
        return this.callRpc('getWalletInformation', { address: address });
    };
    TonClient.prototype.getAddressInfo = function (address) {
        return this.callRpc('getAddressInformation', { address: address });
    };
    TonClient.prototype.callRpc = function (method, params) {
        return this.sendRequest(this.parameters.endpoint, {
            id: 1, jsonrpc: '2.0',
            method: method,
            params: params,
        });
    };
    TonClient.prototype.sendRequest = function (apiUrl, request) {
        return __awaiter(this, void 0, void 0, function () {
            var method, headers, body, response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        method = request.method;
                        headers = __assign(__assign({}, this.initParameters.headers), { 'Content-Type': 'application/json' });
                        if (this.parameters.apiKey) {
                            headers['X-API-Key'] = this.parameters.apiKey;
                        }
                        body = JSON.stringify(request);
                        return [4 /*yield*/, (0, fetch_1.fetchWithRetry)(apiUrl, {
                                method: 'POST',
                                body: body,
                                headers: headers,
                            }, {
                                conditionFn: function (message, statusCode) { return isNotTemporaryError(method, message, statusCode); },
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        return [2 /*return*/, data.result];
                }
            });
        });
    };
    return TonClient;
}(TonClient_1.TonClient));
exports.TonClient = TonClient;
function isNotTemporaryError(method, message, statusCode) {
    return Boolean(statusCode === 422 || (method === 'sendBoc' && (message === null || message === void 0 ? void 0 : message.includes('exitcode='))));
}
