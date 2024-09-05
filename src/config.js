"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TONHTTPAPI_MAINNET_API_KEY = exports.TONHTTPAPI_MAINNET_URL = exports.MAIN_ACCOUNT_ID = exports.THEME_DEFAULT = exports.ANIMATION_LEVEL_DEFAULT = exports.ANIMATION_LEVEL_MAX = exports.ANIMATION_LEVEL_MED = exports.ANIMATION_LEVEL_MIN = exports.GLOBAL_STATE_CACHE_KEY = exports.GLOBAL_STATE_CACHE_DISABLED = exports.DEFAULT_SLIPPAGE_VALUE = exports.DEFAULT_DECIMAL_PLACES = exports.DEFAULT_LANDSCAPE_ACTION_TAB_ID = exports.TON_SYMBOL = exports.ANIMATED_STICKER_HUGE_SIZE_PX = exports.ANIMATED_STICKER_BIG_SIZE_PX = exports.ANIMATED_STICKER_DEFAULT_PX = exports.ANIMATED_STICKER_MIDDLE_SIZE_PX = exports.ANIMATED_STICKER_SMALL_SIZE_PX = exports.ANIMATED_STICKER_TINY_SIZE_PX = exports.ANIMATION_END_DELAY = exports.MOBILE_SCREEN_MAX_WIDTH = exports.MNEMONIC_CHECK_COUNT = exports.MNEMONIC_COUNT = exports.NATIVE_BIOMETRICS_SERVER = exports.NATIVE_BIOMETRICS_USERNAME = exports.PIN_LENGTH = exports.DEBUG_ALERT_MSG = exports.STRICTERDOM_ENABLED = exports.SWAP_FEE_ADDRESS = exports.BASE_URL = exports.APP_REPO_URL = exports.BETA_URL = exports.PRODUCTION_URL = exports.INACTIVE_MARKER = exports.ELECTRON_HOST_URL = exports.IS_ANDROID_DIRECT = exports.IS_CAPACITOR = exports.IS_PACKAGED_ELECTRON = exports.IS_FIREFOX_EXTENSION = exports.IS_EXTENSION = exports.IS_PERF = exports.IS_TEST = exports.IS_PRODUCTION = exports.DEBUG_MORE = exports.DEBUG = exports.APP_ENV_MARKER = exports.APP_VERSION = exports.APP_NAME = exports.APP_ENV = void 0;
exports.MULTITAB_DATA_CHANNEL_NAME = exports.INIT_SWAP_ASSETS = exports.TON_BLOCKCHAIN = exports.TOKEN_INFO = exports.TONCONNECT_WALLET_JSBRIDGE_KEY = exports.TONCONNECT_PROTOCOL_VERSION = exports.TONCONNECT_UNIVERSAL_URL = exports.TONCONNECT_PROTOCOL = exports.TON_PROTOCOL = exports.NOMINATORS_STAKING_MIN_AMOUNT = exports.STAKING_MIN_AMOUNT = exports.LIQUID_JETTON = exports.LIQUID_POOL = exports.STAKING_POOLS = exports.DEFAULT_FEE = exports.STAKING_FORWARD_AMOUNT = exports.MIN_BALANCE_FOR_UNSTAKE = exports.ONE_TON = exports.VALIDATION_PERIOD_MS = exports.STAKING_CYCLE_DURATION_MS = exports.LANG_CACHE_NAME = exports.TINY_TRANSFER_MAX_COST = exports.PROXY_HOSTS = exports.USDT_TRON_TOKEN_SLUG = exports.JUSDT_TOKEN_SLUG = exports.JWBTC_TOKEN_SLUG = exports.TON_TOKEN_SLUG = exports.CHANGELLY_WAITING_DEADLINE = exports.CHANGELLY_AML_KYC = exports.CHANGELLY_PRIVACY_POLICY = exports.CHANGELLY_TERMS_OF_USE = exports.CHANGELLY_SECURITY_EMAIL = exports.CHANGELLY_SUPPORT_EMAIL = exports.GETGEMS_BASE_TESTNET_URL = exports.GETGEMS_BASE_MAINNET_URL = exports.TONSCAN_BASE_TESTNET_URL = exports.TONSCAN_BASE_MAINNET_URL = exports.TELEGRAM_WEB_URL = exports.MY_TON_WALLET_PROMO_URL = exports.SHORT_FRACTION_DIGITS = exports.FRACTION_DIGITS = exports.BRILLIANT_API_BASE_URL = exports.TONAPIIO_TESTNET_URL = exports.TONHTTPAPI_V3_TESTNET_API_URL = exports.ELECTRON_TONHTTPAPI_TESTNET_API_KEY = exports.TONHTTPAPI_TESTNET_API_KEY = exports.TONHTTPAPI_TESTNET_URL = exports.TONAPIIO_MAINNET_URL = exports.TONHTTPAPI_V3_MAINNET_API_URL = exports.ELECTRON_TONHTTPAPI_MAINNET_API_KEY = void 0;
exports.HISTORY_PERIODS = exports.DEFAULT_ERROR_PAUSE = exports.DEFAULT_RETRIES = exports.DEFAULT_TIMEOUT = exports.POPULAR_WALLET_VERSIONS = exports.DEFAULT_WALLET_VERSION = exports.EXCHANGE_ADDRESSES = exports.CURRENCY_LIST = exports.SHORT_CURRENCY_SYMBOL_MAP = exports.DEFAULT_PRICE_CURRENCY = exports.MIN_ASSETS_TAB_VIEW = exports.WINDOW_PROVIDER_CHANNEL = exports.INDEXED_DB_STORE_NAME = exports.INDEXED_DB_NAME = exports.ACTIVE_TAB_STORAGE_KEY = void 0;
exports.APP_ENV = process.env.APP_ENV;
exports.APP_NAME = process.env.APP_NAME || 'MyTonWallet';
exports.APP_VERSION = process.env.APP_VERSION;
exports.APP_ENV_MARKER = exports.APP_ENV === 'staging' ? 'Beta' : exports.APP_ENV === 'development' ? 'Dev' : undefined;
exports.DEBUG = exports.APP_ENV !== 'production' && exports.APP_ENV !== 'perf' && exports.APP_ENV !== 'test';
exports.DEBUG_MORE = false;
exports.IS_PRODUCTION = exports.APP_ENV === 'production';
exports.IS_TEST = exports.APP_ENV === 'test';
exports.IS_PERF = exports.APP_ENV === 'perf';
exports.IS_EXTENSION = process.env.IS_EXTENSION === '1';
exports.IS_FIREFOX_EXTENSION = process.env.IS_FIREFOX_EXTENSION === '1';
exports.IS_PACKAGED_ELECTRON = process.env.IS_PACKAGED_ELECTRON === '1';
exports.IS_CAPACITOR = process.env.IS_CAPACITOR === '1';
exports.IS_ANDROID_DIRECT = process.env.IS_ANDROID_DIRECT === '1';
exports.ELECTRON_HOST_URL = 'https://dumb-host';
exports.INACTIVE_MARKER = '[Inactive]';
exports.PRODUCTION_URL = 'https://mytonwallet.app';
exports.BETA_URL = 'https://beta.mytonwallet.app';
exports.APP_REPO_URL = 'https://github.com/mytonwalletorg/mytonwallet';
exports.BASE_URL = process.env.BASE_URL;
exports.SWAP_FEE_ADDRESS = process.env.SWAP_FEE_ADDRESS || 'UQDUkQbpTVIgt7v66-JTFR-3-eXRFz_4V66F-Ufn6vOg0GOp';
exports.STRICTERDOM_ENABLED = exports.DEBUG && !exports.IS_PACKAGED_ELECTRON;
exports.DEBUG_ALERT_MSG = 'Shoot!\nSomething went wrong, please see the error details in Dev Tools Console.';
exports.PIN_LENGTH = 4;
exports.NATIVE_BIOMETRICS_USERNAME = 'MyTonWallet';
exports.NATIVE_BIOMETRICS_SERVER = 'https://mytonwallet.app';
exports.MNEMONIC_COUNT = 24;
exports.MNEMONIC_CHECK_COUNT = 3;
exports.MOBILE_SCREEN_MAX_WIDTH = 700; // px
exports.ANIMATION_END_DELAY = 50;
exports.ANIMATED_STICKER_TINY_SIZE_PX = 70;
exports.ANIMATED_STICKER_SMALL_SIZE_PX = 110;
exports.ANIMATED_STICKER_MIDDLE_SIZE_PX = 120;
exports.ANIMATED_STICKER_DEFAULT_PX = 150;
exports.ANIMATED_STICKER_BIG_SIZE_PX = 156;
exports.ANIMATED_STICKER_HUGE_SIZE_PX = 192;
exports.TON_SYMBOL = 'TON';
exports.DEFAULT_LANDSCAPE_ACTION_TAB_ID = 0;
exports.DEFAULT_DECIMAL_PLACES = 9;
exports.DEFAULT_SLIPPAGE_VALUE = 5;
exports.GLOBAL_STATE_CACHE_DISABLED = false;
exports.GLOBAL_STATE_CACHE_KEY = 'mytonwallet-global-state';
exports.ANIMATION_LEVEL_MIN = 0;
exports.ANIMATION_LEVEL_MED = 1;
exports.ANIMATION_LEVEL_MAX = 2;
exports.ANIMATION_LEVEL_DEFAULT = exports.ANIMATION_LEVEL_MAX;
exports.THEME_DEFAULT = 'system';
exports.MAIN_ACCOUNT_ID = '0-ton-mainnet';
exports.TONHTTPAPI_MAINNET_URL = process.env.TONHTTPAPI_MAINNET_URL
    || 'https://tonhttpapi.mytonwallet.org/api/v2/jsonRPC';
