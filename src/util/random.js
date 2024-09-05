"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomBytes = exports.sample = exports.random = void 0;
function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
exports.random = random;
function sample(arr) {
    return arr[random(0, arr.length - 1)];
}
exports.sample = sample;
function randomBytes(size) {
    // eslint-disable-next-line no-restricted-globals
    return self.crypto.getRandomValues(new Uint8Array(size));
}
exports.randomBytes = randomBytes;
