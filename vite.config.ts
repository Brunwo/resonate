import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon-16x16.png',
        'favicon-32x32.png',
        'favicon-48x48.png',
        'android-launcher-icon-72-72.png',
        'android-launcher-icon-96-96.png',
        'android-launcher-icon-144-144.png',
        'android-launcher-icon-192-192.png',
        'android-launcher-icon-512-512.png',
        'apple-touch-icon-120x120.png',
        'apple-touch-icon-152x152.png',
        'apple-touch-icon-167x167.png',
        'apple-touch-icon-180x180.png',
        'mstile-70x70.png',
        'mstile-150x150.png',
        'mstile-310x310.png'
      ],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  // Ensure relative paths for assets so they load correctly on GitHub Pages sub-paths
  base: './',
});
