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
exports.fetchAddressBook = exports.fetchLatestTxId = exports.fetchTransactions = void 0;
var config_1 = require("../../../../config");
var fetch_1 = require("../../../../util/fetch");
var iteratees_1 = require("../../../../util/iteratees");
var environment_1 = require("../../../environment");
var index_1 = require("./index");
var tonCore_1 = require("./tonCore");
var ADDRESS_BOOK_CHUNK_SIZE = 128;
function fetchTransactions(network, address, limit, toTxId, fromTxId) {
    return __awaiter(this, void 0, void 0, function () {
        var fromLt, toLt, data, rawTransactions, addressBook;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    fromLt = fromTxId ? (0, index_1.parseTxId)(fromTxId).lt.toString() : undefined;
                    toLt = toTxId ? (0, index_1.parseTxId)(toTxId).lt.toString() : undefined;
                    return [4 /*yield*/, callApiV3(network, '/transactions', {
                            account: address,
                            limit: limit,
                            start_lt: fromLt,
                            end_lt: toLt,
                            sort: 'desc',
                        })];
                case 1:
                    data = _b.sent();
                    rawTransactions = data.transactions;
                    addressBook = data.address_book;
                    if (!rawTransactions.length) {
                        return [2 /*return*/, []];
                    }
                    if (limit > 1) {
                        if (fromLt && rawTransactions[rawTransactions.length - 1].lt === fromLt) {
                            rawTransactions.pop();
                        }
                        if (toLt && ((_a = rawTransactions[0]) === null || _a === void 0 ? void 0 : _a.lt) === toLt) {
                            rawTransactions = rawTransactions.slice(1);
                        }
                    }
                    return [2 /*return*/, rawTransactions
                            .map(function (rawTx) { return parseRawTransaction(network, rawTx, addressBook); })
                            .flat()];
            }
        });
    });
}
exports.fetchTransactions = fetchTransactions;
function parseRawTransaction(network, rawTx, addressBook) {
    var now = rawTx.now, lt = rawTx.lt, hash = rawTx.hash, fee = rawTx.total_fees;
    var txId = (0, index_1.stringifyTxId)({ lt: lt, hash: hash });
    var timestamp = now * 1000;
    var isIncoming = !!rawTx.in_msg.source;
    var msgs = isIncoming ? [rawTx.in_msg] : rawTx.out_msgs;
    if (!msgs.length)
        return [];
    return msgs.map(function (msg, i) {
        var source = msg.source, destination = msg.destination, value = msg.value;
        var fromAddress = addressBook[source].user_friendly;
        var toAddress = addressBook[destination].user_friendly;
        var normalizedAddress = (0, tonCore_1.toBase64Address)(isIncoming ? source : destination, true, network);
        return {
            txId: msgs.length > 1 ? "".concat(txId, ":").concat(i + 1) : txId,
            timestamp: timestamp,
            isIncoming: isIncoming,
            fromAddress: fromAddress,
            toAddress: toAddress,
            amount: isIncoming ? BigInt(value) : -BigInt(value),
            slug: config_1.TON_TOKEN_SLUG,
            fee: BigInt(fee),
            normalizedAddress: normalizedAddress,
            extraData: {
                body: getRawBody(msg),
            },
        };
    });
}
function fetchLatestTxId(network, address) {
    return __awaiter(this, void 0, void 0, function () {
        var transactions, _a, lt, hash;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, callApiV3(network, '/transactions', {
                        account: address,
                        limit: 1,
                        sort: 'desc',
                    })];
                case 1:
                    transactions = (_b.sent()).transactions;
                    if (!transactions.length) {
                        return [2 /*return*/, undefined];
                    }
                    _a = transactions[0], lt = _a.lt, hash = _a.hash;
                    return [2 /*return*/, (0, index_1.stringifyTxId)({ lt: lt, hash: hash })];
            }
        });
    });
}
exports.fetchLatestTxId = fetchLatestTxId;
function getRawBody(msg) {
    if (!msg.message_content)
        return undefined;
    return msg.message_content.body;
}
function fetchAddressBook(network, addresses) {
    return __awaiter(this, void 0, void 0, function () {
        var chunks, results;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    chunks = (0, iteratees_1.split)(addresses, ADDRESS_BOOK_CHUNK_SIZE);
                    return [4 /*yield*/, Promise.all(chunks.map(function (chunk) {
                            return callApiV3(network, '/addressBook', {
                                address: chunk,
                            });
                        }))];
                case 1:
                    results = _a.sent();
                    return [2 /*return*/, results.reduce(function (acc, value) {
                            return Object.assign(acc, value);
                        }, {})];
            }
        });
    });
}
exports.fetchAddressBook = fetchAddressBook;
function callApiV3(network, path, data) {
    var _a = (0, environment_1.getEnvironment)(), apiHeaders = _a.apiHeaders, tonhttpapiMainnetKey = _a.tonhttpapiMainnetKey, tonhttpapiTestnetKey = _a.tonhttpapiTestnetKey;
    var baseUrl = network === 'testnet' ? config_1.TONHTTPAPI_V3_TESTNET_API_URL : config_1.TONHTTPAPI_V3_MAINNET_API_URL;
    var apiKey = network === 'testnet' ? tonhttpapiTestnetKey : tonhttpapiMainnetKey;
    return (0, fetch_1.fetchJson)("".concat(baseUrl).concat(path), data, {
        headers: __assign(__assign({}, (apiKey && { 'X-Api-Key': apiKey })), apiHeaders),
    });
}
