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
exports.fetchToken = exports.addKnownTokens = exports.getKnownTokens = exports.getTokenWallet = exports.findTokenByMinter = exports.resolveTokenBySlug = exports.buildTokenTransfer = exports.parseTokenTransaction = exports.getAddressTokenBalances = exports.getAccountTokenBalances = void 0;
var core_1 = require("@ton/core");
var config_1 = require("../../../config");
var account_1 = require("../../../util/account");
var logs_1 = require("../../../util/logs");
var metadata_1 = require("../../../util/metadata");
var util_1 = require("./util");
var metadata_2 = require("./util/metadata");
var tonapiio_1 = require("./util/tonapiio");
var tonCore_1 = require("./util/tonCore");
var JettonWallet_1 = require("./contracts/JettonWallet");
var accounts_1 = require("../../common/accounts");
var constants_1 = require("./constants");
var KNOWN_TOKENS = [
    {
        slug: config_1.TON_TOKEN_SLUG,
        name: 'Toncoin',
        cmcSlug: config_1.TON_TOKEN_SLUG,
        symbol: config_1.TON_SYMBOL,
        decimals: config_1.DEFAULT_DECIMAL_PLACES,
    },
];
var knownTokens = {};
addKnownTokens(KNOWN_TOKENS);
function getAccountTokenBalances(accountId) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, balancesRaw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [4 /*yield*/, (0, tonapiio_1.fetchJettonBalances)(network, address)];
                case 2:
                    balancesRaw = _a.sent();
                    return [2 /*return*/, balancesRaw.map(function (balance) { return parseTokenBalance(network, balance); }).filter(Boolean)];
            }
        });
    });
}
exports.getAccountTokenBalances = getAccountTokenBalances;
function getAddressTokenBalances(address, network) {
    return __awaiter(this, void 0, void 0, function () {
        var balancesRaw;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, tonapiio_1.fetchJettonBalances)(network, address)];
                case 1:
                    balancesRaw = _a.sent();
                    return [2 /*return*/, balancesRaw.map(function (balance) { return parseTokenBalance(network, balance); }).filter(Boolean)];
            }
        });
    });
}
exports.getAddressTokenBalances = getAddressTokenBalances;
function parseTokenBalance(network, balanceRaw) {
    if (!balanceRaw.jetton) {
        return undefined;
    }
    try {
        var balance = balanceRaw.balance, jetton = balanceRaw.jetton, walletAddress = balanceRaw.wallet_address;
        var minterAddress = (0, tonCore_1.toBase64Address)(jetton.address, true, network);
        var token = buildTokenByMetadata(minterAddress, jetton);
        return {
            slug: token.slug,
            balance: BigInt(balance),
            token: token,
            jettonWallet: (0, tonCore_1.toBase64Address)(walletAddress.address, undefined, network),
        };
    }
    catch (err) {
        (0, logs_1.logDebugError)('parseTokenBalance', err);
        return undefined;
    }
}
function parseTokenTransaction(network, tx, slug, walletAddress) {
    var extraData = tx.extraData;
    if (!(extraData === null || extraData === void 0 ? void 0 : extraData.body)) {
        return undefined;
    }
    var parsedData = (0, metadata_2.parseJettonWalletMsgBody)(network, extraData.body);
    if (!parsedData) {
        return undefined;
    }
    var operation = parsedData.operation, jettonAmount = parsedData.jettonAmount, address = parsedData.address, comment = parsedData.comment, encryptedComment = parsedData.encryptedComment;
    var isIncoming = operation === 'InternalTransfer';
    return __assign(__assign({}, tx), { slug: slug, fromAddress: isIncoming ? (address !== null && address !== void 0 ? address : tx.fromAddress) : walletAddress, toAddress: isIncoming ? walletAddress : address, amount: isIncoming ? jettonAmount : -jettonAmount, comment: comment, encryptedComment: encryptedComment, isIncoming: isIncoming });
}
exports.parseTokenTransaction = parseTokenTransaction;
function buildTokenTransfer(network, slug, fromAddress, toAddress, amount, payload) {
    return __awaiter(this, void 0, void 0, function () {
        var minterAddress, tokenWalletAddress, realMinterAddress, tokenWallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    minterAddress = resolveTokenBySlug(slug).minterAddress;
                    return [4 /*yield*/, (0, tonCore_1.resolveTokenWalletAddress)(network, fromAddress, minterAddress)];
                case 1:
                    tokenWalletAddress = _a.sent();
                    return [4 /*yield*/, (0, tonCore_1.resolveTokenMinterAddress)(network, tokenWalletAddress)];
                case 2:
                    realMinterAddress = _a.sent();
                    if (minterAddress !== realMinterAddress) {
                        throw new Error('Invalid contract');
                    }
                    tokenWallet = getTokenWallet(network, tokenWalletAddress);
                    payload = (0, tonCore_1.buildTokenTransferBody)({
                        tokenAmount: amount,
                        toAddress: toAddress,
                        forwardAmount: constants_1.TOKEN_TRANSFER_TON_FORWARD_AMOUNT,
                        forwardPayload: payload,
                        responseAddress: fromAddress,
                    });
                    return [2 /*return*/, {
                            tokenWallet: tokenWallet,
                            amount: constants_1.TOKEN_TRANSFER_TON_AMOUNT,
                            toAddress: tokenWalletAddress,
                            payload: payload,
                        }];
            }
        });
    });
}
exports.buildTokenTransfer = buildTokenTransfer;
function resolveTokenBySlug(slug) {
    return knownTokens[slug];
}
exports.resolveTokenBySlug = resolveTokenBySlug;
function findTokenByMinter(minter) {
    return Object.values(knownTokens).find(function (token) { return token.minterAddress === minter; });
}
exports.findTokenByMinter = findTokenByMinter;
function getTokenWallet(network, tokenAddress) {
    return (0, tonCore_1.getTonClient)(network).open(new JettonWallet_1.JettonWallet(core_1.Address.parse(tokenAddress)));
}
exports.getTokenWallet = getTokenWallet;
function getKnownTokens() {
    return knownTokens;
}
exports.getKnownTokens = getKnownTokens;
function addKnownTokens(tokens) {
    for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
        var token = tokens_1[_i];
        if (token.slug in knownTokens)
            continue;
        knownTokens[token.slug] = __assign(__assign({}, token), { quote: {
                slug: token.slug,
                price: 0,
                priceUsd: 0,
                percentChange24h: 0,
            } });
    }
}
exports.addKnownTokens = addKnownTokens;
function fetchToken(network, address) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, metadata_2.fetchJettonMetadata)(network, address)];
                case 1:
                    metadata = _a.sent();
                    return [2 /*return*/, buildTokenByMetadata(address, metadata)];
            }
        });
    });
}
exports.fetchToken = fetchToken;
function buildTokenByMetadata(address, metadata) {
    var name = metadata.name, symbol = metadata.symbol, image = metadata.image, imageData = metadata.image_data, decimals = metadata.decimals;
    return {
        slug: (0, util_1.buildTokenSlug)(address),
        name: name,
        symbol: symbol,
        decimals: decimals === undefined ? constants_1.DEFAULT_DECIMALS : Number(decimals),
        minterAddress: address,
        image: (image && (0, metadata_1.fixIpfsUrl)(image)) || (imageData && (0, metadata_2.fixBase64ImageData)(imageData)) || undefined,
    };
}
