// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://employment-management-system-backend.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    host: true, // Allow external access
    allowedHosts: [
      'employment-management-system-frontend.onrender.com',
      'employment-management-system-backend.onrender.com',
    ],
  },
});