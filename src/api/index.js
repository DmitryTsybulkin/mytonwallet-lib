"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.callApi = exports.initApi = void 0;
// export { initApi, callApi } from './providers/direct/connector';
var connector_1 = require("./providers/worker/connector");
Object.defineProperty(exports, "initApi", { enumerable: true, get: function () { return connector_1.initApi; } });
Object.defineProperty(exports, "callApi", { enumerable: true, get: function () { return connector_1.callApi; } });
