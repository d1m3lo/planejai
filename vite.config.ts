import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'gemini-dev-proxy',
        configureServer(server) {
          server.middlewares.use('/api/gemini', async (req: any, res: any) => {
            if (!env.VITE_GEMINI_API_KEY) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'VITE_GEMINI_API_KEY não configurada.' }));
              return;
            }

            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.end('Method not allowed');
              return;
            }

            const chunks: Buffer[] = [];
            req.on('data', (chunk: Buffer | string) => {
              chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
            });

            req.on('end', async () => {
              const body = Buffer.concat(chunks).toString('utf8');

              try {
                const upstreamResponse = await fetch(
                  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${env.VITE_GEMINI_API_KEY}`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body,
                  },
                );

                const responseText = await upstreamResponse.text();
                res.statusCode = upstreamResponse.status;
                res.setHeader(
                  'Content-Type',
                  upstreamResponse.headers.get('content-type') ?? 'application/json',
                );
                res.end(responseText);
              } catch (error) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    error: error instanceof Error ? error.message : 'Erro desconhecido',
                  }),
                );
              }
            });
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});
