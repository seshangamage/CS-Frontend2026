import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://sheshanbackend-dbe6etbva0bchbhy.canadacentral-01.azurewebsites.net',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})