import { defineConfig, ConfigEnv, UserConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
  const config: UserConfig = {
    server: {
      host: "::",
      port: 8080,
      fs: {
        strict: true,
      }
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    
    // Add build optimization settings
    build: {
      target: 'es2015',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: [
              'react', 
              'react-dom', 
              'react-router-dom',
              '@supabase/supabase-js',
              '@tanstack/react-query'
            ],
            ui: [
              '@/components/ui',
              'lucide-react',
              'clsx',
              'tailwind-merge'
            ]
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      },
      sourcemap: mode !== 'production',
      emptyOutDir: true,
      cssCodeSplit: true,
      assetsInlineLimit: 4096, // 4kb - inline smaller assets
      reportCompressedSize: false // improves build performance
    },
    
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    // Configure asset optimization
    optimizeDeps: {
      include: [
        'react', 
        'react-dom', 
        'react-router-dom',
        '@supabase/supabase-js',
        '@tanstack/react-query'
      ],
      exclude: []
    }
  };

  // Add server middleware configuration through the correct property
  if (mode === 'development') {
    config.server = {
      ...config.server,
      middlewares: [
        (req: any, res: any, next: () => void) => {
          // Security headers
          res.setHeader('Content-Security-Policy', 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https://*.unsplash.com https://*.supabase.co; " +
            "font-src 'self'; " +
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co; " + 
            "frame-ancestors 'none'; " +
            "form-action 'self';"
          );
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.setHeader('X-Frame-Options', 'DENY');
          res.setHeader('X-XSS-Protection', '1; mode=block');
          res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
          res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
          res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
          
          // Add cache control headers for better performance
          const url = req.url;
          
          if (url && typeof url === 'string' && url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
            // Static assets cache: 7 days
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
          } else if (url && typeof url === 'string' && url.includes('assets/')) {
            // Hashed assets cache: 1 year
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else {
            // HTML and API responses: no cache
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
          }
          
          next();
        }
      ]
    };
  }

  return config;
});
