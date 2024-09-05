import type { ApiBaseCurrency, ApiSwapAsset, ApiWalletVersion } from './api/types';

export const APP_ENV = process.env.APP_ENV;

export const APP_VERSION = process.env.APP_VERSION!;

export const DEBUG = APP_ENV !== 'production' && APP_ENV !== 'perf' && APP_ENV !== 'test';
export const DEBUG_MORE = false;

export const PRODUCTION_URL = 'https://mytonwallet.app';

export const SWAP_FEE_ADDRESS = process.env.SWAP_FEE_ADDRESS || 'UQDUkQbpTVIgt7v66-JTFR-3-eXRFz_4V66F-Ufn6vOg0GOp';

export const STRICTERDOM_ENABLED = DEBUG;

export const DEBUG_ALERT_MSG = 'Shoot!\nSomething went wrong, please see the error details in Dev Tools Console.';

export const TON_SYMBOL = 'TON';

export const DEFAULT_DECIMAL_PLACES = 9;

export const MAIN_ACCOUNT_ID = '0-ton-mainnet';
export const IS_NATIVE_ANDROID = false;

export const TONHTTPAPI_MAINNET_URL = process.env.TONHTTPAPI_MAINNET_URL
  || 'https://tonhttpapi.mytonwallet.org/api/v2/jsonRPC';
export const TONHTTPAPI_MAINNET_API_KEY = process.env.TONHTTPAPI_MAINNET_API_KEY;
export const ELECTRON_TONHTTPAPI_MAINNET_API_KEY = process.env.ELECTRON_TONHTTPAPI_MAINNET_API_KEY;
export const TONHTTPAPI_V3_MAINNET_API_URL = process.env.TONHTTPAPI_V3_MAINNET_API_KEY
  || 'https://tonhttpapi-v3.mytonwallet.org/api/v3';
export const TONAPIIO_MAINNET_URL = process.env.TONAPIIO_MAINNET_URL || 'https://tonapiio.mytonwallet.org';

export const TONHTTPAPI_TESTNET_URL = process.env.TONHTTPAPI_TESTNET_URL
  || 'https://tonhttpapi-testnet.mytonwallet.org/api/v2/jsonRPC';
export const TONHTTPAPI_TESTNET_API_KEY = process.env.TONHTTPAPI_TESTNET_API_KEY;
export const ELECTRON_TONHTTPAPI_TESTNET_API_KEY = process.env.ELECTRON_TONHTTPAPI_TESTNET_API_KEY;
export const TONHTTPAPI_V3_TESTNET_API_URL = process.env.TONHTTPAPI_V3_TESTNET_API_KEY
  || 'https://tonhttpapi-v3-testnet.mytonwallet.org/api/v3';
export const TONAPIIO_TESTNET_URL = process.env.TONAPIIO_TESTNET_URL || 'https://tonapiio-testnet.mytonwallet.org';

export const BRILLIANT_API_BASE_URL = process.env.BRILLIANT_API_BASE_URL || 'https://api.mytonwallet.org';

export const TON_TOKEN_SLUG = 'toncoin';
export const JWBTC_TOKEN_SLUG = 'ton-eqdcbkghmc';
export const JUSDT_TOKEN_SLUG = 'ton-eqbynbo23y';
export const USDT_TRON_TOKEN_SLUG = 'usdtrx';

export const PROXY_HOSTS = process.env.PROXY_HOSTS;

export const TINY_TRANSFER_MAX_COST = 0.01;

export const STAKING_CYCLE_DURATION_MS = 131072000; // 36.4 hours
export const VALIDATION_PERIOD_MS = 65536000; // 18.2 h.
export const ONE_TON = 1000000000n;
export const MIN_BALANCE_FOR_UNSTAKE = 1020000000n; // 1.02 TON
export const STAKING_FORWARD_AMOUNT = ONE_TON;
export const DEFAULT_FEE = 15000000n; // 0.015 TON

