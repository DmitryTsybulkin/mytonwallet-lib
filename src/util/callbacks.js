"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEmitter = exports.createCallbackManager = void 0;
function createCallbackManager() {
    var callbacks = new Set();
    function addCallback(cb) {
        callbacks.add(cb);
        return function () {
            removeCallback(cb);
        };
    }
    function removeCallback(cb) {
        callbacks.delete(cb);
    }
    function runCallbacks() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        callbacks.forEach(function (callback) {
            callback.apply(void 0, args);
        });
    }
    function hasCallbacks() {
        return Boolean(callbacks.size);
    }
    return {
        runCallbacks: runCallbacks,
        addCallback: addCallback,
        removeCallback: removeCallback,
        hasCallbacks: hasCallbacks,
    };
}
exports.createCallbackManager = createCallbackManager;
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.channels = new Map();
    }
    EventEmitter.prototype.on = function (name, handler) {
        this.resolveChannel(name).addCallback(handler);
        return this;
    };
    EventEmitter.prototype.removeListener = function (name, handler) {
        this.resolveChannel(name).removeCallback(handler);
        return this;
    };
    EventEmitter.prototype.emit = function (name) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        (_a = this.resolveChannel(name)).runCallbacks.apply(_a, args);
        return this;
    };
    EventEmitter.prototype.resolveChannel = function (name) {
        var channel = this.channels.get(name);
        if (!channel) {
            channel = createCallbackManager();
            this.channels.set(name, channel);
        }
        return channel;
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
