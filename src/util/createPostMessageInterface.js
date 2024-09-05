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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExtensionInterface = exports.createPostMessageInterface = void 0;
var bigint_1 = require("./bigint");
var logs_1 = require("./logs");
var callbackState = new Map();
function createPostMessageInterface(api, channel, target, shouldIgnoreErrors) {
    if (target === void 0) { target = self; }
    function sendToOrigin(data, transferables) {
        data.channel = channel;
        if (transferables) {
            target.postMessage(data, transferables);
        }
        else {
            target.postMessage(data);
        }
    }
    if (!shouldIgnoreErrors) {
        handleErrors(sendToOrigin);
    }
    target.onmessage = function (message) {
        var _a;
        if (((_a = message.data) === null || _a === void 0 ? void 0 : _a.channel) === channel) {
            onMessage(api, message.data, sendToOrigin);
        }
    };
}
exports.createPostMessageInterface = createPostMessageInterface;
function createExtensionInterface(portName, api, channel, cleanUpdater, withAutoInit) {
    if (withAutoInit === void 0) { withAutoInit = false; }
    chrome.runtime.onConnect.addListener(function (port) {
        var _a;
        if (port.name !== portName) {
            return;
        }
        /**
         * If the sender's URL includes the DETACHED_TAB_URL, we skip further processing
         * This condition ensures that we don't interact with tabs that have already been closed.
         */
        var url = (_a = port.sender) === null || _a === void 0 ? void 0 : _a.url;
        var origin = url ? new URL(url).origin : undefined;
        var dAppUpdater = function (update) {
            sendToOrigin({
                type: 'update',
                update: update,
            });
        };
        function sendToOrigin(data) {
            data.channel = channel;
            var json = JSON.stringify(data);
            port.postMessage(json);
        }
        handleErrors(sendToOrigin);
        port.onMessage.addListener(function (data) {
            if (typeof data === 'string') {
                data = JSON.parse(data, bigint_1.bigintReviver);
            }
            if (data.channel === channel) {
                onMessage(api, data, sendToOrigin, dAppUpdater, origin);
            }
        });
        port.onDisconnect.addListener(function () {
            cleanUpdater === null || cleanUpdater === void 0 ? void 0 : cleanUpdater(dAppUpdater);
        });
        if (withAutoInit) {
            onMessage(api, { type: 'init', name: 'init', args: [] }, sendToOrigin, dAppUpdater);
        }
    });
}
exports.createExtensionInterface = createExtensionInterface;
function onMessage(api, data, sendToOrigin, onUpdate, origin) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, args, promise, messageId_1, name_1, args, withCallback, callback, response, _b, arrayBuffer, err_1, callback;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!onUpdate) {
                        onUpdate = function (update) {
                            sendToOrigin({
                                type: 'update',
                                update: update,
                            });
                        };
                    }
                    _a = data.type;
                    switch (_a) {
                        case 'init': return [3 /*break*/, 1];
                        case 'callMethod': return [3 /*break*/, 3];
                        case 'cancelProgress': return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 12];
                case 1:
                    args = data.args;
                    promise = typeof api === 'function'
                        ? api.apply(void 0, __spreadArray(['init', origin, onUpdate], args, false)) : (_c = api.init) === null || _c === void 0 ? void 0 : _c.call.apply(_c, __spreadArray([api, onUpdate], args, false));
                    return [4 /*yield*/, promise];
                case 2:
                    _d.sent();
                    return [3 /*break*/, 12];
                case 3:
                    messageId_1 = data.messageId, name_1 = data.name, args = data.args, withCallback = data.withCallback;
                    _d.label = 4;
                case 4:
                    _d.trys.push([4, 9, , 10]);
                    if (messageId_1 && withCallback) {
                        callback = function () {
                            var callbackArgs = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                callbackArgs[_i] = arguments[_i];
                            }
                            var lastArg = callbackArgs[callbackArgs.length - 1];
                            sendToOrigin({
                                type: 'methodCallback',
                                messageId: messageId_1,
                                callbackArgs: callbackArgs,
                            }, isTransferable(lastArg) ? [lastArg] : undefined);
                        };
                        callbackState.set(messageId_1, callback);
                        args.push(callback);
                    }
                    if (!(typeof api === 'function')) return [3 /*break*/, 6];
                    return [4 /*yield*/, api.apply(void 0, __spreadArray([name_1, origin], args, false))];
                case 5:
                    _b = _d.sent();
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, api[name_1].apply(api, args)];
                case 7:
                    _b = _d.sent();
                    _d.label = 8;
                case 8:
                    response = _b;
                    arrayBuffer = ((typeof response === 'object' && 'arrayBuffer' in response && response) || {}).arrayBuffer;
                    if (messageId_1) {
                        sendToOrigin({
                            type: 'methodResponse',
                            messageId: messageId_1,
                            response: response,
                        }, arrayBuffer ? [arrayBuffer] : undefined);
                    }
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _d.sent();
                    (0, logs_1.logDebugError)(name_1, err_1);
                    if (messageId_1) {
                        sendToOrigin({
                            type: 'methodResponse',
                            messageId: messageId_1,
                            error: { message: err_1.message },
                        });
                    }
                    return [3 /*break*/, 10];
                case 10:
                    if (messageId_1) {
                        callbackState.delete(messageId_1);
                    }
                    return [3 /*break*/, 12];
                case 11:
                    {
                        callback = callbackState.get(data.messageId);
                        if (callback) {
                            callback.isCanceled = true;
                        }
                        return [3 /*break*/, 12];
                    }
                    _d.label = 12;
                case 12: return [2 /*return*/];
            }
        });
    });
}
function isTransferable(obj) {
    return obj instanceof ArrayBuffer || obj instanceof ImageBitmap;
}
function handleErrors(sendToOrigin) {
    self.onerror = function (e) {
        var _a;
        // eslint-disable-next-line no-console
        console.error(e);
        sendToOrigin({ type: 'unhandledError', error: { message: ((_a = e.error) === null || _a === void 0 ? void 0 : _a.message) || 'Uncaught exception in worker' } });
    };
    self.addEventListener('unhandledrejection', function (e) {
        var _a;
        // eslint-disable-next-line no-console
        console.error(e);
        sendToOrigin({ type: 'unhandledError', error: { message: ((_a = e.reason) === null || _a === void 0 ? void 0 : _a.message) || 'Uncaught rejection in worker' } });
    });
}