exports.TONHTTPAPI_MAINNET_API_KEY = process.env.TONHTTPAPI_MAINNET_API_KEY;
exports.ELECTRON_TONHTTPAPI_MAINNET_API_KEY = process.env.ELECTRON_TONHTTPAPI_MAINNET_API_KEY;
exports.TONHTTPAPI_V3_MAINNET_API_URL = process.env.TONHTTPAPI_V3_MAINNET_API_KEY
    || 'https://tonhttpapi-v3.mytonwallet.org/api/v3';
exports.TONAPIIO_MAINNET_URL = process.env.TONAPIIO_MAINNET_URL || 'https://tonapiio.mytonwallet.org';
exports.TONHTTPAPI_TESTNET_URL = process.env.TONHTTPAPI_TESTNET_URL
    || 'https://tonhttpapi-testnet.mytonwallet.org/api/v2/jsonRPC';
exports.TONHTTPAPI_TESTNET_API_KEY = process.env.TONHTTPAPI_TESTNET_API_KEY;
exports.ELECTRON_TONHTTPAPI_TESTNET_API_KEY = process.env.ELECTRON_TONHTTPAPI_TESTNET_API_KEY;
exports.TONHTTPAPI_V3_TESTNET_API_URL = process.env.TONHTTPAPI_V3_TESTNET_API_KEY
    || 'https://tonhttpapi-v3-testnet.mytonwallet.org/api/v3';
