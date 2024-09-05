"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compareActivities = void 0;
function compareActivities(a, b, isAsc) {
    if (isAsc === void 0) { isAsc = false; }
    var value = a.timestamp - b.timestamp;
    if (value === 0) {
        value = a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
    }
    return isAsc ? value : -value;
}
exports.compareActivities = compareActivities;
