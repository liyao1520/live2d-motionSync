import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
export default defineConfig({
  plugins: [react()],
  publicDir: fileURLToPath(new URL('../../docs/public', import.meta.url)),
  server: { port: 5173, strictPort: true },
});
