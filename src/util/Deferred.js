"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Deferred = /** @class */ (function () {
    function Deferred() {
        var _this = this;
        this.promise = new Promise(function (resolve, reject) {
            _this.reject = reject;
            _this.resolve = resolve;
        });
    }
    Deferred.resolved = function (value) {
        var deferred = new Deferred();
        deferred.resolve(value);
        return deferred;
    };
    return Deferred;
}());
exports.default = Deferred;
