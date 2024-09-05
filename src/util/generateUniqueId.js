"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
exports.default = generateUniqueId;
