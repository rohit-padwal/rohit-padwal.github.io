import { build } from 'vite';
import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { load } from 'cheerio';

const output = resolve(process.env.BUILD_OUT_DIR ?? 'dist');
const serverOutput = resolve('.build/server');
await build();
await build({ build: { ssr: 'src/entry-server.tsx', outDir: serverOutput, copyPublicDir: false, rollupOptions: { output: { entryFileNames: 'entry-server.js' } } } });
const { render, paths } = await import(pathToFileURL(join(serverOutput, 'entry-server.js')).href);
const template = await readFile(join(output, 'index.html'), 'utf8');
const site = 'https://rohit-padwal.com';
for (const path of paths as string[]) {
  const { html, metadata: meta, schema } = render(path);
  const $ = load(template);
  $('#root').attr('data-route', path).html(html);
  $('title').text(meta.title);
  $('meta[name="description"]').attr('content', meta.description);
  $('link[rel="canonical"]').attr('href', `${site}${path}`);
  for (const [key, value] of Object.entries({ 'og:title': meta.title, 'og:description': meta.description, 'og:url': `${site}${path}`, 'og:type': meta.type })) $(`meta[property="${key}"]`).attr('content', String(value));
  $('meta[name="twitter:title"]').attr('content', meta.title);
  $('meta[name="twitter:description"]').attr('content', meta.description);
  if (meta.date) $('<meta>').attr({ property: 'article:published_time', content: meta.date }).appendTo('head');
  for (const tag of meta.tags ?? []) $('<meta>').attr({ property: 'article:tag', content: tag }).appendTo('head');
  $('<script>').attr({ id: 'structured-data', type: 'application/ld+json' }).text(JSON.stringify(schema).replace(/</g, '\\u003c')).appendTo('head');
  const directory = path === '/' ? output : join(output, path.slice(1));
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, 'index.html'), $.html());
}
await writeFile(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${(paths as string[]).map((path) => `<url><loc>${site}${path}</loc></url>`).join('')}</urlset>`);
await writeFile(join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`);
await rm(serverOutput, { recursive: true, force: true });
console.log(`Pre-rendered ${paths.length} routes. Original CNAME, images, and resume copied unchanged.`);
