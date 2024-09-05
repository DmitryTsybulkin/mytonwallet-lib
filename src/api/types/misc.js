"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiLiquidUnstakeMode = exports.TRANSFER_TIMEOUT_SEC = exports.WORKCHAIN = exports.Workchain = void 0;
var Workchain;
(function (Workchain) {
    Workchain[Workchain["MasterChain"] = -1] = "MasterChain";
    Workchain[Workchain["BaseChain"] = 0] = "BaseChain";
})(Workchain || (exports.Workchain = Workchain = {}));
exports.WORKCHAIN = Workchain.BaseChain;
exports.TRANSFER_TIMEOUT_SEC = 60; // 1 min.
var ApiLiquidUnstakeMode;
(function (ApiLiquidUnstakeMode) {
    ApiLiquidUnstakeMode[ApiLiquidUnstakeMode["Default"] = 0] = "Default";
    ApiLiquidUnstakeMode[ApiLiquidUnstakeMode["Instant"] = 1] = "Instant";
    ApiLiquidUnstakeMode[ApiLiquidUnstakeMode["BestRate"] = 2] = "BestRate";
})(ApiLiquidUnstakeMode || (exports.ApiLiquidUnstakeMode = ApiLiquidUnstakeMode = {}));
