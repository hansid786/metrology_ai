import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';

function packagingApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'packaging-api-server-middleware',
    configureServer(server) {
      if (env.GEMINI_API_KEY) process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
      if (env.VITE_GEMINI_API_KEY) process.env.GEMINI_API_KEY = process.env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY;

      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/analyze-packaging') && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const parsedBody = bodyStr ? JSON.parse(bodyStr) : {};
              const mockReq: any = {
                method: req.method,
                body: parsedBody,
                headers: req.headers,
                query: {}
              };

              let statusCode = 200;
              const mockRes: any = {
                setHeader(key: string, value: string) {
                  res.setHeader(key, value);
                },
                status(code: number) {
                  statusCode = code;
                  res.statusCode = code;
                  return this;
                },
                json(data: any) {
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = statusCode;
                  res.end(JSON.stringify(data));
                },
                end() {
                  res.end();
                }
              };

              // Dynamically import the handler to avoid compile-time module resolution issues
              const module = await import('./api/analyze-packaging.ts');
              const handler = module.default || module;
              await handler(mockReq, mockRes);
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Server dev middleware error', message: err?.message }));
            }
          });
          return;
        }
        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: '/',
    plugins: [
      tailwindcss(),
      react(),
      packagingApiPlugin(env)
    ],
  };
});
