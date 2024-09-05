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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.rawSign = exports.fetchKeyPair = exports.fetchPrivateKey = exports.fetchMnemonic = exports.decryptMnemonic = exports.encryptMnemonic = exports.seedToKeyPair = exports.mnemonicToSeed = exports.validateMnemonic = exports.generateMnemonic = void 0;
var tonWebMnemonic = require("tonweb-mnemonic");
var tweetnacl_1 = require("tweetnacl");
var types_1 = require("../../types");
var logs_1 = require("../../../util/logs");
var accounts_1 = require("../../common/accounts");
var utils_1 = require("../../common/utils");
var PBKDF2_IMPORT_KEY_ARGS = [
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey'],
];
var PBKDF2_DERIVE_KEY_ARGS = {
    name: 'PBKDF2',
    iterations: 100000, // Higher is more secure but slower
    hash: 'SHA-256',
};
var PBKDF2_DERIVE_KEY_TYPE = { name: 'AES-GCM', length: 256 };
function generateMnemonic() {
    return tonWebMnemonic.generateMnemonic();
}
exports.generateMnemonic = generateMnemonic;
function validateMnemonic(mnemonic) {
    return tonWebMnemonic.validateMnemonic(mnemonic);
}
exports.validateMnemonic = validateMnemonic;
function mnemonicToSeed(mnemonic) {
    return __awaiter(this, void 0, void 0, function () {
        var keyPair;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, tonWebMnemonic.mnemonicToKeyPair(mnemonic)];
                case 1:
                    keyPair = _a.sent();
                    return [2 /*return*/, (0, utils_1.bytesToBase64)(keyPair.secretKey.slice(0, 32))];
            }
        });
    });
}
exports.mnemonicToSeed = mnemonicToSeed;
function seedToKeyPair(seed) {
    return tweetnacl_1.default.sign.keyPair.fromSeed((0, utils_1.base64ToBytes)(seed));
}
exports.seedToKeyPair = seedToKeyPair;
function encryptMnemonic(mnemonic, password) {
    return __awaiter(this, void 0, void 0, function () {
        var plaintext, salt, keyMaterial, key, iv, ptUint8, ctBuffer, ctArray, ctBase64, ivHex, saltHex;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    plaintext = mnemonic.join(',');
                    salt = crypto.getRandomValues(new Uint8Array(16));
                    return [4 /*yield*/, (_a = crypto.subtle).importKey.apply(_a, __spreadArray(['raw',
                            new TextEncoder().encode(password)], PBKDF2_IMPORT_KEY_ARGS, false))];
                case 1:
                    keyMaterial = _b.sent();
                    return [4 /*yield*/, crypto.subtle.deriveKey(__assign({ salt: salt }, PBKDF2_DERIVE_KEY_ARGS), keyMaterial, PBKDF2_DERIVE_KEY_TYPE, false, ['encrypt'])];
                case 2:
                    key = _b.sent();
                    iv = crypto.getRandomValues(new Uint8Array(12));
                    ptUint8 = new TextEncoder().encode(plaintext);
                    return [4 /*yield*/, crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, ptUint8)];
                case 3:
                    ctBuffer = _b.sent();
                    ctArray = Array.from(new Uint8Array(ctBuffer));
                    ctBase64 = btoa(String.fromCharCode.apply(String, ctArray));
                    ivHex = Array.from(iv).map(function (b) { return ("00".concat(b.toString(16))).slice(-2); }).join('');
                    saltHex = Array.from(salt).map(function (b) { return ("00".concat(b.toString(16))).slice(-2); }).join('');
                    return [2 /*return*/, "".concat(saltHex, ":").concat(ivHex, ":").concat(ctBase64)];
            }
        });
    });
}
exports.encryptMnemonic = encryptMnemonic;
function decryptMnemonic(encrypted, password) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, saltHex, ivHex, encryptedData, salt, iv, keyMaterial, key, ctStr, ctUint8, plainBuffer, plaintext;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!encrypted.includes(':')) {
                        return [2 /*return*/, decryptMnemonicLegacy(encrypted, password)];
                    }
                    _a = encrypted.split(':'), saltHex = _a[0], ivHex = _a[1], encryptedData = _a[2];
                    salt = new Uint8Array(saltHex.match(/.{2}/g).map(function (b) { return parseInt(b, 16); }));
                    iv = new Uint8Array(ivHex.match(/.{2}/g).map(function (b) { return parseInt(b, 16); }));
                    return [4 /*yield*/, (_b = crypto.subtle).importKey.apply(_b, __spreadArray(['raw',
                            new TextEncoder().encode(password)], PBKDF2_IMPORT_KEY_ARGS, false))];
                case 1:
                    keyMaterial = _c.sent();
                    return [4 /*yield*/, crypto.subtle.deriveKey(__assign({ salt: salt }, PBKDF2_DERIVE_KEY_ARGS), keyMaterial, PBKDF2_DERIVE_KEY_TYPE, false, ['decrypt'])];
                case 2:
                    key = _c.sent();
                    ctStr = atob(encryptedData);
                    ctUint8 = new Uint8Array(ctStr.match(/[\s\S]/g).map(function (ch) { return ch.charCodeAt(0); }));
                    return [4 /*yield*/, crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, key, ctUint8)];
                case 3:
                    plainBuffer = _c.sent();
                    plaintext = new TextDecoder().decode(plainBuffer);
                    return [2 /*return*/, plaintext.split(',')];
            }
        });
    });
}
exports.decryptMnemonic = decryptMnemonic;
function decryptMnemonicLegacy(encrypted, password) {
    return __awaiter(this, void 0, void 0, function () {
        var pwUtf8, pwHash, iv, alg, key, ctStr, ctUint8, plainBuffer, plaintext;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    pwUtf8 = new TextEncoder().encode(password);
                    return [4 /*yield*/, crypto.subtle.digest('SHA-256', pwUtf8)];
                case 1:
                    pwHash = _a.sent();
                    iv = encrypted.slice(0, 24).match(/.{2}/g).map(function (byte) { return parseInt(byte, 16); });
                    alg = { name: 'AES-GCM', iv: new Uint8Array(iv) };
                    return [4 /*yield*/, crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt'])];
                case 2:
                    key = _a.sent();
                    ctStr = atob(encrypted.slice(24));
                    ctUint8 = new Uint8Array(ctStr.match(/[\s\S]/g).map(function (ch) { return ch.charCodeAt(0); }));
                    return [4 /*yield*/, crypto.subtle.decrypt(alg, key, ctUint8)];
                case 3:
                    plainBuffer = _a.sent();
                    plaintext = new TextDecoder().decode(plainBuffer);
                    return [2 /*return*/, plaintext.split(',')];
            }
        });
    });
}
function fetchMnemonic(accountId, password) {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonicEncrypted, mnemonic, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, (0, accounts_1.getAccountValue)(accountId, 'mnemonicsEncrypted')];
                case 1:
                    mnemonicEncrypted = _a.sent();
                    return [4 /*yield*/, decryptMnemonic(mnemonicEncrypted, password)];
                case 2:
                    mnemonic = _a.sent();
                    if (!!mnemonicEncrypted.includes(':')) return [3 /*break*/, 4];
                    return [4 /*yield*/, tryMigratingMnemonicEncryption(accountId, mnemonic, password)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/, mnemonic];
                case 5:
                    err_1 = _a.sent();
                    // eslint-disable-next-line no-console
                    console.error(err_1);
                    return [2 /*return*/, undefined];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.fetchMnemonic = fetchMnemonic;
