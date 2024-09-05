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
exports.normalizeAddress = exports.resolveAddress = void 0;
var core_1 = require("@ton/core");
var dns_1 = require("../../../util/dns");
var dns_2 = require("./util/dns");
var tonCore_1 = require("./util/tonCore");
var TON_DNS_COLLECTION = 'EQC3dNlesgVD8YbAazcauIrXBPfiVhMMr5YYk2in0Mtsz0Bz';
var VIP_DNS_COLLECTION = 'EQBWG4EBbPDv4Xj7xlPwzxd7hSyHMzwwLB5O6rY-0BBeaixS';
function resolveAddress(network, address) {
    return __awaiter(this, void 0, void 0, function () {
        var domain, base, collection, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!dns_1.default.isDnsDomain(address)) {
                        return [2 /*return*/, { address: address }];
                    }
                    domain = address;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    base = void 0;
                    collection = void 0;
                    if (dns_1.default.isVipDnsDomain(domain)) {
                        base = dns_1.default.removeVipZone(domain);
                        collection = VIP_DNS_COLLECTION;
                    }
                    else {
                        base = dns_1.default.removeTonZone(domain);
                        collection = TON_DNS_COLLECTION;
                    }
                    return [4 /*yield*/, (0, dns_2.dnsResolve)((0, tonCore_1.getTonClient)(network), collection, base, dns_2.DnsCategory.Wallet)];
                case 2:
                    result = _a.sent();
                    if (!(result instanceof core_1.Address)) {
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, { address: (0, tonCore_1.toBase64Address)(result, undefined, network), domain: domain }];
                case 3:
                    err_1 = _a.sent();
                    if (err_1.message !== 'http provider parse response error') {
                        throw err_1;
                    }
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.resolveAddress = resolveAddress;
function normalizeAddress(address, network) {
    return (0, tonCore_1.toBase64Address)(address, true, network);
}
exports.normalizeAddress = normalizeAddress;
