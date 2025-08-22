import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl'

// export default defineConfig({
  
//   server: {
//     https: true,
//     port: 5173
//   }
// })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: ['*',"7c8112eadf1a.ngrok-free.app"], // Allow any host to connect to the dev server
  }
});


// export default defineConfig({
//   plugins: [react(),basicSsl(),],
//   server: {
//     https: true,
//     host: true,
//     //  allowedHosts: ['*'],
//     port: 5175
//   }
// })
