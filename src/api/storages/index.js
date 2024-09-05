"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
var types_1 = require("./types");
var config_1 = require("../../config");
var capacitorStorage_1 = require("./capacitorStorage");
var extension_1 = require("./extension");
var idb_1 = require("./idb");
var localStorage_1 = require("./localStorage");
exports.storage = config_1.IS_EXTENSION ? extension_1.default : config_1.IS_CAPACITOR ? capacitorStorage_1.default : idb_1.default;
exports.default = (_a = {},
    _a[types_1.StorageType.IndexedDb] = idb_1.default,
    _a[types_1.StorageType.LocalStorage] = localStorage_1.default,
    _a[types_1.StorageType.ExtensionLocal] = extension_1.default,
    _a[types_1.StorageType.CapacitorStorage] = capacitorStorage_1.default,
    _a);
