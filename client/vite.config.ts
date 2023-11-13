import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import Svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      babel: {
        plugins: [
          'babel-plugin-styled-components'
        ]
      }
    }),
    Svgr()
  ],
  build: {
    outDir: 'build'
  },
  server: {
    port: 3010
  },
  publicDir: 'public',
})
