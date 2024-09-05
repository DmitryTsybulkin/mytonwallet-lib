"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiDb = exports.ApiDb = void 0;
var dexie_1 = require("../lib/dexie/dexie");
var DB_NANE = 'tables';
var ApiDb = /** @class */ (function (_super) {
    __extends(ApiDb, _super);
    function ApiDb() {
        var _this = _super.call(this, DB_NANE) || this;
        _this.version(1).stores({
            nfts: '[accountId+address], accountId, address, collectionAddress',
        });
        _this.version(2).stores({
            sseConnections: '&clientId',
        });
        return _this;
    }
    return ApiDb;
}(dexie_1.default));
exports.ApiDb = ApiDb;
exports.apiDb = new ApiDb();
