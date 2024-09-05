"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageType = void 0;
var StorageType;
(function (StorageType) {
    StorageType[StorageType["IndexedDb"] = 0] = "IndexedDb";
    StorageType[StorageType["LocalStorage"] = 1] = "LocalStorage";
    StorageType[StorageType["ExtensionLocal"] = 2] = "ExtensionLocal";
    StorageType[StorageType["CapacitorStorage"] = 3] = "CapacitorStorage";
})(StorageType || (exports.StorageType = StorageType = {}));
