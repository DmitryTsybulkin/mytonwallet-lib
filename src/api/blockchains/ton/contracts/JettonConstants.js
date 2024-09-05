"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.Op = void 0;
// eslint-disable-next-line max-classes-per-file
var Op = /** @class */ (function () {
    function Op() {
    }
    Op.transfer = 0xf8a7ea5;
    Op.transfer_notification = 0x7362d09c;
    Op.internal_transfer = 0x178d4519;
    Op.excesses = 0xd53276db;
    Op.burn = 0x595f07bc;
    Op.burn_notification = 0x7bdd97de;
    Op.provide_wallet_address = 0x2c76b973;
    Op.take_wallet_address = 0xd1735400;
    Op.mint = 21;
    Op.change_admin = 3;
    Op.change_content = 4;
    return Op;
}());
exports.Op = Op;
var Errors = /** @class */ (function () {
    function Errors() {
    }
    Errors.invalid_op = 709;
    Errors.not_admin = 73;
    Errors.unouthorized_burn = 74;
    Errors.discovery_fee_not_matched = 75;
    Errors.wrong_op = 0xffff;
    Errors.not_owner = 705;
    Errors.not_enough_ton = 709;
    Errors.not_enough_gas = 707;
    Errors.not_valid_wallet = 707;
    Errors.wrong_workchain = 333;
    Errors.balance_error = 706;
    return Errors;
}());
exports.Errors = Errors;
