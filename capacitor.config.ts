import type { CapacitorConfig } from '@capacitor/cli';

// const { APP_ENV = 'production' } = process.env;

const config: CapacitorConfig = {
  appId: 'org.mytonwallet.app',
  appName: 'MyTonWallet',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    hostname: 'mytonwallet.local',
  },
};

export default config;