exports.TONAPIIO_TESTNET_URL = process.env.TONAPIIO_TESTNET_URL || 'https://tonapiio-testnet.mytonwallet.org';
exports.BRILLIANT_API_BASE_URL = process.env.BRILLIANT_API_BASE_URL || 'https://api.mytonwallet.org';
exports.FRACTION_DIGITS = 9;
exports.SHORT_FRACTION_DIGITS = 2;
exports.MY_TON_WALLET_PROMO_URL = 'https://mytonwallet.io';
exports.TELEGRAM_WEB_URL = 'https://web.telegram.org/a/';
exports.TONSCAN_BASE_MAINNET_URL = 'https://tonscan.org/';
exports.TONSCAN_BASE_TESTNET_URL = 'https://testnet.tonscan.org/';
exports.GETGEMS_BASE_MAINNET_URL = 'https://getgems.io/';
exports.GETGEMS_BASE_TESTNET_URL = 'https://testnet.getgems.io/';
exports.CHANGELLY_SUPPORT_EMAIL = 'support@changelly.com';
exports.CHANGELLY_SECURITY_EMAIL = 'security@changelly.com';
exports.CHANGELLY_TERMS_OF_USE = 'https://changelly.com/terms-of-use';
exports.CHANGELLY_PRIVACY_POLICY = 'https://changelly.com/privacy-policy';
exports.CHANGELLY_AML_KYC = 'https://changelly.com/aml-kyc';
exports.CHANGELLY_WAITING_DEADLINE = 3 * 60 * 60 * 1000; // 3 hour
exports.TON_TOKEN_SLUG = 'toncoin';
exports.JWBTC_TOKEN_SLUG = 'ton-eqdcbkghmc';
exports.JUSDT_TOKEN_SLUG = 'ton-eqbynbo23y';
exports.USDT_TRON_TOKEN_SLUG = 'usdtrx';
exports.PROXY_HOSTS = process.env.PROXY_HOSTS;
exports.TINY_TRANSFER_MAX_COST = 0.01;
exports.LANG_CACHE_NAME = 'mtw-lang-79';
exports.STAKING_CYCLE_DURATION_MS = 131072000; // 36.4 hours
exports.VALIDATION_PERIOD_MS = 65536000; // 18.2 h.
exports.ONE_TON = 1000000000n;
exports.MIN_BALANCE_FOR_UNSTAKE = 1020000000n; // 1.02 TON
exports.STAKING_FORWARD_AMOUNT = exports.ONE_TON;
exports.DEFAULT_FEE = 15000000n; // 0.015 TON
exports.STAKING_POOLS = process.env.STAKING_POOLS ? process.env.STAKING_POOLS.split(' ') : [];
exports.LIQUID_POOL = process.env.LIQUID_POOL || 'EQD2_4d91M4TVbEBVyBF8J1UwpMJc361LKVCz6bBlffMW05o';
exports.LIQUID_JETTON = process.env.LIQUID_JETTON || 'EQCqC6EhRJ_tpWngKxL6dV0k6DSnRUrs9GSVkLbfdCqsj6TE';
exports.STAKING_MIN_AMOUNT = exports.ONE_TON;
exports.NOMINATORS_STAKING_MIN_AMOUNT = exports.ONE_TON * 10001n;
exports.TON_PROTOCOL = 'ton://';
exports.TONCONNECT_PROTOCOL = 'tc://';
exports.TONCONNECT_UNIVERSAL_URL = 'https://connect.mytonwallet.org';
exports.TONCONNECT_PROTOCOL_VERSION = 2;
exports.TONCONNECT_WALLET_JSBRIDGE_KEY = 'mytonwallet';
exports.TOKEN_INFO = {
    toncoin: {
        name: 'Toncoin',
        symbol: exports.TON_SYMBOL,
        slug: exports.TON_TOKEN_SLUG,
        cmcSlug: exports.TON_TOKEN_SLUG,
        quote: {
            slug: exports.TON_TOKEN_SLUG,
            price: 1.95,
            priceUsd: 1.95,
            percentChange24h: 0,
        },
        decimals: exports.DEFAULT_DECIMAL_PLACES,
    },
};
exports.TON_BLOCKCHAIN = 'ton';
exports.INIT_SWAP_ASSETS = {
    toncoin: {
        name: 'Toncoin',
        symbol: exports.TON_SYMBOL,
        blockchain: exports.TON_BLOCKCHAIN,
        slug: exports.TON_TOKEN_SLUG,
        decimals: exports.DEFAULT_DECIMAL_PLACES,
        price: 0,
        priceUsd: 0,
        isPopular: true,
    },
    'ton-eqdcbkghmc': {
        name: 'jWBTC',
        symbol: 'jWBTC',
        blockchain: exports.TON_BLOCKCHAIN,
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
exports.MULTITAB_DATA_CHANNEL_NAME = 'mtw-multitab';
exports.ACTIVE_TAB_STORAGE_KEY = 'mtw-active-tab';
exports.INDEXED_DB_NAME = 'keyval-store';
exports.INDEXED_DB_STORE_NAME = 'keyval';
exports.WINDOW_PROVIDER_CHANNEL = 'windowProvider';
exports.MIN_ASSETS_TAB_VIEW = 5;
exports.DEFAULT_PRICE_CURRENCY = 'USD';
exports.SHORT_CURRENCY_SYMBOL_MAP = {
    USD: '$',
    EUR: '€',
    RUB: '₽',
    CNY: '¥',
};
exports.CURRENCY_LIST = [
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
        value: exports.TON_SYMBOL,
        name: 'Toncoin',
    },
];
exports.EXCHANGE_ADDRESSES = new Set([
    'EQBfAN7LfaUYgXZNw5Wc7GBgkEX2yhuJ5ka95J1JJwXXf4a8', 'UQBfAN7LfaUYgXZNw5Wc7GBgkEX2yhuJ5ka95J1JJwXXf9t5', // OKX
    'EQBBlxK8VBxEidbxw4oQVyLSk7iEf9VPJxetaRQpEbi-XG4U', 'UQBBlxK8VBxEidbxw4oQVyLSk7iEf9VPJxetaRQpEbi-XDPR', // Bitfinex
    'EQBX63RAdgShn34EAFMV73Cut7Z15lUZd1hnVva68SEl7sxi', 'UQBX63RAdgShn34EAFMV73Cut7Z15lUZd1hnVva68SEl7pGn', // MEXC
    'EQDD8dqOzaj4zUK6ziJOo_G2lx6qf1TEktTRkFJ7T1c_fPQb', 'UQDD8dqOzaj4zUK6ziJOo_G2lx6qf1TEktTRkFJ7T1c_fKne', // Bybit
    'EQBVXzBT4lcTA3S7gxrg4hnl5fnsDKj4oNEzNp09aQxkwj1f', 'UQBVXzBT4lcTA3S7gxrg4hnl5fnsDKj4oNEzNp09aQxkwmCa', // Huobi
    'EQCA1BI4QRZ8qYmskSRDzJmkucGodYRTZCf_b9hckjla6dZl', 'UQCA1BI4QRZ8qYmskSRDzJmkucGodYRTZCf_b9hckjla6Yug', // KuCoin
]);
exports.DEFAULT_WALLET_VERSION = 'v4R2';
exports.POPULAR_WALLET_VERSIONS = ['v3R1', 'v3R2', 'v4R2'];
exports.DEFAULT_TIMEOUT = 5000;
exports.DEFAULT_RETRIES = 3;
exports.DEFAULT_ERROR_PAUSE = 200;
exports.HISTORY_PERIODS = ['1D', '7D', '1M', '3M', '1Y'];
