import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import Sitemap from 'vite-plugin-sitemap';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';


const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    Sitemap({ hostname: 'https://simple-hostel.vercel.app' }),
    visualizer({ open: false, gzipSize: true, brotliSize: true, filename: 'stats.html' }),
    viteCompression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
    viteCompression({
      algorithm: 'brotliCompress',
      ext: '.br',
    }),
  ],
  server: {
    port: 5173,        // Frontend port (Vite default)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@types': path.resolve(__dirname, './src/types'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@providers': path.resolve(__dirname, './src/providers')
    }
  },
  build: {
    chunkSizeWarningLimit: 600,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split large libraries
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-popover',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-switch',
            '@radix-ui/react-slider',
            '@radix-ui/react-separator',
            '@radix-ui/react-label',
            '@radix-ui/react-avatar',
            '@radix-ui/react-progress',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-slot',
            'lucide-react',
            'class-variance-authority',
            'clsx',
            'tailwind-merge'
          ],
          'vendor-forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'vendor-query': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'vendor-charts': ['recharts', 'chart.js', 'react-chartjs-2'],
          'vendor-motion': ['framer-motion'],
          'vendor-pdf': ['jspdf', 'jspdf-autotable', 'html2canvas'],
          'vendor-date': ['dayjs', 'date-fns', 'react-datepicker', 'react-day-picker'],
          'vendor-table': ['react-data-table-component'],
          'vendor-misc': [
            'axios',
            'zustand',
            'react-hot-toast',
            'sonner',
            'sweetalert2',
            'embla-carousel-react',
            'react-dropzone',
            'react-select',
            'react-intersection-observer',
            'styled-components',
            'react-to-print',
            'lodash'
          ]
        }
      }
    }
  }
});