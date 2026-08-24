// Post-build step: generate sitemap.xml and prerender every route to static
// HTML so search engines (and users with JS still loading) get real content
// instead of an empty <div id="root">.
//
// Runs after `vite build`. Prerendering needs a local Chromium (Playwright);
// if none is available (e.g. a remote CI build) it degrades gracefully to
// sitemap-only and the site keeps working as a plain SPA.
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ORIGIN = 'https://edufly.dev';

// 1. Enumerate routes from the real content data.
const routesBundle = join(root, 'node_modules/.cache/routes-entry.mjs');
mkdirSync(dirname(routesBundle), { recursive: true });
execSync(`npx esbuild scripts/routes-entry.ts --bundle --format=esm --outfile=${routesBundle}`, {
  cwd: root,
  stdio: 'inherit',
});
const { sitemapRoutes, prerenderRoutes } = await import(pathToFileURL(routesBundle).href);
console.log(`[postbuild] ${sitemapRoutes.length} sitemap routes, ${prerenderRoutes.length} prerender routes`);

// 2. Sitemap.
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes.map((r) => `  <url><loc>${ORIGIN}${r === '/' ? '/' : r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
console.log('[postbuild] sitemap.xml written');

// 3. Prerender with Playwright (skippable).
if (process.env.PRERENDER === '0') {
  console.log('[postbuild] PRERENDER=0, skipping prerender');
  process.exit(0);
}

let chromium;
try {
  const require = createRequire(import.meta.url);
  const playwrightPath = require.resolve('playwright', {
    paths: [root, '/home/user/node_modules', process.env.HOME + '/node_modules'],
  });
  const pw = await import(pathToFileURL(playwrightPath).href);
  chromium = pw.chromium ?? pw.default?.chromium;
  if (!chromium) throw new Error('no chromium export');
} catch {
  console.warn('[postbuild] Playwright not available, skipping prerender (SPA fallback still works)');
  process.exit(0);
}

// The SPA shell for fallback serving. A fresh `vite build` leaves a clean
// index.html; if this script re-runs on an already-prerendered dist, fall
// back to the pristine copy saved on the first pass.
const shellPath = join(dist, '_shell.html');
let template = readFileSync(join(dist, 'index.html'), 'utf8');
if (template.includes('data-prerendered')) {
  template = readFileSync(shellPath, 'utf8');
} else {
  writeFileSync(shellPath, template);
}
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};

// Tiny static server with SPA fallback, serving the untouched template for
// route paths so every snapshot starts from the same clean shell.
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const file = join(dist, path);
  if (extname(path) && existsSync(file) && statSync(file).isFile()) {
    res.writeHead(200, { 'content-type': mime[extname(path)] ?? 'application/octet-stream' });
    res.end(readFileSync(file));
  } else {
    res.writeHead(200, { 'content-type': 'text/html' });
    res.end(template);
  }
});
await new Promise((r) => server.listen(0, r));
const port = server.address().port;

let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  console.warn(`[postbuild] Chromium launch failed (${e.message}), skipping prerender`);
  server.close();
  process.exit(0);
}

const context = await browser.newContext();
const results = new Map();
const failed = [];
const queue = [...prerenderRoutes];
const WORKERS = 6;

async function snapshot(page, route) {
  await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'load', timeout: 20000 });
  await page.waitForSelector('#root > *', { timeout: 15000 });
  await page.waitForTimeout(350);
  const html = await page.evaluate(() => {
    document.body.setAttribute('data-prerendered', 'true');
    return '<!doctype html>\n' + document.documentElement.outerHTML;
  });
  results.set(route, html);
}

await Promise.all(
  Array.from({ length: WORKERS }, async () => {
    const page = await context.newPage();
    for (;;) {
      const route = queue.shift();
      if (!route) break;
      try {
        await snapshot(page, route);
      } catch (e) {
        failed.push(`${route}: ${e.message.split('\n')[0]}`);
      }
    }
    await page.close();
  })
);

await browser.close();
server.close();

for (const [route, html] of results) {
  const out = route === '/' ? join(dist, 'index.html') : join(dist, route.slice(1), 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}
console.log(`[postbuild] prerendered ${results.size}/${prerenderRoutes.length} routes`);
if (failed.length) {
  console.warn('[postbuild] failed routes:\n  ' + failed.join('\n  '));
  process.exit(1);
}
