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
exports.JettonWallet = exports.jettonWalletConfigToCell = void 0;
var core_1 = require("@ton/core");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function jettonWalletConfigToCell(config) {
    return (0, core_1.beginCell)().endCell();
}
exports.jettonWalletConfigToCell = jettonWalletConfigToCell;
var JettonWallet = /** @class */ (function () {
    function JettonWallet(address, init) {
        this.address = address;
        this.init = init;
    }
    JettonWallet.createFromAddress = function (address) {
        return new JettonWallet(address);
    };
    JettonWallet.createFromConfig = function (config, code, workchain) {
        if (workchain === void 0) { workchain = 0; }
        var data = jettonWalletConfigToCell(config);
        var init = { code: code, data: data };
        return new JettonWallet((0, core_1.contractAddress)(workchain, init), init);
    };
    // eslint-disable-next-line class-methods-use-this
    JettonWallet.prototype.sendDeploy = function (provider, via, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.internal(via, {
                            value: value,
                            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                            body: (0, core_1.beginCell)().endCell(),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // eslint-disable-next-line class-methods-use-this
    JettonWallet.prototype.getJettonBalance = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var state, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.getState()];
                    case 1:
                        state = _a.sent();
                        if (state.state.type !== 'active') {
                            return [2 /*return*/, 0n];
                        }
                        return [4 /*yield*/, provider.get('get_wallet_data', [])];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res.stack.readBigNumber()];
                }
            });
        });
    };
    JettonWallet.transferMessage = function (jetton_amount, to, responseAddress, customPayload, forward_ton_amount, forwardPayload) {
        return (0, core_1.beginCell)().storeUint(0xf8a7ea5, 32).storeUint(0, 64) // op, queryId
            .storeCoins(jetton_amount)
            .storeAddress(to)
            .storeAddress(responseAddress)
            .storeMaybeRef(customPayload)
            .storeCoins(forward_ton_amount)
            .storeMaybeRef(forwardPayload)
            .endCell();
    };
    // eslint-disable-next-line class-methods-use-this
    JettonWallet.prototype.sendTransfer = function (provider, via, value, jetton_amount, to, responseAddress, customPayload, forward_ton_amount, forwardPayload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.internal(via, {
                            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                            body: JettonWallet.transferMessage(jetton_amount, to, responseAddress, customPayload, forward_ton_amount, forwardPayload),
                            value: value,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
      burn#595f07bc query_id:uint64 amount:(VarUInteger 16)
                    response_destination:MsgAddress custom_payload:(Maybe ^Cell)
                    = InternalMsgBody;
    */
    JettonWallet.burnMessage = function (jetton_amount, responseAddress, customPayload) {
        return (0, core_1.beginCell)().storeUint(0x595f07bc, 32).storeUint(0, 64) // op, queryId
            .storeCoins(jetton_amount)
            .storeAddress(responseAddress)
            .storeMaybeRef(customPayload)
            .endCell();
    };
    // eslint-disable-next-line class-methods-use-this
    JettonWallet.prototype.sendBurn = function (provider, via, value, jetton_amount, responseAddress, customPayload) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.internal(via, {
                            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                            body: JettonWallet.burnMessage(jetton_amount, responseAddress, customPayload),
                            value: value,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
      withdraw_tons#107c49ef query_id:uint64 = InternalMsgBody;
    */
    JettonWallet.withdrawTonsMessage = function () {
        return (0, core_1.beginCell)().storeUint(0x6d8e5e3c, 32).storeUint(0, 64) // op, queryId
            .endCell();
    };
    // eslint-disable-next-line class-methods-use-this
    JettonWallet.prototype.sendWithdrawTons = function (provider, via) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.internal(via, {
                            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                            body: JettonWallet.withdrawTonsMessage(),
                            value: (0, core_1.toNano)('0.1'),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
      withdraw_jettons#10 query_id:uint64 wallet:MsgAddressInt amount:Coins = InternalMsgBody;
    */
    JettonWallet.withdrawJettonsMessage = function (from, amount) {
        return (0, core_1.beginCell)().storeUint(0x768a50b2, 32).storeUint(0, 64) // op, queryId
            .storeAddress(from)
            .storeCoins(amount)
            .storeMaybeRef(undefined)
            .endCell();
    };
    // eslint-disable-next-line class-methods-use-this
    JettonWallet.prototype.sendWithdrawJettons = function (provider, via, from, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.internal(via, {
                            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                            body: JettonWallet.withdrawJettonsMessage(from, amount),
                            value: (0, core_1.toNano)('0.1'),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // eslint-disable-next-line class-methods-use-this
    JettonWallet.prototype.getWalletData = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var res, balance, owner, minter, code;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.get('get_wallet_data', [])];
                    case 1:
                        res = _a.sent();
                        balance = res.stack.readBigNumber();
                        owner = res.stack.readAddress();
                        minter = res.stack.readAddress();
                        code = res.stack.readCell();
                        return [2 /*return*/, {
                                balance: balance,
                                owner: owner,
                                minter: minter,
                                code: code,
                            }];
                }
            });
        });
    };
    return JettonWallet;
}());
exports.JettonWallet = JettonWallet;
