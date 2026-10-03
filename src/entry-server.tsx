import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { App } from './App';
import { blogPosts, projects } from './content';
import { getMetadata, structuredData } from './seo';
export const paths = ['/', '/blog', ...projects.map((project) => `/projects/${project.slug}`), ...blogPosts.map((post) => `/blog/${post.slug}`)];
export function render(path: string) {
  const metadata = getMetadata(path);
  return { html: renderToString(<StaticRouter location={path}><App /></StaticRouter>), metadata, schema: structuredData(metadata) };
}
