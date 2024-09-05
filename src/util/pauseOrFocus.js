"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setIsAppFocused = exports.pauseOrFocus = void 0;
var schedulers_1 = require("./schedulers");
var Deferred_1 = require("./Deferred");
var deferreds = new Set();
var isFocused = true;
function pauseOrFocus(ms, msWhenNotFocused) {
    if (msWhenNotFocused === void 0) { msWhenNotFocused = ms; }
    var deferred = new Deferred_1.default();
    deferreds.add(deferred);
    deferred.promise.then(function () {
        deferreds.delete(deferred);
    });
    (0, schedulers_1.pause)(isFocused ? ms : msWhenNotFocused).then(deferred.resolve);
    return deferred.promise;
}
exports.pauseOrFocus = pauseOrFocus;
function setIsAppFocused(_isFocused) {
    isFocused = _isFocused;
    if (_isFocused) {
        deferreds.forEach(function (d) { return d.resolve(); });
    }
}
exports.setIsAppFocused = setIsAppFocused;
