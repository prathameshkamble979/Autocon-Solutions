import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // By default, Vite doesn't include shims for NodeJS/
    // necessary for styled-components + some other libs
    global: 'window',
  },
  resolve: {
    alias: {
      // maintain compatibility with some libraries expecting these
    },
  },
})
