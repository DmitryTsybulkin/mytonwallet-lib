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
exports.getIsRawAddress = exports.parseAddress = exports.getTokenBalance = exports.buildLiquidStakingWithdrawBody = exports.buildLiquidStakingDepositBody = exports.packBytesAsSnake = exports.commentToBytes = exports.parseBase64 = exports.buildTokenTransferBody = exports.toRawAddress = exports.toBase64Address = exports.oneCellFromBoc = exports.getJettonMinterData = exports.getWalletPublicKey = exports.resolveTokenMinterAddress = exports.resolveTokenWalletAddress = exports.getTonWalletContract = exports.getTonClient = exports.walletClassMap = void 0;
var core_1 = require("@ton/core");
var axios_1 = require("axios");
var WalletContractV1R1_1 = require("@ton/ton/dist/wallets/WalletContractV1R1");
var WalletContractV1R2_1 = require("@ton/ton/dist/wallets/WalletContractV1R2");
var WalletContractV1R3_1 = require("@ton/ton/dist/wallets/WalletContractV1R3");
var WalletContractV2R1_1 = require("@ton/ton/dist/wallets/WalletContractV2R1");
var WalletContractV2R2_1 = require("@ton/ton/dist/wallets/WalletContractV2R2");
var WalletContractV3R1_1 = require("@ton/ton/dist/wallets/WalletContractV3R1");
var WalletContractV3R2_1 = require("@ton/ton/dist/wallets/WalletContractV3R2");
var WalletContractV4_1 = require("@ton/ton/dist/wallets/WalletContractV4");
var types_1 = require("../../../types");
var config_1 = require("../../../../config");
var logs_1 = require("../../../../util/logs");
var withCacheAsync_1 = require("../../../../util/withCacheAsync");
var JettonMaster_1 = require("../contracts/JettonMaster");
var JettonWallet_1 = require("../contracts/JettonWallet");
var utils_1 = require("../../../common/utils");
var environment_1 = require("../../../environment");
var constants_1 = require("../constants");
var TonClient_1 = require("./TonClient");
axios_1.default.defaults.adapter = require('../../../../lib/axios-fetch-adapter').default;
var TON_MAX_COMMENT_BYTES = 127;
var clientByNetwork;
exports.walletClassMap = {
    simpleR1: WalletContractV1R1_1.WalletContractV1R1,
    simpleR2: WalletContractV1R2_1.WalletContractV1R2,
    simpleR3: WalletContractV1R3_1.WalletContractV1R3,
    v2R1: WalletContractV2R1_1.WalletContractV2R1,
    v2R2: WalletContractV2R2_1.WalletContractV2R2,
    v3R1: WalletContractV3R1_1.WalletContractV3R1,
    v3R2: WalletContractV3R2_1.WalletContractV3R2,
    v4R2: WalletContractV4_1.WalletContractV4,
};
function getTonClient(network) {
    if (network === void 0) { network = 'mainnet'; }
    if (!clientByNetwork) {
        clientByNetwork = {
            mainnet: new TonClient_1.TonClient({
                endpoint: config_1.TONHTTPAPI_MAINNET_URL,
                timeout: config_1.DEFAULT_TIMEOUT,
                apiKey: config_1.TONHTTPAPI_MAINNET_API_KEY,
                headers: (0, environment_1.getEnvironment)().apiHeaders,
            }),
            testnet: new TonClient_1.TonClient({
                endpoint: config_1.TONHTTPAPI_TESTNET_URL,
                timeout: config_1.DEFAULT_TIMEOUT,
                apiKey: config_1.TONHTTPAPI_TESTNET_API_KEY,
                headers: (0, environment_1.getEnvironment)().apiHeaders,
            }),
        };
    }
    return clientByNetwork[network];
}
exports.getTonClient = getTonClient;
function getTonWalletContract(publicKeyHex, version) {
    var walletClass = exports.walletClassMap[version];
    if (!walletClass) {
        throw new Error('Unsupported wallet contract version');
    }
    var publicKey = Buffer.from((0, utils_1.hexToBytes)(publicKeyHex));
    return walletClass.create({ workchain: types_1.WORKCHAIN, publicKey: publicKey });
}
exports.getTonWalletContract = getTonWalletContract;
exports.resolveTokenWalletAddress = (0, withCacheAsync_1.default)(function (network, address, minterAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var minter, walletAddress;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                minter = getTonClient(network).open(new JettonMaster_1.JettonMinter(core_1.Address.parse(minterAddress)));
                return [4 /*yield*/, minter.getWalletAddress(core_1.Address.parse(address))];
            case 1:
                walletAddress = _a.sent();
                return [2 /*return*/, toBase64Address(walletAddress, true, network)];
        }
    });
}); });
exports.resolveTokenMinterAddress = (0, withCacheAsync_1.default)(function (network, tokenWalletAddress) { return __awaiter(void 0, void 0, void 0, function () {
    var tokenWallet, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokenWallet = getTonClient(network).open(new JettonWallet_1.JettonWallet(core_1.Address.parse(tokenWalletAddress)));
                return [4 /*yield*/, tokenWallet.getWalletData()];
            case 1:
                data = _a.sent();
                return [2 /*return*/, toBase64Address(data.minter, true, network)];
        }
    });
}); });
exports.getWalletPublicKey = (0, withCacheAsync_1.default)(function (network, address) { return __awaiter(void 0, void 0, void 0, function () {
    var res, bigintKey, hex, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, getTonClient(network).callGetMethod(core_1.Address.parse(address), 'get_public_key')];
            case 1:
                res = _a.sent();
                bigintKey = res.stack.readBigNumber();
                hex = bigintKey.toString(16).padStart(64, '0');
                return [2 /*return*/, (0, utils_1.hexToBytes)(hex)];
            case 2:
                err_1 = _a.sent();
                (0, logs_1.logDebugError)('getWalletPublicKey', err_1);
                return [2 /*return*/, undefined];
            case 3: return [2 /*return*/];
        }
    });
}); });
function getJettonMinterData(network, address) {
    var contract = getTonClient(network).open(new JettonMaster_1.JettonMinter(core_1.Address.parse(address)));
    return contract.getJettonData();
}
exports.getJettonMinterData = getJettonMinterData;
function oneCellFromBoc(bytes) {
    return core_1.Cell.fromBoc(Buffer.from(bytes));
}
exports.oneCellFromBoc = oneCellFromBoc;
function toBase64Address(address, isBounceable, network) {
    if (isBounceable === void 0) { isBounceable = constants_1.DEFAULT_IS_BOUNCEABLE; }
    if (typeof address === 'string') {
        address = core_1.Address.parse(address);
    }
    return address.toString({
        urlSafe: true,
        bounceable: isBounceable,
        testOnly: network === 'testnet',
    });
}
exports.toBase64Address = toBase64Address;
function toRawAddress(address) {
    if (typeof address === 'string') {
        address = core_1.Address.parse(address);
    }
    return address.toRawString();
}
exports.toRawAddress = toRawAddress;
function buildTokenTransferBody(params) {
    var queryId = params.queryId, tokenAmount = params.tokenAmount, toAddress = params.toAddress, responseAddress = params.responseAddress, forwardAmount = params.forwardAmount;
    var forwardPayload = params.forwardPayload;
    var builder = new core_1.Builder()
        .storeUint(constants_1.JettonOpCode.Transfer, 32)
        .storeUint(queryId || 0, 64)
        .storeCoins(tokenAmount)
        .storeAddress(core_1.Address.parse(toAddress))
        .storeAddress(core_1.Address.parse(responseAddress))
        .storeBit(false)
        .storeCoins(forwardAmount !== null && forwardAmount !== void 0 ? forwardAmount : 0n);
    if (forwardPayload instanceof Uint8Array) {
        var freeBytes = Math.round(builder.availableBits / 8);
        forwardPayload = packBytesAsSnake(forwardPayload, freeBytes);
    }
    if (!forwardPayload) {
        builder.storeBit(false);
    }
    else if (typeof forwardPayload === 'string') {
        builder = builder.storeBit(false)
            .storeUint(0, 32)
            .storeBuffer(Buffer.from(forwardPayload));
    }
    else if (forwardPayload instanceof Uint8Array) {
        builder = builder.storeBit(false)
            .storeBuffer(Buffer.from(forwardPayload));
    }
    else {
        builder = builder.storeBit(true)
            .storeRef(forwardPayload);
    }
    return builder.endCell();
}
exports.buildTokenTransferBody = buildTokenTransferBody;
function parseBase64(base64) {
    try {
        return core_1.Cell.fromBase64(base64);
    }
    catch (err) {
        (0, logs_1.logDebugError)('parseBase64', err);
        return Uint8Array.from(Buffer.from(base64, 'base64'));
    }
}
exports.parseBase64 = parseBase64;
function commentToBytes(comment) {
    var buffer = Buffer.from(comment);
    var bytes = new Uint8Array(buffer.length + 4);
    var startBuffer = Buffer.alloc(4);
    startBuffer.writeUInt32BE(constants_1.OpCode.Comment);
    bytes.set(startBuffer, 0);
    bytes.set(buffer, 4);
    return bytes;
}
exports.commentToBytes = commentToBytes;
function packBytesAsSnake(bytes, maxBytes) {
    if (maxBytes === void 0) { maxBytes = TON_MAX_COMMENT_BYTES; }
    var buffer = Buffer.from(bytes);
    if (buffer.length <= maxBytes) {
        return bytes;
    }
    var mainBuilder = new core_1.Builder();
    var prevBuilder;
    var currentBuilder = mainBuilder;
    for (var _i = 0, _a = buffer.entries(); _i < _a.length; _i++) {
        var _b = _a[_i], i = _b[0], byte = _b[1];
        if (currentBuilder.availableBits < 8) {
            prevBuilder === null || prevBuilder === void 0 ? void 0 : prevBuilder.storeRef(currentBuilder);
            prevBuilder = currentBuilder;
            currentBuilder = new core_1.Builder();
        }
        currentBuilder = currentBuilder.storeUint(byte, 8);
        if (i === buffer.length - 1) {
            prevBuilder === null || prevBuilder === void 0 ? void 0 : prevBuilder.storeRef(currentBuilder);
        }
    }
    return mainBuilder.asCell();
}
exports.packBytesAsSnake = packBytesAsSnake;
function buildLiquidStakingDepositBody(queryId) {
    return new core_1.Builder()
        .storeUint(constants_1.LiquidStakingOpCode.Deposit, 32)
        .storeUint(queryId || 0, 64)
        .asCell();
}
exports.buildLiquidStakingDepositBody = buildLiquidStakingDepositBody;
function buildLiquidStakingWithdrawBody(options) {
    var queryId = options.queryId, amount = options.amount, responseAddress = options.responseAddress, waitTillRoundEnd = options.waitTillRoundEnd, fillOrKill = options.fillOrKill;
    var customPayload = new core_1.Builder()
        .storeUint(Number(waitTillRoundEnd), 1)
        .storeUint(Number(fillOrKill), 1)
        .asCell();
    return new core_1.Builder()
        .storeUint(constants_1.JettonOpCode.Burn, 32)
        .storeUint(queryId !== null && queryId !== void 0 ? queryId : 0, 64)
        .storeCoins(amount)
        .storeAddress(core_1.Address.parse(responseAddress))
        .storeBit(1)
        .storeRef(customPayload)
        .asCell();
}
exports.buildLiquidStakingWithdrawBody = buildLiquidStakingWithdrawBody;
function getTokenBalance(network, walletAddress) {
    var tokenWallet = getTonClient(network).open(new JettonWallet_1.JettonWallet(core_1.Address.parse(walletAddress)));
    return tokenWallet.getJettonBalance();
}
exports.getTokenBalance = getTokenBalance;
function parseAddress(address) {
    try {
        if (core_1.Address.isRaw(address)) {
            return {
                address: core_1.Address.parseRaw(address),
                isRaw: true,
                isValid: true,
            };
        }
        else if (core_1.Address.isFriendly(address)) {
            return __assign(__assign({}, core_1.Address.parseFriendly(address)), { isUserFriendly: true, isValid: true });
        }
    }
    catch (err) {
        // Do nothing
    }
    return { isValid: false };
}
exports.parseAddress = parseAddress;
function getIsRawAddress(address) {
    return Boolean(parseAddress(address).isRaw);
}
exports.getIsRawAddress = getIsRawAddress;
