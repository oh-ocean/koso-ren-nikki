import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Cloudflare Pages serves the site from the domain root, unlike GitHub
  // Pages which needed a /koso-ren-nikki/ subpath.
  base: '/',
  server: {
    host: true,
  },
});