function tryMigratingMnemonicEncryption(accountId, mnemonic, password) {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonicEncrypted, decryptedMnemonic, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    return [4 /*yield*/, encryptMnemonic(mnemonic, password)];
                case 1:
                    mnemonicEncrypted = _a.sent();
                    return [4 /*yield*/, decryptMnemonic(mnemonicEncrypted, password)
                            .catch(function () { return undefined; })];
                case 2:
                    decryptedMnemonic = _a.sent();
                    if (!password || !decryptedMnemonic) {
                        return [2 /*return*/, { error: types_1.ApiCommonError.DebugError }];
                    }
                    return [4 /*yield*/, Promise.all([
                            (0, accounts_1.setAccountValue)(accountId, 'mnemonicsEncrypted', mnemonicEncrypted),
                        ])];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_2 = _a.sent();
                    // eslint-disable-next-line no-console
                    console.error(err_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, undefined];
            }
        });
    });
}
function fetchPrivateKey(accountId, password) {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonic, seedBase64, privateKey, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetchMnemonic(accountId, password)];
                case 1:
                    mnemonic = _a.sent();
                    if (!mnemonic) {
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, mnemonicToSeed(mnemonic)];
                case 2:
                    seedBase64 = _a.sent();
                    privateKey = seedToKeyPair(seedBase64).secretKey;
                    return [2 /*return*/, privateKey];
                case 3:
                    err_3 = _a.sent();
                    // eslint-disable-next-line no-console
                    console.error(err_3);
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchPrivateKey = fetchPrivateKey;
function fetchKeyPair(accountId, password) {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonic, err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetchMnemonic(accountId, password)];
                case 1:
                    mnemonic = _a.sent();
                    if (!mnemonic) {
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, tonWebMnemonic.mnemonicToKeyPair(mnemonic)];
                case 2: return [2 /*return*/, _a.sent()];
                case 3:
                    err_4 = _a.sent();
                    (0, logs_1.logDebugError)('fetchKeyPair', err_4);
                    return [2 /*return*/, undefined];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.fetchKeyPair = fetchKeyPair;
function rawSign(accountId, password, dataHex) {
    return __awaiter(this, void 0, void 0, function () {
        var privateKey, signature;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchPrivateKey(accountId, password)];
                case 1:
                    privateKey = _a.sent();
                    if (!privateKey) {
                        return [2 /*return*/, undefined];
                    }
                    signature = tweetnacl_1.default.sign.detached((0, utils_1.hexToBytes)(dataHex), privateKey);
                    return [2 /*return*/, (0, utils_1.bytesToHex)(signature)];
            }
        });
    });
}
exports.rawSign = rawSign;
function verifyPassword(accountId, password) {
    return __awaiter(this, void 0, void 0, function () {
        var mnemonic;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetchMnemonic(accountId, password)];
                case 1:
                    mnemonic = _a.sent();
                    return [2 /*return*/, Boolean(mnemonic)];
            }
        });
    });
}
exports.verifyPassword = verifyPassword;
