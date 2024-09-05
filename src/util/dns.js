"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zones = ['ton', 't.me', 'vip'];
var zonesRegex = {
    ton: /^([-\da-z]+\.){0,2}([-\da-z]{4,126})\.ton$/i,
    't.me': /^([-\da-z]+\.){0,2}([-_\da-z]{4,126})\.t\.me$/i,
    vip: /^(?<base>([-\da-z]+\.){0,2}([\da-z]{1,24}))\.(ton\.vip|vip\.ton|vip)$/i,
};
function isDnsDomain(value) {
    return Object.values(zonesRegex).some(function (zone) { return zone.test(value); });
}
function isVipDnsDomain(value) {
    return zonesRegex.vip.test(value);
}
function removeVipZone(value) {
    var _a, _b;
    value = value.replace(/\.ton\.vip$/i, '.vip').replace(/\.vip\.ton$/i, '.vip');
    return (_b = (_a = value.match(zonesRegex.vip)) === null || _a === void 0 ? void 0 : _a.groups) === null || _b === void 0 ? void 0 : _b.base;
}
function removeTonZone(value) {
    return value.replace(/\.ton$/i, '');
}
exports.default = {
    zones: zones,
    zonesRegex: zonesRegex,
    isDnsDomain: isDnsDomain,
    isVipDnsDomain: isVipDnsDomain,
    removeVipZone: removeVipZone,
    removeTonZone: removeTonZone,
};
