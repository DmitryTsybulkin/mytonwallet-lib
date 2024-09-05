"use strict";
// This JS library implements TON message comment encryption and decryption for Web
// Reference C++ code - SimpleEncryptionV2 - https://github.com/ton-blockchain/ton/blob/cc0eb453cb3bf69f92693160103d33112856c056/tonlib/tonlib/keys/SimpleEncryption.cpp#L110
// Dependencies:
// - TonWeb 0.0.60
// - aes-js - 3.1.2 - https://github.com/ricmoo/aes-js/releases/tag/v3.1.2 - for aes-cbc without padding
// - noble-ed25519 - 1.7.3 - // https://github.com/paulmillr/noble-ed25519/releases/tag/1.7.3 - for getSharedKey
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
exports.decryptMessageComment = exports.decryptData = exports.encryptMessageComment = exports.encryptData = void 0;
var constants_1 = require("../constants");
var tonCore_1 = require("./tonCore");
var ed25519 = require('../../../../lib/noble-ed25519');
var aesjs = require('../../../../lib/aes-js');
function hmacSha512(key, data) {
    return __awaiter(this, void 0, void 0, function () {
        var hmacAlgo, hmacKey, signature, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    hmacAlgo = { name: 'HMAC', hash: 'SHA-512' };
                    return [4 /*yield*/, crypto.subtle.importKey('raw', key, hmacAlgo, false, ['sign'])];
                case 1:
                    hmacKey = _a.sent();
                    return [4 /*yield*/, crypto.subtle.sign(hmacAlgo, hmacKey, data)];
                case 2:
                    signature = _a.sent();
                    result = new Uint8Array(signature);
                    if (result.length !== 512 / 8)
                        throw new Error();
                    return [2 /*return*/, result];
            }
        });
    });
}
function getAesCbcState(hash) {
    if (hash.length < 48)
        throw new Error();
    var key = hash.slice(0, 32);
    var iv = hash.slice(32, 32 + 16);
    // Note that native crypto.subtle AES-CBC not suitable here because
    // even if the data IS a multiple of 16 bytes, padding will still be added
    // So we use aes-js
    // eslint-disable-next-line new-cap
    return new aesjs.ModeOfOperation.cbc(key, iv);
}
function getRandomPrefix(dataLength, minPadding) {
    // eslint-disable-next-line no-bitwise
    var prefixLength = ((minPadding + 15 + dataLength) & -16) - dataLength;
    var prefix = crypto.getRandomValues(new Uint8Array(prefixLength));
    prefix[0] = prefixLength;
    if ((prefixLength + dataLength) % 16 !== 0)
        throw new Error();
    return prefix;
}
function combineSecrets(a, b) {
    return hmacSha512(a, b);
}
function encryptDataWithPrefix(data, sharedSecret, salt) {
    return __awaiter(this, void 0, void 0, function () {
        var dataHash, msgKey, res, cbcStateSecret, encrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (data.length % 16 !== 0)
                        throw new Error();
                    return [4 /*yield*/, combineSecrets(salt, data)];
                case 1:
                    dataHash = _a.sent();
                    msgKey = dataHash.slice(0, 16);
                    res = new Uint8Array(data.length + 16);
                    res.set(msgKey, 0);
                    return [4 /*yield*/, combineSecrets(sharedSecret, msgKey)];
                case 2:
                    cbcStateSecret = _a.sent();
                    return [4 /*yield*/, getAesCbcState(cbcStateSecret)];
                case 3:
                    encrypted = (_a.sent()).encrypt(data);
                    res.set(encrypted, 16);
                    return [2 /*return*/, res];
            }
        });
    });
}
function encryptDataImpl(data, sharedSecret, salt) {
    return __awaiter(this, void 0, void 0, function () {
        var prefix, combined;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRandomPrefix(data.length, 16)];
                case 1:
                    prefix = _a.sent();
                    combined = new Uint8Array(prefix.length + data.length);
                    combined.set(prefix, 0);
                    combined.set(data, prefix.length);
                    return [2 /*return*/, encryptDataWithPrefix(combined, sharedSecret, salt)];
            }
        });
    });
}
function encryptData(data, myPublicKey, theirPublicKey, privateKey, salt) {
    return __awaiter(this, void 0, void 0, function () {
        var sharedSecret, encrypted, prefixedEncrypted, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, ed25519.getSharedSecret(privateKey, theirPublicKey)];
                case 1:
                    sharedSecret = _a.sent();
                    return [4 /*yield*/, encryptDataImpl(data, sharedSecret, salt)];
                case 2:
                    encrypted = _a.sent();
                    prefixedEncrypted = new Uint8Array(myPublicKey.length + encrypted.length);
                    for (i = 0; i < myPublicKey.length; i++) {
                        // eslint-disable-next-line no-bitwise
                        prefixedEncrypted[i] = theirPublicKey[i] ^ myPublicKey[i];
                    }
                    prefixedEncrypted.set(encrypted, myPublicKey.length);
                    return [2 /*return*/, prefixedEncrypted];
            }
        });
    });
}
exports.encryptData = encryptData;
function encryptMessageComment(comment, myPublicKey, theirPublicKey, myPrivateKey, senderAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var commentBytes, salt, encryptedBytes, payload, buffer;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!comment || !comment.length)
                        throw new Error('empty comment');
                    if (myPrivateKey.length === 64) {
                        myPrivateKey = myPrivateKey.slice(0, 32); // convert nacl private key
                    }
                    commentBytes = new TextEncoder().encode(comment);
                    salt = new TextEncoder().encode((0, tonCore_1.toBase64Address)(senderAddress, true));
                    return [4 /*yield*/, encryptData(commentBytes, myPublicKey, theirPublicKey, myPrivateKey, salt)];
                case 1:
                    encryptedBytes = _a.sent();
                    payload = new Uint8Array(encryptedBytes.length + 4);
                    buffer = Buffer.alloc(4);
                    buffer.writeUInt32BE(constants_1.OpCode.Encrypted);
                    payload.set(buffer, 0);
                    payload.set(encryptedBytes, 4);
                    return [2 /*return*/, payload];
            }
        });
    });
}
exports.encryptMessageComment = encryptMessageComment;
function doDecrypt(cbcStateSecret, msgKey, encryptedData, salt) {
    return __awaiter(this, void 0, void 0, function () {
        var decryptedData, dataHash, gotMsgKey, prefixLength;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAesCbcState(cbcStateSecret)];
                case 1:
                    decryptedData = (_a.sent()).decrypt(encryptedData);
                    return [4 /*yield*/, combineSecrets(salt, decryptedData)];
                case 2:
                    dataHash = _a.sent();
                    gotMsgKey = dataHash.slice(0, 16);
                    if (msgKey.join(',') !== gotMsgKey.join(',')) {
                        throw new Error('Failed to decrypt: hash mismatch');
                    }
                    prefixLength = decryptedData[0];
                    if (prefixLength > decryptedData.length || prefixLength < 16) {
                        throw new Error('Failed to decrypt: invalid prefix size');
                    }
                    return [2 /*return*/, decryptedData.slice(prefixLength)];
            }
        });
    });
}
function decryptDataImpl(encryptedData, sharedSecret, salt) {
    return __awaiter(this, void 0, void 0, function () {
        var msgKey, data, cbcStateSecret, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (encryptedData.length < 16)
                        throw new Error('Failed to decrypt: data is too small');
                    if (encryptedData.length % 16 !== 0)
                        throw new Error('Failed to decrypt: data size is not divisible by 16');
                    msgKey = encryptedData.slice(0, 16);
                    data = encryptedData.slice(16);
                    return [4 /*yield*/, combineSecrets(sharedSecret, msgKey)];
                case 1:
                    cbcStateSecret = _a.sent();
                    return [4 /*yield*/, doDecrypt(cbcStateSecret, msgKey, data, salt)];
                case 2:
                    res = _a.sent();
                    return [2 /*return*/, res];
            }
        });
    });
}
function decryptData(data, publicKey, privateKey, salt) {
    return __awaiter(this, void 0, void 0, function () {
        var theirPublicKey, i, sharedSecret, decrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (data.length < publicKey.length) {
                        throw new Error('Failed to decrypt: data is too small');
                    }
                    theirPublicKey = new Uint8Array(publicKey.length);
                    for (i = 0; i < publicKey.length; i++) {
                        // eslint-disable-next-line no-bitwise
                        theirPublicKey[i] = data[i] ^ publicKey[i];
                    }
                    return [4 /*yield*/, ed25519.getSharedSecret(privateKey, theirPublicKey)];
                case 1:
                    sharedSecret = _a.sent();
                    return [4 /*yield*/, decryptDataImpl(data.slice(publicKey.length), sharedSecret, salt)];
                case 2:
                    decrypted = _a.sent();
                    return [2 /*return*/, decrypted];
            }
        });
    });
}
exports.decryptData = decryptData;
function decryptMessageComment(encryptedData, myPublicKey, myPrivateKey, senderAddress) {
    return __awaiter(this, void 0, void 0, function () {
        var salt, decryptedBytes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (myPrivateKey.length === 64) {
                        myPrivateKey = myPrivateKey.slice(0, 32); // convert nacl private key
                    }
                    salt = new TextEncoder().encode((0, tonCore_1.toBase64Address)(senderAddress, true));
                    return [4 /*yield*/, decryptData(encryptedData, myPublicKey, myPrivateKey, salt)];
                case 1:
                    decryptedBytes = _a.sent();
                    return [2 /*return*/, new TextDecoder().decode(decryptedBytes)];
            }
        });
    });
}
exports.decryptMessageComment = decryptMessageComment;
