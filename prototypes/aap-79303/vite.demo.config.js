import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// GitLab Pages serves from a subdirectory — set VITE_BASE_PATH to override.
// deploy:demo sets this to '/app/'; defaults to '/' for local preview.
const BASE_PATH = process.env.VITE_BASE_PATH ?? '/'

export default defineConfig({
  base: BASE_PATH,
  plugins: [react()],
  define: {
    'import.meta.env.VITE_DEMO_MODE': JSON.stringify('true'),
  },
  esbuild: { legalComments: 'none' },
  build: {
    outDir: 'dist-demo',
    sourcemap: false,
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      react: resolve('./node_modules/react'),
      'react-dom': resolve('./node_modules/react-dom'),
    },
  },
})
