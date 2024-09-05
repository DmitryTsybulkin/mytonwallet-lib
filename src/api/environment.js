"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironment = exports.setEnvironment = void 0;
var config_1 = require("../config");
var ELECTRON_ORIGIN = 'file://';
var environment;
function setEnvironment(args) {
    environment = __assign(__assign({}, args), { isDappSupported: config_1.IS_EXTENSION || config_1.IS_CAPACITOR || args.isElectron, isSseSupported: args.isElectron || (config_1.IS_CAPACITOR && !args.isNativeBottomSheet), 
        // eslint-disable-next-line no-restricted-globals
        apiHeaders: { 'X-App-Origin': args.isElectron ? ELECTRON_ORIGIN : self === null || self === void 0 ? void 0 : self.origin }, tonhttpapiMainnetKey: args.isElectron ? config_1.ELECTRON_TONHTTPAPI_MAINNET_API_KEY : config_1.TONHTTPAPI_MAINNET_API_KEY, tonhttpapiTestnetKey: args.isElectron ? config_1.ELECTRON_TONHTTPAPI_TESTNET_API_KEY : config_1.TONHTTPAPI_TESTNET_API_KEY });
    return environment;
}
exports.setEnvironment = setEnvironment;
function getEnvironment() {
    return environment;
}
exports.getEnvironment = getEnvironment;
