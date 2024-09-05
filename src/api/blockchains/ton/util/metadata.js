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
exports.readSnakeBytes = exports.parsePayloadSlice = exports.parsePayloadBase64 = exports.parseWalletTransactionBody = exports.fetchJettonOffchainMetadata = exports.parseJettonOnchainMetadata = exports.fetchJettonMetadata = exports.fixBase64ImageData = exports.parseJettonWalletMsgBody = void 0;
var BitReader_1 = require("@ton/core/dist/boc/BitReader");
var BitString_1 = require("@ton/core/dist/boc/BitString");
var Builder_1 = require("@ton/core/dist/boc/Builder");
var Cell_1 = require("@ton/core/dist/boc/Cell");
var Slice_1 = require("@ton/core/dist/boc/Slice");
var Dictionary_1 = require("@ton/core/dist/dict/Dictionary");
var config_1 = require("../../../../config");
var iteratees_1 = require("../../../../util/iteratees");
var logs_1 = require("../../../../util/logs");
var metadata_1 = require("../../../../util/metadata");
var utils_1 = require("../../../common/utils");
var constants_1 = require("../constants");
var index_1 = require("./index");
var tonapiio_1 = require("./tonapiio");
var tonCore_1 = require("./tonCore");
var OFFCHAIN_CONTENT_PREFIX = 0x01;
var SNAKE_PREFIX = 0x00;
function parseJettonWalletMsgBody(network, body) {
    if (!body)
        return undefined;
    try {
        var slice = Cell_1.Cell.fromBase64(body).beginParse();
        var opCode = slice.loadUint(32);
        var queryId = slice.loadUint(64);
        if (opCode !== constants_1.JettonOpCode.Transfer && opCode !== constants_1.JettonOpCode.InternalTransfer) {
            return undefined;
        }
        var jettonAmount = slice.loadCoins();
        var address = slice.loadMaybeAddress();
        var responseAddress = slice.loadMaybeAddress();
        var forwardAmount = void 0;
        var comment = void 0;
        var encryptedComment = void 0;
        if (responseAddress) {
            if (opCode === constants_1.JettonOpCode.Transfer) {
                slice.loadBit();
            }
            forwardAmount = slice.loadCoins();
            var isSeparateCell = slice.remainingBits && slice.loadBit();
            if (isSeparateCell && slice.remainingRefs) {
                slice = slice.loadRef().beginParse();
            }
            if (slice.remainingBits > 32) {
                var forwardOpCode = slice.loadUint(32);
                if (forwardOpCode === constants_1.OpCode.Comment) {
                    var buffer = readSnakeBytes(slice);
                    comment = buffer.toString('utf-8');
                }
                else if (forwardOpCode === constants_1.OpCode.Encrypted) {
                    var buffer = readSnakeBytes(slice);
                    encryptedComment = buffer.toString('base64');
                }
            }
        }
        return {
            operation: constants_1.JettonOpCode[opCode],
            queryId: queryId,
            jettonAmount: jettonAmount,
            responseAddress: responseAddress,
            address: address ? (0, tonCore_1.toBase64Address)(address, undefined, network) : undefined,
            forwardAmount: forwardAmount,
            comment: comment,
            encryptedComment: encryptedComment,
        };
    }
    catch (err) {
        (0, logs_1.logDebugError)('parseJettonWalletMsgBody', err);
    }
    return undefined;
}
exports.parseJettonWalletMsgBody = parseJettonWalletMsgBody;
function fixBase64ImageData(data) {
    var decodedData = (0, utils_1.base64ToString)(data);
    if (decodedData.includes('<svg')) {
        return "data:image/svg+xml;base64,".concat(data);
    }
    return "data:image/png;base64,".concat(data);
}
exports.fixBase64ImageData = fixBase64ImageData;
var dictSnakeBufferValue = {
    parse: function (slice) {
        var buffer = Buffer.from('');
        var sliceToVal = function (s, v, isFirst) {
            if (isFirst && s.loadUint(8) !== SNAKE_PREFIX) {
                throw new Error('Only snake format is supported');
            }
            v = Buffer.concat([v, s.loadBuffer(s.remainingBits / 8)]);
            if (s.remainingRefs === 1) {
                v = sliceToVal(s.loadRef().beginParse(), v, false);
            }
            return v;
        };
        return sliceToVal(slice.loadRef().beginParse(), buffer, true);
    },
    serialize: function () {
        // pass
    },
};
var jettonOnChainMetadataSpec = {
    uri: 'ascii',
    name: 'utf8',
    description: 'utf8',
    image: 'ascii',
    symbol: 'utf8',
    decimals: 'utf8',
};
function fetchJettonMetadata(network, address) {
    return __awaiter(this, void 0, void 0, function () {
        var content, metadata, slice, prefix, bytes, contentUri, offchainMetadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, tonCore_1.getJettonMinterData)(network, address)];
                case 1:
                    content = (_a.sent()).content;
                    slice = content.asSlice();
                    prefix = slice.loadUint(8);
                    if (!(prefix === OFFCHAIN_CONTENT_PREFIX)) return [3 /*break*/, 3];
                    bytes = readSnakeBytes(slice);
                    contentUri = bytes.toString('utf-8');
                    return [4 /*yield*/, fetchJettonOffchainMetadata(contentUri)];
                case 2:
                    metadata = _a.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, parseJettonOnchainMetadata(slice)];
                case 4:
                    // On-chain content
                    metadata = _a.sent();
                    if (!metadata.uri) return [3 /*break*/, 6];
                    return [4 /*yield*/, fetchJettonOffchainMetadata(metadata.uri)];
                case 5:
                    offchainMetadata = _a.sent();
                    metadata = __assign(__assign({}, offchainMetadata), metadata);
                    _a.label = 6;
                case 6: return [2 /*return*/, metadata];
            }
        });
    });
}
exports.fetchJettonMetadata = fetchJettonMetadata;
function parseJettonOnchainMetadata(slice) {
    return __awaiter(this, void 0, void 0, function () {
        var dict, res, _i, _a, _b, key, value, sha256Key, _c, _d, val;
        var _e;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    dict = slice.loadDict(Dictionary_1.Dictionary.Keys.Buffer(32), dictSnakeBufferValue);
                    res = {};
                    _i = 0, _a = Object.entries(jettonOnChainMetadataSpec);
                    _f.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    _b = _a[_i], key = _b[0], value = _b[1];
                    _d = (_c = Buffer).from;
                    return [4 /*yield*/, (0, utils_1.sha256)(Buffer.from(key, 'ascii'))];
                case 2:
                    sha256Key = _d.apply(_c, [_f.sent()]);
                    val = (_e = dict.get(sha256Key)) === null || _e === void 0 ? void 0 : _e.toString(value);
                    if (val) {
                        res[key] = val;
                    }
                    _f.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, res];
            }
        });
    });
}
exports.parseJettonOnchainMetadata = parseJettonOnchainMetadata;
function fetchJettonOffchainMetadata(uri) {
    return __awaiter(this, void 0, void 0, function () {
        var metadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, metadata_1.fetchJsonMetadata)(uri)];
                case 1:
                    metadata = _a.sent();
                    return [2 /*return*/, (0, iteratees_1.pick)(metadata, ['name', 'description', 'symbol', 'decimals', 'image', 'image_data'])];
            }
        });
    });
}
exports.fetchJettonOffchainMetadata = fetchJettonOffchainMetadata;
function parseWalletTransactionBody(network, transaction) {
    return __awaiter(this, void 0, void 0, function () {
        var body, slice, parsedPayload, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    body = (_a = transaction.extraData) === null || _a === void 0 ? void 0 : _a.body;
                    if (!body || transaction.comment || transaction.encryptedComment) {
                        return [2 /*return*/, transaction];
                    }
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    slice = dataToSlice(body);
                    if (!(slice.remainingBits > 32)) return [3 /*break*/, 3];
                    return [4 /*yield*/, parsePayloadSlice(network, transaction.toAddress, slice)];
                case 2:
                    parsedPayload = _b.sent();
                    transaction.extraData.parsedPayload = parsedPayload;
                    if ((parsedPayload === null || parsedPayload === void 0 ? void 0 : parsedPayload.type) === 'comment') {
                        transaction = __assign(__assign({}, transaction), { comment: parsedPayload.comment });
                    }
                    else if ((parsedPayload === null || parsedPayload === void 0 ? void 0 : parsedPayload.type) === 'encrypted-comment') {
                        transaction = __assign(__assign({}, transaction), { encryptedComment: parsedPayload.encryptedComment });
                    }
                    _b.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _b.sent();
                    (0, logs_1.logDebugError)('parseTransactionBody', err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, transaction];
            }
        });
    });
}
exports.parseWalletTransactionBody = parseWalletTransactionBody;
function parsePayloadBase64(network, toAddress, base64) {
    return __awaiter(this, void 0, void 0, function () {
        var slice, result;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    slice = dataToSlice(base64);
                    result = { type: 'unknown', base64: base64 };
                    if (!slice)
                        return [2 /*return*/, result];
                    return [4 /*yield*/, parsePayloadSlice(network, toAddress, slice)];
                case 1: return [2 /*return*/, (_a = _b.sent()) !== null && _a !== void 0 ? _a : result];
            }
        });
    });
}
exports.parsePayloadBase64 = parsePayloadBase64;
function parsePayloadSlice(network, toAddress, slice) {
    return __awaiter(this, void 0, void 0, function () {
        var opCode, buffer, comment, buffer, encryptedComment, queryId, _a, minterAddress, slug, amount, destination, responseDestination, customPayload, forwardAmount, forwardPayload, builder_1, newOwner, responseDestination, customPayload, forwardAmount, forwardPayload, builder_2, nftAddress, nft, minterAddress, slug, amount, address, customPayload, isLiquidUnstakeRequest, err_2;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 11, , 12]);
                    opCode = slice.loadUint(32);
                    if (opCode === constants_1.OpCode.Comment) {
                        buffer = readSnakeBytes(slice);
                        comment = buffer.toString('utf-8');
                        return [2 /*return*/, { type: 'comment', comment: comment }];
                    }
                    else if (opCode === constants_1.OpCode.Encrypted) {
                        buffer = readSnakeBytes(slice);
                        encryptedComment = buffer.toString('base64');
                        return [2 /*return*/, { type: 'encrypted-comment', encryptedComment: encryptedComment }];
                    }
                    else if (slice.remainingBits < 64) {
                        return [2 /*return*/, undefined];
                    }
                    queryId = slice.loadUintBig(64);
                    _a = opCode;
                    switch (_a) {
                        case constants_1.JettonOpCode.Transfer: return [3 /*break*/, 1];
                        case constants_1.NftOpCode.TransferOwnership: return [3 /*break*/, 3];
                        case constants_1.JettonOpCode.Burn: return [3 /*break*/, 5];
                        case constants_1.LiquidStakingOpCode.DistributedAsset: return [3 /*break*/, 7];
                        case constants_1.LiquidStakingOpCode.Withdrawal: return [3 /*break*/, 8];
                        case constants_1.LiquidStakingOpCode.Deposit: return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 10];
                case 1: return [4 /*yield*/, (0, tonCore_1.resolveTokenMinterAddress)(network, toAddress)];
                case 2:
                    minterAddress = _c.sent();
                    slug = (0, index_1.buildTokenSlug)(minterAddress);
                    amount = slice.loadCoins();
                    destination = slice.loadAddress();
                    responseDestination = slice.loadMaybeAddress();
                    if (!responseDestination) {
                        return [2 /*return*/, {
                                type: 'tokens:transfer-non-standard',
                                queryId: queryId,
                                destination: (0, tonCore_1.toBase64Address)(destination, undefined, network),
                                amount: amount,
                                slug: slug,
                            }];
                    }
                    customPayload = slice.loadMaybeRef();
                    forwardAmount = slice.loadCoins();
                    forwardPayload = slice.loadMaybeRef();
                    if (!forwardPayload && slice.remainingBits) {
                        builder_1 = new Builder_1.Builder().storeBits(slice.loadBits(slice.remainingBits));
                        (0, iteratees_1.range)(0, slice.remainingRefs).forEach(function () {
                            builder_1.storeRef(slice.loadRef());
                        });
                        forwardPayload = builder_1.endCell();
                    }
                    return [2 /*return*/, {
                            type: 'tokens:transfer',
                            queryId: queryId,
                            amount: amount,
                            destination: (0, tonCore_1.toBase64Address)(destination, undefined, network),
                            responseDestination: (0, tonCore_1.toBase64Address)(responseDestination, undefined, network),
                            customPayload: customPayload === null || customPayload === void 0 ? void 0 : customPayload.toBoc().toString('base64'),
                            forwardAmount: forwardAmount,
                            forwardPayload: forwardPayload === null || forwardPayload === void 0 ? void 0 : forwardPayload.toBoc().toString('base64'),
                            slug: slug,
                        }];
                case 3:
                    newOwner = slice.loadAddress();
                    responseDestination = slice.loadAddress();
                    customPayload = slice.loadMaybeRef();
                    forwardAmount = slice.loadCoins();
                    forwardPayload = slice.loadMaybeRef();
                    if (!forwardPayload && slice.remainingBits) {
                        builder_2 = new Builder_1.Builder().storeBits(slice.loadBits(slice.remainingBits));
                        (0, iteratees_1.range)(0, slice.remainingRefs).forEach(function () {
                            builder_2.storeRef(slice.loadRef());
                        });
                        forwardPayload = builder_2.endCell();
                    }
                    nftAddress = toAddress;
                    return [4 /*yield*/, (0, tonapiio_1.fetchNftItems)(network, [nftAddress])];
                case 4:
                    nft = (_c.sent())[0];
                    return [2 /*return*/, {
                            type: 'nft:transfer',
                            queryId: queryId,
                            newOwner: (0, tonCore_1.toBase64Address)(newOwner, undefined, network),
                            responseDestination: (0, tonCore_1.toBase64Address)(responseDestination, undefined, network),
                            customPayload: customPayload === null || customPayload === void 0 ? void 0 : customPayload.toBoc().toString('base64'),
                            forwardAmount: forwardAmount,
                            forwardPayload: forwardPayload === null || forwardPayload === void 0 ? void 0 : forwardPayload.toBoc().toString('base64'),
                            nftAddress: nftAddress,
                            nftName: (_b = nft === null || nft === void 0 ? void 0 : nft.metadata) === null || _b === void 0 ? void 0 : _b.name,
                        }];
                case 5: return [4 /*yield*/, (0, tonCore_1.resolveTokenMinterAddress)(network, toAddress)];
                case 6:
                    minterAddress = _c.sent();
                    slug = (0, index_1.buildTokenSlug)(minterAddress);
                    amount = slice.loadCoins();
                    address = slice.loadAddress();
                    customPayload = slice.loadMaybeRef();
                    isLiquidUnstakeRequest = minterAddress === config_1.LIQUID_JETTON;
                    return [2 /*return*/, {
                            type: 'tokens:burn',
                            queryId: queryId,
                            amount: amount,
                            address: (0, tonCore_1.toBase64Address)(address, undefined, network),
                            customPayload: customPayload === null || customPayload === void 0 ? void 0 : customPayload.toBoc().toString('base64'),
                            slug: slug,
                            isLiquidUnstakeRequest: isLiquidUnstakeRequest,
                        }];
                case 7:
                    {
                        return [2 /*return*/, {
                                type: 'liquid-staking:withdrawal-nft',
                                queryId: queryId,
                            }];
                    }
                    _c.label = 8;
                case 8:
                    {
                        return [2 /*return*/, {
                                type: 'liquid-staking:withdrawal',
                                queryId: queryId,
                            }];
                    }
                    _c.label = 9;
                case 9:
                    {
                        // const amount = slice.loadCoins();
                        return [2 /*return*/, {
                                type: 'liquid-staking:deposit',
                                queryId: queryId,
                            }];
                    }
                    _c.label = 10;
                case 10: return [3 /*break*/, 12];
                case 11:
                    err_2 = _c.sent();
                    (0, logs_1.logDebugError)('parsePayload', err_2);
                    return [3 /*break*/, 12];
                case 12: return [2 /*return*/, undefined];
            }
        });
    });
}
exports.parsePayloadSlice = parsePayloadSlice;
function dataToSlice(data) {
    var buffer;
    if (typeof data === 'string') {
        buffer = Buffer.from(data, 'base64');
    }
    else if (data instanceof Buffer) {
        buffer = data;
    }
    else {
        buffer = Buffer.from(data);
    }
    try {
        return Cell_1.Cell.fromBoc(buffer)[0].beginParse();
    }
    catch (err) {
        if ((err === null || err === void 0 ? void 0 : err.message) !== 'Invalid magic') {
            throw err;
        }
    }
    return new Slice_1.Slice(new BitReader_1.BitReader(new BitString_1.BitString(buffer, 0, buffer.length * 8)), []);
}
function readSnakeBytes(slice) {
    var buffer = Buffer.alloc(0);
    while (slice.remainingBits >= 8) {
        buffer = Buffer.concat([buffer, slice.loadBuffer(slice.remainingBits / 8)]);
        if (slice.remainingRefs) {
            slice = slice.loadRef().beginParse();
        }
        else {
            break;
        }
    }
    return buffer;
}
exports.readSnakeBytes = readSnakeBytes;
