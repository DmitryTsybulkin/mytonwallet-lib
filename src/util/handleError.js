"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
var config_1 = require("../config");
var schedulers_1 = require("./schedulers");
var noop = function () {
};
var throttledAlert = typeof window !== 'undefined' ? (0, schedulers_1.throttle)(window.alert, 1000) : noop;
// eslint-disable-next-line no-restricted-globals
self.addEventListener('error', handleErrorEvent);
// eslint-disable-next-line no-restricted-globals
self.addEventListener('unhandledrejection', handleErrorEvent);
function handleErrorEvent(e) {
    // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
    if (e instanceof ErrorEvent && e.message === 'ResizeObserver loop limit exceeded') {
        return;
    }
    e.preventDefault();
    handleError(e instanceof ErrorEvent ? (e.error || e.message) : e.reason);
}
function handleError(err) {
    // eslint-disable-next-line no-console
    console.error(err);
    if (config_1.APP_ENV === 'development' || config_1.APP_ENV === 'staging') {
        throttledAlert("".concat(config_1.DEBUG_ALERT_MSG, "\n\n").concat((err === null || err === void 0 ? void 0 : err.message) || err, "\n").concat(err === null || err === void 0 ? void 0 : err.stack));
    }
}
exports.handleError = handleError;
