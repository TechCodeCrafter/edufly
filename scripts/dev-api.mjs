// Local-only dev server that mounts the Vercel function at /api/interview
// so we can QA the real end-to-end AI flow without `vercel dev`.
// Run with: node --import tsx scripts/dev-api.mjs
import http from 'node:http';
import handler from '../api/interview.ts';

const PORT = 8787;

const server = http.createServer(async (req, res) => {
  // basic CORS for local cross-port testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (!req.url?.startsWith('/api/interview')) {
    res.statusCode = 404;
    res.end('not found');
    return;
  }
  let raw = '';
  for await (const chunk of req) raw += chunk;
  // Shim the Vercel req/res shape used by the handler.
  const vReq = { method: req.method, body: raw };
  const vRes = {
    statusCode: 200,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      res.statusCode = this.statusCode;
      res.setHeader('content-type', 'application/json');
      res.end(JSON.stringify(obj));
    },
  };
  await handler(vReq, vRes);
});

server.listen(PORT, () => console.log(`dev-api listening on http://localhost:${PORT}`));
