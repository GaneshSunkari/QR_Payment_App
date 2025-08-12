import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['*',"a6f12352d669.ngrok-free.app"], // Allow any host to connect to the dev server
  }
});
