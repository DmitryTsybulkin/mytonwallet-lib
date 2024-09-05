import 'webpack-dev-server';

// @ts-ignore
import PreloadWebpackPlugin from '@vue/preload-webpack-plugin';
// @ts-ignore
import WebpackBeforeBuildPlugin from 'before-build-webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import dotenv from 'dotenv';
import path from 'path';
import type {Configuration} from 'webpack';
import {EnvironmentPlugin, ProvidePlugin,} from 'webpack';

import {PRODUCTION_URL} from './src/config';

dotenv.config();

// GitHub workflow uses an empty string as the default value if it's not in repository variables, so we cannot define a default value here
process.env.BASE_URL = process.env.BASE_URL || PRODUCTION_URL;

const {
  BASE_URL,
} = process.env;
const cspConnectSrcExtra = '';//`http://localhost:63342 ${process.env.CSP_CONNECT_SRC_EXTRA_URL}`;

// The `connect-src` rule contains `https:` due to arbitrary requests are needed for jetton JSON configs.
// The `img-src` rule contains `https:` due to arbitrary image URLs being used as jetton logos.
// The `media-src` rule contains `data:` because of iOS sound initialization.
const CSP = `
  default-src 'none';
  manifest-src 'self';
  connect-src 'self' https: ${cspConnectSrcExtra};
  script-src 'self' 'wasm-unsafe-eval';
  style-src 'self' https://fonts.googleapis.com/;
  img-src 'self' data: https:;
  media-src 'self' data:;
  object-src 'none';
  base-uri 'none';
  font-src 'self' https://fonts.gstatic.com/;
  form-action 'none';
  frame-src 'self' https://widget.changelly.com/`
  .replace(/\s+/g, ' ').trim();

const appVersion = require('./package.json').version;

const config: Configuration = {
    mode: 'development',
    target: 'web',
  experiments: {
      topLevelAwait: true
  },

    entry: [
      './src/index.ts',
    ],

    devServer: {
      port: 4321,
      host: '0.0.0.0',
      allowedHosts: 'all',
      hot: false,
      static: [
        {
          directory: path.resolve(__dirname, 'public'),
        },
      ],
      devMiddleware: {
        stats: {
          all: true, // Show nothing except errors & warns
          errors: true,
          warnings: true,
          moduleTrace: true,
          colors: true, // Use colors in the console
        },
      },
      headers: {
        'Content-Security-Policy': CSP,
        "Origin": "https://mytonwallet.app",
        // 'X-App-Origin': "https://mytonwallet.app"
        // "Access-Control-Allow-Origin": "*",
        // "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        // "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      },

    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true,
    },

    module: {
      rules: [
        {
          test: /\.(ts|tsx|js)$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        },
      ],
    },

    resolve: {
      extensions: ['.ts', '.js', '.tsx'],
      fallback: {
        crypto: false,
      },
      alias: {
        // It is used to remove duplicate dependencies
        'bn.js': path.join(__dirname, 'node_modules/bn.js/lib/bn.js'),
      },
    },

    plugins: [
      /* eslint-disable no-null/no-null */
      new EnvironmentPlugin({
        APP_ENV: 'development',
        APP_NAME: null,
        APP_VERSION: appVersion,
        APP_REVISION: null,
        TEST_SESSION: null,
        TONHTTPAPI_MAINNET_URL: null,
        TONHTTPAPI_MAINNET_API_KEY: null,
        TONHTTPAPI_TESTNET_URL: null,
        TONHTTPAPI_TESTNET_API_KEY: null,
        TONAPIIO_MAINNET_URL: null,
        TONAPIIO_TESTNET_URL: null,
        TONHTTPAPI_V3_MAINNET_API_KEY: null,
        TONHTTPAPI_V3_TESTNET_API_KEY: null,
        BRILLIANT_API_BASE_URL: null,
        PROXY_HOSTS: null,
        STAKING_POOLS: null,
        LIQUID_POOL: null,
        LIQUID_JETTON: null,
        IS_PACKAGED_ELECTRON: false,
        IS_ANDROID_DIRECT: false,
        ELECTRON_TONHTTPAPI_MAINNET_API_KEY: null,
        ELECTRON_TONHTTPAPI_TESTNET_API_KEY: null,
        BASE_URL,
        IS_EXTENSION: false,
        IS_FIREFOX_EXTENSION: false,
        IS_CAPACITOR: false,
        SWAP_FEE_ADDRESS: null,
      }),
      new ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
      new CopyWebpackPlugin({
        patterns: [
          // {
          //   from: 'src/extension/manifest.json',
          //   transform: (content) => {
          //     const manifest = JSON.parse(content.toString());
          //     manifest.version = appVersion;
          //     manifest.content_security_policy = {
          //       extension_pages: CSP,
          //     };
          //
          //     return JSON.stringify(manifest, undefined, 2);
          //   },
          // },
          {
            from: 'src/_headers',
            transform: (content: Buffer) => content.toString().replace('{{CSP}}', CSP),
          },
        ],
      }),
    ],
}

export default config;
