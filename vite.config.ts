import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey, { cdn } from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        name: 'Okancore GeoGuessr Utils',
        namespace: 'https://github.com/canokan917/okancore-geoguessr-utils',
        version: '1.0.0',
        description: 'Draws a radius circle on the GeoGuessr guess map around the real location before guessing',
        author: 'Okancore',
        match: ['https://www.geoguessr.com/*'],
        grant: ['GM_getValue', 'GM_setValue', 'GM_addStyle', 'unsafeWindow'],
        'run-at': 'document-start',
      },
      build: {
        externalGlobals: {
          react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          'react-dom': cdn.jsdelivr('ReactDOM', 'umd/react-dom.production.min.js'),
        },
      },
    }),
  ],
});
