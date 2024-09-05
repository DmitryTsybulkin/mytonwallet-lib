"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../config");
var handleError_1 = require("./handleError");
var SAFE_EXEC_ENABLED = !config_1.DEBUG_MORE;
function safeExec(cb, rescue, always) {
    if (!SAFE_EXEC_ENABLED) {
        return cb();
    }
    try {
        return cb();
    }
    catch (err) {
        rescue === null || rescue === void 0 ? void 0 : rescue(err);
        (0, handleError_1.handleError)(err);
        return undefined;
    }
    finally {
        always === null || always === void 0 ? void 0 : always();
    }
}
exports.default = safeExec;
