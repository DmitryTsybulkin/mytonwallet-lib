"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import {generateMnemonic} from "./api/methods";
var api_1 = require("./api");
console.log('pizdec');
console.log("new mnemonic: ".concat((0, api_1.callApi)('generateMnemonic')));
