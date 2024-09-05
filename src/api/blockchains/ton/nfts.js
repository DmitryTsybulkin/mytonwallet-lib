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
exports.getNftUpdates = exports.buildNft = exports.getAccountNfts = void 0;
var account_1 = require("../../../util/account");
var iteratees_1 = require("../../../util/iteratees");
var tonapiio_1 = require("./util/tonapiio");
var tonCore_1 = require("./util/tonCore");
var accounts_1 = require("../../common/accounts");
var wallet_1 = require("./wallet");
function getAccountNfts(accountId, offset, limit) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, rawNfts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _a.sent();
                    return [4 /*yield*/, (0, tonapiio_1.fetchAccountNfts)(network, address, { offset: offset, limit: limit })];
                case 2:
                    rawNfts = _a.sent();
                    return [2 /*return*/, (0, iteratees_1.compact)(rawNfts.map(function (rawNft) { return buildNft(network, rawNft); }))];
            }
        });
    });
}
exports.getAccountNfts = getAccountNfts;
function buildNft(network, rawNft) {
    if (!rawNft.metadata) {
        return undefined;
    }
    try {
        var address = rawNft.address, index = rawNft.index, collection = rawNft.collection, _a = rawNft.metadata, name_1 = _a.name, image = _a.image, description = _a.description, renderType = _a.render_type, previews = rawNft.previews, sale = rawNft.sale;
        var isHidden = renderType === 'hidden' || description === 'SCAM';
        return __assign({ index: index, name: name_1, address: (0, tonCore_1.toBase64Address)(address, true, network), image: image, thumbnail: previews.find(function (x) { return x.resolution === '500x500'; }).url, isOnSale: Boolean(sale), isHidden: isHidden }, (collection && {
            collectionAddress: (0, tonCore_1.toBase64Address)(collection.address, true, network),
            collectionName: collection.name,
        }));
    }
    catch (err) {
        return undefined;
    }
}
exports.buildNft = buildNft;
function getNftUpdates(accountId, fromSec) {
    return __awaiter(this, void 0, void 0, function () {
        var network, address, events, updates, _i, events_1, event_1, _a, _b, action, to, nftAddress, rawNft, isPurchase, _c, sender, recipient, rawNftAddress, buyer, nft, _d;
        var _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    network = (0, account_1.parseAccountId)(accountId).network;
                    return [4 /*yield*/, (0, accounts_1.fetchStoredAddress)(accountId)];
                case 1:
                    address = _g.sent();
                    return [4 /*yield*/, (0, tonapiio_1.fetchAccountEvents)(network, address, fromSec)];
                case 2:
                    events = _g.sent();
                    fromSec = (_f = (_e = events[0]) === null || _e === void 0 ? void 0 : _e.timestamp) !== null && _f !== void 0 ? _f : fromSec;
                    events.reverse();
                    updates = [];
                    _i = 0, events_1 = events;
                    _g.label = 3;
                case 3:
                    if (!(_i < events_1.length)) return [3 /*break*/, 12];
                    event_1 = events_1[_i];
                    _a = 0, _b = event_1.actions;
                    _g.label = 4;
                case 4:
                    if (!(_a < _b.length)) return [3 /*break*/, 11];
                    action = _b[_a];
                    to = void 0;
                    nftAddress = void 0;
                    rawNft = void 0;
                    isPurchase = !!action.NftPurchase;
                    if (action.NftItemTransfer) {
                        _c = action.NftItemTransfer, sender = _c.sender, recipient = _c.recipient, rawNftAddress = _c.nft;
                        if (!sender || !recipient)
                            return [3 /*break*/, 10];
                        to = (0, tonCore_1.toBase64Address)(recipient.address, undefined, network);
                        nftAddress = (0, tonCore_1.toBase64Address)(rawNftAddress, true, network);
                    }
                    else if (action.NftPurchase) {
                        buyer = action.NftPurchase.buyer;
                        to = (0, tonCore_1.toBase64Address)(buyer.address, undefined, network);
                        rawNft = action.NftPurchase.nft;
                        if (!rawNft) {
                            return [3 /*break*/, 10];
                        }
                        nftAddress = (0, tonCore_1.toBase64Address)(rawNft.address, true, network);
                    }
                    else {
                        return [3 /*break*/, 10];
                    }
                    if (!(to === address)) return [3 /*break*/, 7];
                    if (!!rawNft) return [3 /*break*/, 6];
                    return [4 /*yield*/, (0, tonapiio_1.fetchNftItems)(network, [nftAddress])];
                case 5:
                    rawNft = (_g.sent())[0];
                    _g.label = 6;
                case 6:
                    if (rawNft) {
                        nft = buildNft(network, rawNft);
                        if (nft) {
                            updates.push({
                                type: 'nftReceived',
                                accountId: accountId,
                                nftAddress: nftAddress,
                                nft: nft,
                            });
                        }
                    }
                    return [3 /*break*/, 10];
                case 7:
                    _d = !isPurchase;
                    if (!_d) return [3 /*break*/, 9];
                    return [4 /*yield*/, (0, wallet_1.isActiveSmartContract)(network, to)];
                case 8:
                    _d = (_g.sent());
                    _g.label = 9;
                case 9:
                    if (_d) {
                        updates.push({
                            type: 'nftPutUpForSale',
                            accountId: accountId,
                            nftAddress: nftAddress,
                        });
                    }
                    else {
                        updates.push({
                            type: 'nftSent',
                            accountId: accountId,
                            nftAddress: nftAddress,
                        });
                    }
                    _g.label = 10;
                case 10:
                    _a++;
                    return [3 /*break*/, 4];
                case 11:
                    _i++;
                    return [3 /*break*/, 3];
                case 12: return [2 /*return*/, [fromSec, updates]];
            }
        });
    });
}
exports.getNftUpdates = getNftUpdates;
