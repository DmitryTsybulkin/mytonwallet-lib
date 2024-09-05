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
exports.handleFetchErrors = exports.fetchWithTimeout = exports.fetchWithRetry = exports.fetchJson = void 0;
var config_1 = require("../config");
var errors_1 = require("../api/errors");
var logs_1 = require("./logs");
var schedulers_1 = require("./schedulers");
var DEFAULT_TIMEOUTS = [5000, 10000, 30000]; // 5, 10, 30 sec
function fetchJson(url, data, init) {
    return __awaiter(this, void 0, void 0, function () {
        var urlObject, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    urlObject = new URL(url);
                    if (data) {
                        Object.entries(data).forEach(function (_a) {
                            var key = _a[0], value = _a[1];
                            if (value === undefined) {
                                return;
                            }
                            if (Array.isArray(value)) {
                                value.forEach(function (item) {
                                    urlObject.searchParams.append(key, item.toString());
                                });
                            }
                            else {
                                urlObject.searchParams.set(key, value.toString());
                            }
                        });
                    }
                    return [4 /*yield*/, fetchWithRetry(urlObject, init)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.json()];
            }
        });
    });
}
exports.fetchJson = fetchJson;
function fetchWithRetry(url, init, options) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, retries, _c, timeouts, conditionFn, message, statusCode, i, timeout, response, error, err_1;
        var _d, _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _a = options !== null && options !== void 0 ? options : {}, _b = _a.retries, retries = _b === void 0 ? config_1.DEFAULT_RETRIES : _b, _c = _a.timeouts, timeouts = _c === void 0 ? DEFAULT_TIMEOUTS : _c, conditionFn = _a.conditionFn;
                    message = 'Unknown error.';
                    i = 1;
                    _f.label = 1;
                case 1:
                    if (!(i <= retries)) return [3 /*break*/, 10];
                    _f.label = 2;
                case 2:
                    _f.trys.push([2, 6, , 9]);
                    if (i > 1) {
                        (0, logs_1.logDebug)("Retry request #".concat(i, ":"), url.toString());
                    }
                    timeout = Array.isArray(timeouts)
                        ? (_d = timeouts[i - 1]) !== null && _d !== void 0 ? _d : timeouts[timeouts.length - 1]
                        : timeouts;
                    return [4 /*yield*/, fetchWithTimeout(url, init, timeout)];
                case 3:
                    response = _f.sent();
                    statusCode = response.status;
                    if (!(statusCode >= 400)) return [3 /*break*/, 5];
                    if (response.headers.get('content-type') !== 'application/json') {
                        throw new Error("HTTP Error ".concat(statusCode));
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    error = (_f.sent()).error;
                    throw new Error(error !== null && error !== void 0 ? error : "HTTP Error ".concat(statusCode));
                case 5: return [2 /*return*/, response];
                case 6:
                    err_1 = _f.sent();
                    message = typeof err_1 === 'string' ? err_1 : (_e = err_1.message) !== null && _e !== void 0 ? _e : message;
                    if (statusCode === 400 || (conditionFn === null || conditionFn === void 0 ? void 0 : conditionFn(message, statusCode))) {
                        throw new errors_1.ApiServerError(message, statusCode);
                    }
                    if (!(i < retries)) return [3 /*break*/, 8];
                    return [4 /*yield*/, (0, schedulers_1.pause)(config_1.DEFAULT_ERROR_PAUSE * i)];
                case 7:
                    _f.sent();
                    _f.label = 8;
                case 8: return [3 /*break*/, 9];
                case 9:
                    i++;
                    return [3 /*break*/, 1];
                case 10: throw new errors_1.ApiServerError(message);
            }
        });
    });
}
exports.fetchWithRetry = fetchWithRetry;
function fetchWithTimeout(url_1, init_1) {
    return __awaiter(this, arguments, void 0, function (url, init, timeout) {
        var controller, id;
        if (timeout === void 0) { timeout = config_1.DEFAULT_TIMEOUT; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    controller = new AbortController();
                    id = setTimeout(function () {
                        controller.abort();
                    }, timeout);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    return [4 /*yield*/, fetch(url, __assign(__assign({}, init), { signal: controller.signal }))];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    clearTimeout(id);
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchWithTimeout = fetchWithTimeout;
function handleFetchErrors(response, ignoreHttpCodes) {
    if (!response.ok && (!(ignoreHttpCodes === null || ignoreHttpCodes === void 0 ? void 0 : ignoreHttpCodes.includes(response.status)))) {
        throw new Error(response.statusText);
    }
    return response;
}
exports.handleFetchErrors = handleFetchErrors;
