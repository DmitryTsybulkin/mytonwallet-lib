"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectAllDappPromises = exports.rejectDappPromise = exports.resolveDappPromise = exports.createDappPromise = void 0;
var generateUniqueId_1 = require("../../util/generateUniqueId");
var errors_1 = require("../errors");
var deferreds = new Map();
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        });
    }
    return Deferred;
}());
function createDappPromise(promiseId) {
    if (promiseId === void 0) { promiseId = (0, generateUniqueId_1.default)(); }
    var deferred = new Deferred();
    deferreds.set(promiseId, deferred);
    var promise = deferred.promise;
    return { promiseId: promiseId, promise: promise };
}
exports.createDappPromise = createDappPromise;
function resolveDappPromise(promiseId, value) {
    var deferred = deferreds.get(promiseId);
    if (!deferred) {
        return;
    }
    deferred.resolve(value);
    deferreds.delete(promiseId);
}
exports.resolveDappPromise = resolveDappPromise;
function rejectDappPromise(promiseId, reason) {
    if (reason === void 0) { reason = 'Unknown rejection reason'; }
    var deferred = deferreds.get(promiseId);
    if (!deferred) {
        return;
    }
    deferred.reject(new errors_1.ApiUserRejectsError(reason));
    deferreds.delete(promiseId);
}
exports.rejectDappPromise = rejectDappPromise;
function rejectAllDappPromises(message) {
    Array.from(deferreds.keys()).forEach(function (id) {
        rejectDappPromise(id, message);
    });
}
exports.rejectAllDappPromises = rejectAllDappPromises;
