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
exports.waitFor = exports.onBeforeUnload = exports.onTickEnd = exports.fastRaf = exports.rafPromise = exports.pause = exports.onIdle = exports.throttleWith = exports.throttleWithTickEnd = exports.throttle = exports.debounce = void 0;
function debounce(fn, ms, shouldRunFirst, shouldRunLast) {
    if (shouldRunFirst === void 0) { shouldRunFirst = true; }
    if (shouldRunLast === void 0) { shouldRunLast = true; }
    var waitingTimeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (waitingTimeout) {
            clearTimeout(waitingTimeout);
            waitingTimeout = undefined;
        }
        else if (shouldRunFirst) {
            fn.apply(void 0, args);
        }
        // eslint-disable-next-line no-restricted-globals
        waitingTimeout = self.setTimeout(function () {
            if (shouldRunLast) {
                fn.apply(void 0, args);
            }
            waitingTimeout = undefined;
        }, ms);
    };
}
exports.debounce = debounce;
function throttle(fn, ms, shouldRunFirst) {
    if (shouldRunFirst === void 0) { shouldRunFirst = true; }
    var interval;
    var isPending;
    var args;
    return function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        isPending = true;
        args = _args;
        if (!interval) {
            if (shouldRunFirst) {
                isPending = false;
                fn.apply(void 0, args);
            }
            // eslint-disable-next-line no-restricted-globals
            interval = self.setInterval(function () {
                if (!isPending) {
                    // eslint-disable-next-line no-restricted-globals
                    self.clearInterval(interval);
                    interval = undefined;
                    return;
                }
                isPending = false;
                fn.apply(void 0, args);
            }, ms);
        }
    };
}
exports.throttle = throttle;
function throttleWithTickEnd(fn) {
    return throttleWith(onTickEnd, fn);
}
exports.throttleWithTickEnd = throttleWithTickEnd;
function throttleWith(schedulerFn, fn) {
    var waiting = false;
    var args;
    return function () {
        var _args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            _args[_i] = arguments[_i];
        }
        args = _args;
        if (!waiting) {
            waiting = true;
            schedulerFn(function () {
                waiting = false;
                fn.apply(void 0, args);
            });
        }
    };
}
exports.throttleWith = throttleWith;
function onIdle(cb, timeout) {
    // eslint-disable-next-line no-restricted-globals
    if (self.requestIdleCallback) {
        // eslint-disable-next-line no-restricted-globals
        self.requestIdleCallback(cb, { timeout: timeout });
    }
    else {
        onTickEnd(cb);
    }
}
exports.onIdle = onIdle;
var pause = function (ms) { return new Promise(function (resolve) {
    setTimeout(function () { return resolve(); }, ms);
}); };
exports.pause = pause;
function rafPromise() {
    return new Promise(function (resolve) {
        fastRaf(resolve);
    });
}
exports.rafPromise = rafPromise;
var FAST_RAF_TIMEOUT_FALLBACK_MS = 35; // < 30 FPS
var fastRafCallbacks;
var fastRafFallbackCallbacks;
var fastRafFallbackTimeout;
// May result in an immediate execution if called from another RAF callback which was scheduled
// (and therefore is executed) earlier than RAF callback scheduled by `fastRaf`
function fastRaf(callback, withTimeoutFallback) {
    if (withTimeoutFallback === void 0) { withTimeoutFallback = false; }
    if (!fastRafCallbacks) {
        fastRafCallbacks = new Set([callback]);
        requestAnimationFrame(function () {
            var currentCallbacks = fastRafCallbacks;
            fastRafCallbacks = undefined;
            fastRafFallbackCallbacks = undefined;
            if (fastRafFallbackTimeout) {
                clearTimeout(fastRafFallbackTimeout);
                fastRafFallbackTimeout = undefined;
            }
            currentCallbacks.forEach(function (cb) { return cb(); });
        });
    }
    else {
        fastRafCallbacks.add(callback);
    }
    if (withTimeoutFallback) {
        if (!fastRafFallbackCallbacks) {
            fastRafFallbackCallbacks = new Set([callback]);
        }
        else {
            fastRafFallbackCallbacks.add(callback);
        }
        if (!fastRafFallbackTimeout) {
            fastRafFallbackTimeout = window.setTimeout(function () {
                var currentTimeoutCallbacks = fastRafFallbackCallbacks;
                if (fastRafCallbacks) {
                    currentTimeoutCallbacks.forEach(fastRafCallbacks.delete, fastRafCallbacks);
                }
                fastRafFallbackCallbacks = undefined;
                if (fastRafFallbackTimeout) {
                    clearTimeout(fastRafFallbackTimeout);
                    fastRafFallbackTimeout = undefined;
                }
                currentTimeoutCallbacks.forEach(function (cb) { return cb(); });
            }, FAST_RAF_TIMEOUT_FALLBACK_MS);
        }
    }
}
exports.fastRaf = fastRaf;
var onTickEndCallbacks;
function onTickEnd(callback) {
    if (!onTickEndCallbacks) {
        onTickEndCallbacks = [callback];
        Promise.resolve().then(function () {
            var currentCallbacks = onTickEndCallbacks;
            onTickEndCallbacks = undefined;
            currentCallbacks.forEach(function (cb) { return cb(); });
        });
    }
    else {
        onTickEndCallbacks.push(callback);
    }
}
exports.onTickEnd = onTickEnd;
var beforeUnloadCallbacks;
function onBeforeUnload(callback, isLast) {
    if (isLast === void 0) { isLast = false; }
    if (!beforeUnloadCallbacks) {
        beforeUnloadCallbacks = [];
        // eslint-disable-next-line no-restricted-globals
        self.addEventListener('beforeunload', function () {
            beforeUnloadCallbacks.forEach(function (cb) { return cb(); });
        });
    }
    if (isLast) {
        beforeUnloadCallbacks.push(callback);
    }
    else {
        beforeUnloadCallbacks.unshift(callback);
    }
    return function () {
        beforeUnloadCallbacks = beforeUnloadCallbacks.filter(function (cb) { return cb !== callback; });
    };
}
exports.onBeforeUnload = onBeforeUnload;
function waitFor(cb, interval, attempts) {
    return __awaiter(this, void 0, void 0, function () {
        var i, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    result = cb();
                    _a.label = 1;
                case 1:
                    if (!(!result && i < attempts)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, exports.pause)(interval)];
                case 2:
                    _a.sent();
                    i++;
                    result = cb();
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, result];
            }
        });
    });
}
exports.waitFor = waitFor;
