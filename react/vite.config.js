import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
    'process.env': {},
    // Configuration pour Render
    'process.env.REACT_APP_API_BASE': JSON.stringify(
      process.env.REACT_APP_API_BASE || 'https://gestion-clinique-backend.onrender.com'
    )
  },
  resolve: {
    alias: {
      // Polyfills for Node.js globals
      'global': 'globalThis',
      'process': 'process/browser',
      // Clean Code: Alias pour imports absolus
      '@': path.resolve(__dirname, './src'),
      '@composants': path.resolve(__dirname, './src/composants'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@utils': path.resolve(__dirname, './src/utils'),
    }
  },
  // Configuration build pour Render
  build: {
    outDir: 'build',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['sockjs-client'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/tests/',
      ]
    }
  }
})
