/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Vite usa este plugin para compilar JSX/TSX de React.
  plugins: [react()],
  // Configuracion del entorno de testing del frontend.
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
