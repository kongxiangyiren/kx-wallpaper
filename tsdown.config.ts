import { defineConfig } from 'tsdown';

export default defineConfig({
  dts: {
    enabled: false
  },
  env: {
    NODE_ENV: 'development'
  },
  envFile: '.env',
  minify: true,
  platform: 'node'
  // ...config options
});
