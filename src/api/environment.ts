/*
 * This module is to be used instead of /src/util/environment.ts
 * when `window` is not available (e.g. in a web worker).
 */
import type { ApiInitArgs } from './types';

import {
  ELECTRON_TONHTTPAPI_MAINNET_API_KEY,
  ELECTRON_TONHTTPAPI_TESTNET_API_KEY,
  TONHTTPAPI_MAINNET_API_KEY,
  TONHTTPAPI_TESTNET_API_KEY,
} from '../config';


let environment: ApiInitArgs & {
  isDappSupported: boolean;
  isSseSupported: boolean;
  apiHeaders?: AnyLiteral;
  tonhttpapiMainnetKey?: string;
  tonhttpapiTestnetKey?: string;
};

export function setEnvironment(args: ApiInitArgs) {
  environment = {
    ...args,
    isDappSupported: false,
    isSseSupported: false,
    // eslint-disable-next-line no-restricted-globals
    apiHeaders: { 'X-App-Origin': self?.origin },
    tonhttpapiMainnetKey: args.isElectron ? ELECTRON_TONHTTPAPI_MAINNET_API_KEY : TONHTTPAPI_MAINNET_API_KEY,
    tonhttpapiTestnetKey: args.isElectron ? ELECTRON_TONHTTPAPI_TESTNET_API_KEY : TONHTTPAPI_TESTNET_API_KEY,
  };
  return environment;
}

export function getEnvironment() {
  return environment;
}
