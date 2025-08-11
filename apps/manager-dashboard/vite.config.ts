import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@gas-station/types': path.resolve(__dirname, '../../packages/types/src'),
      '@gas-station/ui-components': path.resolve(__dirname, '../../packages/ui-components/src'),
    },
  },
  server: {
    port: 3002,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})