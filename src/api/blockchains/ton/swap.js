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
exports.validateDexSwapTransfers = void 0;
var config_1 = require("../../../config");
var assert_1 = require("../../../util/assert");
var decimals_1 = require("../../../util/decimals");
var metadata_1 = require("./util/metadata");
var tonCore_1 = require("./util/tonCore");
var tokens_1 = require("./tokens");
var wallet_1 = require("./wallet");
var MEGATON_WTON_MINTER = 'EQCajaUU1XXSAjTD-xOV7pE49fGtg4q8kF3ELCOJtGvQFQ2C';
var MAX_NETWORK_FEE = 1000000000n; // 1 TON
function validateDexSwapTransfers(network, address, params, transfers) {
    return __awaiter(this, void 0, void 0, function () {
        var mainTransfer, feeTransfer, maxAmount, _a, isSwapAllowed, codeHash, token, maxAmount, maxTonAmount, walletAddress, parsedPayload, destination, tokenAmount, isSwapAllowed, feePayload, _b, tokenFeeAmount, feeDestination;
        var _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    (0, assert_1.assert)(transfers.length <= 2);
                    mainTransfer = transfers[0], feeTransfer = transfers[1];
                    if (!(params.from === config_1.TON_SYMBOL)) return [3 /*break*/, 2];
                    maxAmount = (0, decimals_1.fromDecimal)(params.fromAmount) + MAX_NETWORK_FEE;
                    return [4 /*yield*/, (0, wallet_1.getContractInfo)(network, mainTransfer.toAddress)];
                case 1:
                    _a = _d.sent(), isSwapAllowed = _a.isSwapAllowed, codeHash = _a.codeHash;
                    (0, assert_1.assert)(!!isSwapAllowed, "Not allowed swap contract: ".concat(codeHash, " ").concat(mainTransfer.toAddress));
                    (0, assert_1.assert)(mainTransfer.amount <= maxAmount);
                    if (feeTransfer) {
                        (0, assert_1.assert)(feeTransfer.amount <= mainTransfer.amount);
                        (0, assert_1.assert)(feeTransfer.amount + mainTransfer.amount < maxAmount);
                        (0, assert_1.assert)((0, tonCore_1.toBase64Address)(feeTransfer.toAddress, false) === config_1.SWAP_FEE_ADDRESS);
                    }
                    return [3 /*break*/, 7];
                case 2:
                    token = (0, tokens_1.findTokenByMinter)(params.from);
                    (0, assert_1.assert)(!!token);
                    maxAmount = (0, decimals_1.fromDecimal)(params.fromAmount, token.decimals);
                    maxTonAmount = MAX_NETWORK_FEE;
                    return [4 /*yield*/, (0, tonCore_1.resolveTokenWalletAddress)(network, address, token.minterAddress)];
                case 3:
                    walletAddress = _d.sent();
                    return [4 /*yield*/, (0, metadata_1.parsePayloadBase64)(network, mainTransfer.toAddress, mainTransfer.payload)];
                case 4:
                    parsedPayload = _d.sent();
                    destination = void 0;
                    tokenAmount = 0n;
                    if (mainTransfer.toAddress === MEGATON_WTON_MINTER) {
                        destination = mainTransfer.toAddress;
                        (0, assert_1.assert)(mainTransfer.toAddress === token.minterAddress);
                    }
                    else {
                        (0, assert_1.assert)(mainTransfer.toAddress === walletAddress);
                        (0, assert_1.assert)(['tokens:transfer', 'tokens:transfer-non-standard'].includes(parsedPayload.type));
                        (_c = parsedPayload, tokenAmount = _c.amount, destination = _c.destination);
                        (0, assert_1.assert)(tokenAmount <= maxAmount);
                    }
                    (0, assert_1.assert)(mainTransfer.amount < maxTonAmount);
                    return [4 /*yield*/, (0, wallet_1.getContractInfo)(network, destination)];
                case 5:
                    isSwapAllowed = (_d.sent()).isSwapAllowed;
                    (0, assert_1.assert)(!!isSwapAllowed);
                    if (!feeTransfer) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, metadata_1.parsePayloadBase64)(network, feeTransfer.toAddress, feeTransfer.payload)];
                case 6:
                    feePayload = _d.sent();
                    (0, assert_1.assert)(feeTransfer.amount + mainTransfer.amount < maxTonAmount);
                    (0, assert_1.assert)(feeTransfer.toAddress === walletAddress);
                    (0, assert_1.assert)(['tokens:transfer', 'tokens:transfer-non-standard'].includes(feePayload.type));
                    _b = feePayload, tokenFeeAmount = _b.amount, feeDestination = _b.destination;
                    (0, assert_1.assert)(tokenFeeAmount < tokenAmount);
                    (0, assert_1.assert)(tokenAmount + tokenFeeAmount <= maxAmount);
                    (0, assert_1.assert)((0, tonCore_1.toBase64Address)(feeDestination, false) === config_1.SWAP_FEE_ADDRESS);
                    _d.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.validateDexSwapTransfers = validateDexSwapTransfers;
