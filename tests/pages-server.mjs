// Local test harness emulates Pages: serve real files or the custom 404.
// It is never part of the deployed site. No SPA rewrite masks routing failures.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
const root = resolve(process.env.TEST_SITE_DIR ?? '.test-dist');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.woff': 'font/woff', '.jpg': 'image/jpeg', '.png': 'image/png', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  let path = resolve(root, '.' + decodeURIComponent(url.pathname));
  if (path !== root && !path.startsWith(root + sep)) { res.writeHead(403); res.end(); return; }
  try {
    // Force the same route through Pages' 404 for redirect coverage even though
    // known routes also have static snapshots for crawlers.
    if (url.searchParams.has('test-fallback') && url.pathname !== '/index.html') throw new Error('Simulated Pages 404');
    if ((await stat(path)).isDirectory()) path += '/index.html';
    const data = await readFile(path);
    res.writeHead(200, { 'Content-Type': mime[extname(path)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end(await readFile(resolve(root, '404.html')));
  }
}).listen(Number(process.env.TEST_PORT ?? 4175), '127.0.0.1', () => console.log(`Pages test server: ${root}`));
