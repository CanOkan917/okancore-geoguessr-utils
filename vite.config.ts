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
        version: '1.3.0',
        description: 'GeoGuessr training tools: circle, lat/lng lines, area bands, and street view hider — all toggleable from a draggable panel',
        author: 'Okancore',
        match: ['https://www.geoguessr.com/*'],
        updateURL: 'https://raw.githubusercontent.com/canokan917/okancore-geoguessr-utils/main/dist/okancore-geoguessr-utils.user.js',
        downloadURL: 'https://raw.githubusercontent.com/canokan917/okancore-geoguessr-utils/main/dist/okancore-geoguessr-utils.user.js',
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
