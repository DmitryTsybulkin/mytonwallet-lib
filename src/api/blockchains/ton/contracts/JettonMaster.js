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
exports.JettonMinter = exports.jettonContentToCell = exports.jettonMinterConfigToCell = void 0;
var core_1 = require("@ton/core");
var JettonConstants_1 = require("./JettonConstants");
function jettonMinterConfigToCell(config) {
    return (0, core_1.beginCell)()
        .storeCoins(0)
        .storeAddress(config.admin)
        .storeRef(config.content)
        .storeRef(config.wallet_code)
        .endCell();
}
exports.jettonMinterConfigToCell = jettonMinterConfigToCell;
function jettonContentToCell(content) {
    return (0, core_1.beginCell)()
        .storeUint(content.type, 8)
        .storeStringTail(content.uri) // Snake logic under the hood
        .endCell();
}
exports.jettonContentToCell = jettonContentToCell;
var JettonMinter = /** @class */ (function () {
    function JettonMinter(address, init) {
        this.address = address;
        this.init = init;
    }
    JettonMinter.createFromAddress = function (address) {
        return new JettonMinter(address);
    };
    JettonMinter.createFromConfig = function (config, code, workchain) {
        if (workchain === void 0) { workchain = 0; }
        var data = jettonMinterConfigToCell(config);
        var init = { code: code, data: data };
        return new JettonMinter((0, core_1.contractAddress)(workchain, init), init);
    };
    // eslint-disable-next-line class-methods-use-this
    JettonMinter.prototype.sendDeploy = function (provider, via, value) {
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
    JettonMinter.jettonInternalTransfer = function (jetton_amount, forward_ton_amount, response_addr, query_id) {
        if (query_id === void 0) { query_id = 0; }
        return (0, core_1.beginCell)()
            .storeUint(JettonConstants_1.Op.internal_transfer, 32)
            .storeUint(query_id, 64)
            .storeCoins(jetton_amount)
            .storeAddress(undefined)
            .storeAddress(response_addr)
            .storeCoins(forward_ton_amount)
            .storeBit(false)
            .endCell();
    };
    JettonMinter.mintMessage = function (from, to, jetton_amount, forward_ton_amount, total_ton_amount, query_id) {
        if (query_id === void 0) { query_id = 0; }
        var mintMsg = (0, core_1.beginCell)().storeUint(JettonConstants_1.Op.internal_transfer, 32)
            .storeUint(0, 64)
            .storeCoins(jetton_amount)
            .storeAddress(undefined)
            .storeAddress(from) // Response addr
            .storeCoins(forward_ton_amount)
            .storeMaybeRef(undefined)
            .endCell();
        return (0, core_1.beginCell)().storeUint(JettonConstants_1.Op.mint, 32).storeUint(query_id, 64) // op, queryId
            .storeAddress(to)
            .storeCoins(total_ton_amount)
            .storeCoins(jetton_amount)
            .storeRef(mintMsg)
            .endCell();
    };
    JettonMinter.prototype.sendMint = function (provider, via, to, jetton_amount, forward_ton_amount, total_ton_amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (total_ton_amount <= forward_ton_amount) {
                            throw new Error('Total ton amount should be > forward amount');
                        }
                        return [4 /*yield*/, provider.internal(via, {
                                sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                                body: JettonMinter.mintMessage(this.address, to, jetton_amount, forward_ton_amount, total_ton_amount),
                                value: total_ton_amount + (0, core_1.toNano)('0.015'),
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* provide_wallet_address#2c76b973 query_id:uint64 owner_address:MsgAddress include_address:Bool = InternalMsgBody;
    */
    JettonMinter.discoveryMessage = function (owner, include_address) {
        return (0, core_1.beginCell)().storeUint(0x2c76b973, 32).storeUint(0, 64) // op, queryId
            .storeAddress(owner)
            .storeBit(include_address)
            .endCell();
    };
    // eslint-disable-next-line class-methods-use-this
    JettonMinter.prototype.sendDiscovery = function (provider_1, via_1, owner_1, include_address_1) {
        return __awaiter(this, arguments, void 0, function (provider, via, owner, include_address, value) {
            if (value === void 0) { value = (0, core_1.toNano)('0.1'); }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.internal(via, {
                            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                            body: JettonMinter.discoveryMessage(owner, include_address),
                            value: value,
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JettonMinter.changeAdminMessage = function (newOwner) {
        return (0, core_1.beginCell)().storeUint(JettonConstants_1.Op.change_admin, 32).storeUint(0, 64) // op, queryId
            .storeAddress(newOwner)
            .endCell();
    };
    // eslint-disable-next-line class-methods-use-this
    JettonMinter.prototype.sendChangeAdmin = function (provider, via, newOwner) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.internal(via, {
                            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                            body: JettonMinter.changeAdminMessage(newOwner),
                            value: (0, core_1.toNano)('0.05'),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JettonMinter.changeContentMessage = function (content) {
        return (0, core_1.beginCell)().storeUint(JettonConstants_1.Op.change_content, 32).storeUint(0, 64) // op, queryId
            .storeRef(content)
            .endCell();
    };
    // eslint-disable-next-line class-methods-use-this
    JettonMinter.prototype.sendChangeContent = function (provider, via, content) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.internal(via, {
                            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
                            body: JettonMinter.changeContentMessage(content),
                            value: (0, core_1.toNano)('0.05'),
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // eslint-disable-next-line class-methods-use-this
    JettonMinter.prototype.getWalletAddress = function (provider, owner) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.get('get_wallet_address', [{
                                type: 'slice', cell: (0, core_1.beginCell)().storeAddress(owner).endCell(),
                            }])];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.stack.readAddress()];
                }
            });
        });
    };
    // eslint-disable-next-line class-methods-use-this
    JettonMinter.prototype.getJettonData = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var res, totalSupply, mintable, adminAddress, content, walletCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, provider.get('get_jetton_data', [])];
                    case 1:
                        res = _a.sent();
                        totalSupply = res.stack.readBigNumber();
                        mintable = res.stack.readBoolean();
                        adminAddress = res.stack.readAddress();
                        content = res.stack.readCell();
                        walletCode = res.stack.readCell();
                        return [2 /*return*/, {
                                totalSupply: totalSupply,
                                mintable: mintable,
                                adminAddress: adminAddress,
                                content: content,
                                walletCode: walletCode,
                            }];
                }
            });
        });
    };
    JettonMinter.prototype.getTotalSupply = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getJettonData(provider)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.totalSupply];
                }
            });
        });
    };
    JettonMinter.prototype.getAdminAddress = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getJettonData(provider)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.adminAddress];
                }
            });
        });
    };
    JettonMinter.prototype.getContent = function (provider) {
        return __awaiter(this, void 0, void 0, function () {
            var res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getJettonData(provider)];
                    case 1:
                        res = _a.sent();
                        return [2 /*return*/, res.content];
                }
            });
        });
    };
    return JettonMinter;
}());
exports.JettonMinter = JettonMinter;
