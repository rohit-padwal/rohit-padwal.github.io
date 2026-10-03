import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { readPosts } from './build/content.ts';

function contentPlugin(): Plugin {
  const directory = resolve(process.env.BLOG_CONTENT_DIR ?? 'content/blog');
  return {
    name: 'markdown-content',
    resolveId(id) { if (id === 'virtual:blog') return '\0virtual:blog'; },
    load(id) { if (id === '\0virtual:blog') return `export default ${JSON.stringify(readPosts(directory))}`; },
    configureServer(server) {
      server.watcher.add(directory);
      const reload = (file: string) => {
        if (!file.startsWith(directory)) return;
        const module = server.moduleGraph.getModuleById('\0virtual:blog');
        if (module) server.moduleGraph.invalidateModule(module);
        server.ws.send({ type: 'full-reload' });
      };
      server.watcher.on('add', reload).on('change', reload).on('unlink', reload);
      // Original assets remain the single source of truth, in development too.
      server.middlewares.use((request, _response, next) => {
        if (request.url?.startsWith('/resume/') || request.url?.startsWith('/assets/img/')) request.url = `/@fs/${resolve('.')}${request.url}`;
        next();
      });
    },
  };
}

function originalAssets(): Plugin {
  let output = '';
  let ssr = false;
  return {
    name: 'preserve-original-assets',
    configResolved(config) { output = resolve(config.build.outDir); ssr = Boolean(config.build.ssr); },
    closeBundle() {
      if (ssr) return;
      mkdirSync(resolve(output, 'assets'), { recursive: true });
      cpSync('assets/img', resolve(output, 'assets/img'), { recursive: true });
      cpSync('resume', resolve(output, 'resume'), { recursive: true });
      cpSync('CNAME', resolve(output, 'CNAME'));
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), contentPlugin(), originalAssets()],
  build: { outDir: process.env.BUILD_OUT_DIR ?? 'dist' },
});
