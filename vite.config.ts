import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  root: 'src',
  build: {
    outDir: '../dist',
  },
  preview: {
    port: 4000,
  },
  server: {
    port: 4000,
  },
})
