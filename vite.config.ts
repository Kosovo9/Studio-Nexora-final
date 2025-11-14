import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 5, // Increased from 3 to 5 for 100x optimization
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        dead_code: true,
        unused: true,
        collapse_vars: true,
        reduce_vars: true,
        inline: 3,
        join_vars: true,
        sequences: true,
        properties: true,
        evaluate: true,
        booleans: true,
        loops: true,
        if_return: true,
        conditionals: true,
        comparisons: true,
        typeofs: true,
      },
      format: {
        comments: false,
        beautify: false,
        ecma: 2022,
      },
      mangle: {
        properties: false,
        toplevel: true,
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // More aggressive code splitting for 100x optimization
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react')) {
              return 'lucide';
            }
            if (id.includes('@supabase')) {
              return 'supabase';
            }
            if (id.includes('@clerk')) {
              return 'clerk';
            }
            if (id.includes('@stripe')) {
              return 'stripe';
            }
            // Group other large dependencies
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/[name]-[hash:8].js',
        entryFileNames: 'assets/[name]-[hash:8].js',
        assetFileNames: 'assets/[name]-[hash:8].[ext]',
        compact: true,
      },
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
      },
    },
    chunkSizeWarningLimit: 500, // Reduced for stricter optimization
    target: 'es2022',
    cssCodeSplit: true,
    sourcemap: false,
    reportCompressedSize: false,
    assetsInlineLimit: 4096, // Inline small assets
    cssMinify: 'lightningcss', // Faster CSS minification
  },
  server: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    },
  },
});
