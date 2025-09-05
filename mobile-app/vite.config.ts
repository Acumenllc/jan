import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'

const host = process.env.TAURI_DEV_HOST

export default defineConfig(async () => ({
  plugins: [TanStackRouterVite(), react()],
  
  // Vite options tailored for Tauri mobile development
  clearScreen: false,
  
  // Tauri expects a fixed port for mobile development
  server: {
    port: 1421,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: 'ws',
          host,
          port: 1422,
        }
      : undefined,
  },

  // Path resolution for mobile app
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Mobile-optimized build settings
  build: {
    target: ['es2021', 'chrome100', 'safari13'],
    minify: !process.env.TAURI_DEV ? 'esbuild' : false,
    sourcemap: !!process.env.TAURI_DEV,
    rollupOptions: {
      external: ['@tauri-apps/api', '@tauri-apps/plugin-os'],
    },
  },

  // Environment variables
  envPrefix: ['VITE_', 'TAURI_'],
}))