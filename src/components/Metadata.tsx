import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { getMetadata, siteUrl, structuredData } from '../seo';
export function Metadata() {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = getMetadata(pathname);
    document.title = meta.title;
    const setMeta = (key: string, value: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element); }
      element.content = value;
    };
    setMeta('description', meta.description);
    setMeta('robots', meta.noindex ? 'noindex,follow' : 'index,follow');
    for (const [key, value] of Object.entries({ 'og:title': meta.title, 'og:description': meta.description, 'og:url': `${siteUrl}${meta.path}`, 'og:type': meta.type })) setMeta(key, value, true);
    setMeta('twitter:title', meta.title);
    setMeta('twitter:description', meta.description);
    document.head.querySelector('meta[property="article:published_time"]')?.remove();
    document.head.querySelectorAll('meta[property="article:tag"]').forEach((tag) => tag.remove());
    if (meta.date) setMeta('article:published_time', meta.date, true);
    for (const tag of meta.tags ?? []) { const element = document.createElement('meta'); element.setAttribute('property', 'article:tag'); element.content = tag; document.head.append(element); }
    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `${siteUrl}${meta.path}`;
    document.getElementById('structured-data')?.remove();
    const schema = document.createElement('script'); schema.id = 'structured-data'; schema.type = 'application/ld+json'; schema.textContent = JSON.stringify(structuredData(meta)); document.head.append(schema);
  }, [pathname]);
  return null;
}
