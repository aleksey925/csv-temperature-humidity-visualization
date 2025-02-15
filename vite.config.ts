import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
   plugins: [react()],
   base: '/home-climate-viewer/',
   server: {
      port: 3000,
   },
   build: {
      outDir: 'build',
   },
});
