// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@arcgis/core'],
  },
  build: {
    rollupOptions: {
      output: {
        intro: 'define.amd = undefined;',
      },
    },
  },
});