export const STAKING_POOLS = process.env.STAKING_POOLS ? process.env.STAKING_POOLS.split(' ') : [];
export const LIQUID_POOL = process.env.LIQUID_POOL || 'EQD2_4d91M4TVbEBVyBF8J1UwpMJc361LKVCz6bBlffMW05o';
export const LIQUID_JETTON = process.env.LIQUID_JETTON || 'EQCqC6EhRJ_tpWngKxL6dV0k6DSnRUrs9GSVkLbfdCqsj6TE';
export const STAKING_MIN_AMOUNT = ONE_TON;
export const NOMINATORS_STAKING_MIN_AMOUNT = ONE_TON * 10001n;

export const TON_PROTOCOL = 'ton://';
export const TONCONNECT_PROTOCOL = 'tc://';
export const TONCONNECT_UNIVERSAL_URL = 'https://connect.mytonwallet.org';
export const TONCONNECT_PROTOCOL_VERSION = 2;
export const TONCONNECT_WALLET_JSBRIDGE_KEY = 'mytonwallet';

export const TOKEN_INFO = {
  toncoin: {
    name: 'Toncoin',
    symbol: TON_SYMBOL,
    slug: TON_TOKEN_SLUG,
    cmcSlug: TON_TOKEN_SLUG,
    quote: {
      slug: TON_TOKEN_SLUG,
      price: 1.95,
      priceUsd: 1.95,
      percentChange24h: 0,
    },
    decimals: DEFAULT_DECIMAL_PLACES,
  },
};

export const TON_BLOCKCHAIN = 'ton';

export const INIT_SWAP_ASSETS: Record<string, ApiSwapAsset> = {
  toncoin: {
    name: 'Toncoin',
    symbol: TON_SYMBOL,
    blockchain: TON_BLOCKCHAIN,
    slug: TON_TOKEN_SLUG,
    decimals: DEFAULT_DECIMAL_PLACES,
    price: 0,
    priceUsd: 0,
    isPopular: true,
  },
  'ton-eqdcbkghmc': {
    name: 'jWBTC',
    symbol: 'jWBTC',
    blockchain: TON_BLOCKCHAIN,
    slug: 'ton-eqdcbkghmc',
    decimals: 8,
    // eslint-disable-next-line max-len
    image: 'https://cache.tonapi.io/imgproxy/LaFKdzahVX9epWT067gyVLd8aCa1lFrZd7Rp9siViEE/rs:fill:200:200:1/g:no/aHR0cHM6Ly9icmlkZ2UudG9uLm9yZy90b2tlbi8xLzB4MjI2MGZhYzVlNTU0MmE3NzNhYTQ0ZmJjZmVkZjdjMTkzYmMyYzU5OS5wbmc.webp',
    contract: 'EQDcBkGHmC4pTf34x3Gm05XvepO5w60DNxZ-XT4I6-UGG5L5',
    price: 0,
    priceUsd: 0,
    isPopular: false,
    keywords: ['bitcoin'],
  },
};

export const DEFAULT_PRICE_CURRENCY = 'USD';
export const SHORT_CURRENCY_SYMBOL_MAP = {
  USD: '$',
  EUR: '€',
  RUB: '₽',
  CNY: '¥',
};
export const CURRENCY_LIST: { value: ApiBaseCurrency; name: string }[] = [
  {
    value: 'USD',
    name: 'US Dollar',
  }, {
    value: 'EUR',
    name: 'Euro',
  }, {
    value: 'RUB',
    name: 'Ruble',
  }, {
    value: 'CNY',
    name: 'Yuan',
  }, {
    value: 'BTC',
    name: 'Bitcoin',
  }, {
    value: TON_SYMBOL,
    name: 'Toncoin',
  },
];


export const DEFAULT_WALLET_VERSION: ApiWalletVersion = 'v4R2';
export const POPULAR_WALLET_VERSIONS: ApiWalletVersion[] = ['v3R1', 'v3R2', 'v4R2'];

export const DEFAULT_TIMEOUT = 5000;
export const DEFAULT_RETRIES = 3;
export const DEFAULT_ERROR_PAUSE = 200;
