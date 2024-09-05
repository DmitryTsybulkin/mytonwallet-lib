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
exports.createExtensionConnector = exports.createConnector = void 0;
var bigint_1 = require("./bigint");
var generateUniqueId_1 = require("./generateUniqueId");
var logs_1 = require("./logs");
var ConnectorClass = /** @class */ (function () {
    function ConnectorClass(target, onUpdate, channel, shouldUseJson, targetOrigin) {
        if (targetOrigin === void 0) { targetOrigin = '*'; }
        this.target = target;
        this.onUpdate = onUpdate;
        this.channel = channel;
        this.shouldUseJson = shouldUseJson;
        this.targetOrigin = targetOrigin;
        this.requestStates = new Map();
        this.requestStatesByCallback = new Map();
    }
    // eslint-disable-next-line class-methods-use-this
    ConnectorClass.prototype.destroy = function () {
    };
    ConnectorClass.prototype.init = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.postMessage({
            type: 'init',
            args: args,
        });
    };
    ConnectorClass.prototype.request = function (messageData) {
        var _a = this, requestStates = _a.requestStates, requestStatesByCallback = _a.requestStatesByCallback;
        var messageId = (0, generateUniqueId_1.default)();
        var payload = __assign({ type: 'callMethod', messageId: messageId }, messageData);
        var requestState = { messageId: messageId };
        // Re-wrap type because of `postMessage`
        var promise = new Promise(function (resolve, reject) {
            Object.assign(requestState, { resolve: resolve, reject: reject });
        });
        if (typeof payload.args[payload.args.length - 1] === 'function') {
            payload.withCallback = true;
            var callback = payload.args.pop();
            requestState.callback = callback;
            requestStatesByCallback.set(callback, requestState);
        }
        requestStates.set(messageId, requestState);
        promise
            .catch(function () { return undefined; })
            .finally(function () {
            requestStates.delete(messageId);
            if (requestState.callback) {
                requestStatesByCallback.delete(requestState.callback);
            }
        });
        this.postMessage(payload);
        return promise;
    };
    ConnectorClass.prototype.cancelCallback = function (progressCallback) {
        progressCallback.isCanceled = true;
        var messageId = (this.requestStatesByCallback.get(progressCallback) || {}).messageId;
        if (!messageId) {
            return;
        }
        this.postMessage({
            type: 'cancelProgress',
            messageId: messageId,
        });
    };
    ConnectorClass.prototype.onMessage = function (data) {
        var _a, _b;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data, bigint_1.bigintReviver);
            }
            catch (err) {
                (0, logs_1.logDebugError)('PostMessageConnector: Failed to parse message', err);
                return;
            }
        }
        var _c = this, requestStates = _c.requestStates, channel = _c.channel;
        if (data.channel !== channel) {
            return;
        }
        if (data.type === 'update' && this.onUpdate) {
            this.onUpdate(data.update);
        }
        if (data.type === 'methodResponse') {
            var requestState = requestStates.get(data.messageId);
            if (requestState) {
                if (data.error) {
                    requestState.reject(data.error);
                }
                else {
                    requestState.resolve(data.response);
                }
            }
        }
        else if (data.type === 'methodCallback') {
            var requestState = requestStates.get(data.messageId);
            (_a = requestState === null || requestState === void 0 ? void 0 : requestState.callback) === null || _a === void 0 ? void 0 : _a.call.apply(_a, __spreadArray([requestState], data.callbackArgs, false));
        }
        else if (data.type === 'unhandledError') {
            throw new Error((_b = data.error) === null || _b === void 0 ? void 0 : _b.message);
        }
    };
    ConnectorClass.prototype.postMessage = function (data) {
        data.channel = this.channel;
        var rawData = data;
        if (this.shouldUseJson) {
            rawData = JSON.stringify(data);
        }
        if ('open' in this.target) { // Is Window
            this.target.postMessage(rawData, this.targetOrigin);
        }
        else {
            this.target.postMessage(rawData);
        }
    };
    return ConnectorClass;
}());
function createConnector(worker, onUpdate, channel, targetOrigin) {
    var connector = new ConnectorClass(worker, onUpdate, channel, undefined, targetOrigin);
    function handleMessage(_a) {
        var data = _a.data;
        connector.onMessage(data);
    }
    worker.addEventListener('message', handleMessage); // TS weirdly complains here
    connector.destroy = function () {
        worker.removeEventListener('message', handleMessage);
    };
    return connector;
}
exports.createConnector = createConnector;
function createExtensionConnector(name, onUpdate, getInitArgs, channel) {
    var connector = new ConnectorClass(connect(), onUpdate, channel, true);
    function connect() {
        // eslint-disable-next-line no-restricted-globals
        var port = self.chrome.runtime.connect({ name: name });
        port.onMessage.addListener(function (data) {
            connector.onMessage(data);
        });
        // For some reason port can suddenly get disconnected
        port.onDisconnect.addListener(function () {
            connector.target = connect();
            connector.init(getInitArgs === null || getInitArgs === void 0 ? void 0 : getInitArgs());
        });
        return port;
    }
    connector.init(getInitArgs === null || getInitArgs === void 0 ? void 0 : getInitArgs());
    return connector;
}
exports.createExtensionConnector = createExtensionConnector;
