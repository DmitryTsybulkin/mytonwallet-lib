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
exports.dnsResolve = exports.DnsCategory = void 0;
var core_1 = require("@ton/core");
var utils_1 = require("../../../common/utils");
var DnsCategory;
(function (DnsCategory) {
    DnsCategory["DnsNextResolver"] = "dns_next_resolver";
    DnsCategory["Wallet"] = "wallet";
    DnsCategory["Site"] = "site";
    DnsCategory["BagId"] = "storage";
})(DnsCategory || (exports.DnsCategory = DnsCategory = {}));
function categoryToBigInt(category) {
    return __awaiter(this, void 0, void 0, function () {
        var categoryBytes, categoryHashHex, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!category)
                        return [2 /*return*/, 0n]; // all categories
                    categoryBytes = new TextEncoder().encode(category);
                    _b = (_a = Buffer).from;
                    return [4 /*yield*/, (0, utils_1.sha256)(categoryBytes)];
                case 1:
                    categoryHashHex = _b.apply(_a, [_c.sent()]).toString('hex');
                    return [2 /*return*/, BigInt("0x".concat(categoryHashHex))];
            }
        });
    });
}
function parseSmartContractAddressImpl(cell, prefix0, prefix1) {
    var slice = cell.asSlice();
    var byte0 = slice.loadUint(8);
    var byte1 = slice.loadUint(8);
    if (byte0 !== prefix0 || byte1 !== prefix1) {
        throw new Error('Invalid dns record value prefix');
    }
    return parseAddress(slice);
}
function parseSmartContractAddressRecord(cell) {
    return parseSmartContractAddressImpl(cell, 0x9f, 0xd3);
}
function parseNextResolverRecord(cell) {
    return parseSmartContractAddressImpl(cell, 0xba, 0x93);
}
function parseStorageBagIdRecord(cell) {
    var slice = cell.asSlice();
    var byte0 = slice.loadUint(8);
    var byte1 = slice.loadUint(8);
    if (byte0 !== 0x74 || byte1 !== 0x73) {
        throw new Error('Invalid dns record value prefix');
    }
    var buffer = slice.loadBuffer(4);
    return buffer.toString('hex');
}
function parseSiteRecord(cell) {
    var slice = cell.asSlice();
    var byte0 = slice.loadUint(8);
    var byte1 = slice.loadUint(8);
    if (byte0 === 0xad || byte1 === 0x01) {
        return parseAdnlAddressRecord(cell);
    }
    else {
        return parseStorageBagIdRecord(cell);
    }
}
function parseAdnlAddressRecord(cell) {
    var slice = cell.asSlice();
    var byte0 = slice.loadUint(8);
    var byte1 = slice.loadUint(8);
    if (byte0 !== 0xad || byte1 !== 0x01) {
        throw new Error('Invalid dns record value prefix');
    }
    var buffer = slice.loadBuffer(4);
    return buffer.toString('hex');
}
function dnsResolveImpl(client, dnsAddress, rawDomainBytes, category, oneStep) {
    return __awaiter(this, void 0, void 0, function () {
        var len, domainCell, categoryBN, stack, resultLen, cell, nextAddress;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    len = rawDomainBytes.length * 8;
                    domainCell = new core_1.Builder()
                        .storeBuffer(Buffer.from(rawDomainBytes))
                        .asCell();
                    return [4 /*yield*/, categoryToBigInt(category)];
                case 1:
                    categoryBN = _a.sent();
                    return [4 /*yield*/, client.callGetMethod(core_1.Address.parse(dnsAddress), 'dnsresolve', [
                            { type: 'slice', cell: domainCell },
                            { type: 'int', value: BigInt(categoryBN.toString()) },
                        ])];
                case 2:
                    stack = (_a.sent()).stack;
                    resultLen = stack.readNumber();
                    try {
                        cell = stack.readCell();
                    }
                    catch (err) {
                        // Do nothing
                    }
                    if (resultLen === 0) {
                        return [2 /*return*/, undefined]; // domain cannot be resolved
                    }
                    if (resultLen % 8 !== 0) {
                        throw new Error('domain split not at a component boundary');
                    }
                    // if (rawDomainBytes[resultLen] !== 0) {
                    //     throw new Error('domain split not at a component boundary');
                    // }
                    if (resultLen > len) {
                        throw new Error("invalid response ".concat(resultLen, "/").concat(len));
                    }
                    else if (resultLen === len) {
                        if (category === DnsCategory.DnsNextResolver) {
                            return [2 /*return*/, cell ? parseNextResolverRecord(cell) : undefined];
                        }
                        else if (category === DnsCategory.Wallet) {
                            return [2 /*return*/, cell ? parseSmartContractAddressRecord(cell) : undefined];
                        }
                        else if (category === DnsCategory.Site) {
                            return [2 /*return*/, cell ? parseSiteRecord(cell) : undefined];
                        }
                        else if (category === DnsCategory.BagId) {
                            return [2 /*return*/, cell ? parseStorageBagIdRecord(cell) : undefined];
                        }
                        else {
                            return [2 /*return*/, cell];
                        }
                    }
                    else if (!cell) {
                        return [2 /*return*/, undefined]; // domain cannot be resolved
                    }
                    else {
                        nextAddress = parseNextResolverRecord(cell);
                        if (oneStep) {
                            if (category === DnsCategory.DnsNextResolver) {
                                return [2 /*return*/, nextAddress];
                            }
                            else {
                                return [2 /*return*/, undefined];
                            }
                        }
                        else {
                            return [2 /*return*/, dnsResolveImpl(client, nextAddress.toString(), rawDomainBytes.slice(resultLen / 8), category, false)];
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function domainToBytes(domain) {
    if (!domain || !domain.length) {
        throw new Error('empty domain');
    }
    if (domain === '.') {
        return new Uint8Array([0]);
    }
    domain = domain.toLowerCase();
    for (var i = 0; i < domain.length; i++) {
        if (domain.charCodeAt(i) <= 32) {
            throw new Error('bytes in range 0..32 are not allowed in domain names');
        }
    }
    for (var i = 0; i < domain.length; i++) {
        var s = domain.substring(i, i + 1);
        for (var c = 127; c <= 159; c++) { // another control codes range
            if (s === String.fromCharCode(c)) {
                throw new Error('bytes in range 127..159 are not allowed in domain names');
            }
        }
    }
    var arr = domain.split('.');
    arr.forEach(function (part) {
        if (!part.length) {
            throw new Error('domain name cannot have an empty component');
        }
    });
    var rawDomain = "".concat(arr.reverse().join('\0'), "\0");
    if (rawDomain.length < 126) {
        rawDomain = "\0".concat(rawDomain);
    }
    return new TextEncoder().encode(rawDomain);
}
function dnsResolve(client, rootDnsAddress, domain, category, oneStep) {
    var rawDomainBytes = domainToBytes(domain);
    return dnsResolveImpl(client, rootDnsAddress, rawDomainBytes, category, oneStep);
}
exports.dnsResolve = dnsResolve;
function parseAddress(slice) {
    slice.loadUint(3);
    var n = slice.loadUintBig(8);
    if (n > 127n) { // Maybe it's not necessary?
        n -= 256n;
    }
    var hashPart = slice.loadUintBig(256);
    if ("".concat(n.toString(10), ":").concat(hashPart.toString(16)) === '0:0') {
        return undefined;
    }
    var s = "".concat(n.toString(10), ":").concat(hashPart.toString(16).padStart(64, '0'));
    return core_1.Address.parse(s);
}
