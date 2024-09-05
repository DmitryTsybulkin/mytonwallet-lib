"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whenTxComplete = exports.txCallbacks = void 0;
var callbacks_1 = require("../../util/callbacks");
exports.txCallbacks = (0, callbacks_1.createCallbackManager)();
function whenTxComplete(normalizedAddress, amount) {
    return new Promise(function (resolve) {
        exports.txCallbacks.addCallback(function callback(transaction) {
            if (transaction.normalizedAddress === normalizedAddress && transaction.amount === -amount) {
                exports.txCallbacks.removeCallback(callback);
                resolve({ result: true, transaction: transaction });
            }
        });
    });
}
exports.whenTxComplete = whenTxComplete;
