import { portfolio, projects, blogPosts } from './content';
export const siteUrl = 'https://rohit-padwal.com';
export type PageMetadata = { title: string; description: string; path: string; type: 'website' | 'article'; date?: string; tags?: string[]; noindex?: boolean };
export function getMetadata(pathname: string): PageMetadata {
  const path = pathname.replace(/\/$/, '') || '/';
  const defaults: PageMetadata = { title: portfolio.fullName, description: `${portfolio.positioning}. Rohit Padwal's experience, skills, projects, and education.`, path: '/', type: 'website' };
  if (path === '/') return defaults;
  if (path === '/blog') return { ...defaults, path, title: `Blog | ${portfolio.name}`, description: `Blog by ${portfolio.name}.` };
  const project = projects.find((item) => path === `/projects/${item.slug}`);
  if (project) return { ...defaults, path, title: `${project.title} | ${portfolio.name}`, description: project.description };
  const post = blogPosts.find((item) => path === `/blog/${item.slug}`);
  if (post) return { ...defaults, path, title: `${post.title} | ${portfolio.name}`, description: post.description, type: 'article', date: post.date, tags: post.tags };
  return { ...defaults, path, title: `Page not found | ${portfolio.name}`, description: 'This page could not be found.', noindex: true };
}
export function structuredData(meta: PageMetadata) {
  if (meta.type === 'article') return { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: meta.title.replace(` | ${portfolio.name}`, ''), description: meta.description, datePublished: meta.date, keywords: meta.tags, author: { '@type': 'Person', name: portfolio.fullName, url: siteUrl }, mainEntityOfPage: `${siteUrl}${meta.path}`, image: `${siteUrl}/assets/img/hero-bg.jpg` };
  if (meta.path === '/') return { '@context': 'https://schema.org', '@type': 'Person', name: portfolio.fullName, url: siteUrl, image: `${siteUrl}/assets/img/profile-img.jpg`, sameAs: portfolio.socials.map((item) => item.url) };
  return { '@context': 'https://schema.org', '@type': 'WebPage', name: meta.title, description: meta.description, url: `${siteUrl}${meta.path}` };
}
