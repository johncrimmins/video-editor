import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config
// Electron Forge Vite plugin expects renderer output at .vite/renderer/{name}/
// where {name} matches the renderer name in forge.config.js (main_window)
export default defineConfig({
  plugins: [react()],
  root: '.',
  base: './',
  build: {
    // Output directly to where Electron Forge expects it
    // This matches the structure: .vite/renderer/main_window/
    outDir: '.vite/renderer/main_window',
    emptyOutDir: true
  }
});
