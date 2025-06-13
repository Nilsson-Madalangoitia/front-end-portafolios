// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    open: true,           // Abre el navegador automáticamente al iniciar
    port: 5173,           // Puedes cambiar esto si el puerto está ocupado
    proxy: {
      '/api': {
        target: 'https://bkportafolio.fly.dev', // URL del backend desplegado
        changeOrigin: true,
        secure: false, // en caso de problemas con HTTPS en desarrollo
        rewrite: path => path.replace(/^\/api/, '/api'), // Mantiene el prefijo
      },
    },
  },
   resolve: {
    alias: {
      '@': '/src',
    },
  },
  base: '/', // muy importante para producción en Fly.io
});