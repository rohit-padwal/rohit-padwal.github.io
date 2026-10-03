import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import matter from 'gray-matter';
import type { BlogPost } from '../src/content/types.ts';

export function parsePost(source: string, filename: string): BlogPost {
  const { data, content } = matter(source);
  const slug = filename.replace(/\.md$/, '');
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`${filename}: use a lowercase, hyphenated filename.`);
  if (typeof data.title !== 'string' || !data.title.trim()) throw new Error(`${filename}: title is required.`);
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new Error(`${filename}: date must be a real YYYY-MM-DD date.`);
  if (!Array.isArray(data.tags) || !data.tags.every((tag: unknown) => typeof tag === 'string')) throw new Error(`${filename}: tags must be an array of strings.`);
  if (data.draft !== undefined && typeof data.draft !== 'boolean') throw new Error(`${filename}: draft must be true or false.`);
  if (data.description !== undefined && typeof data.description !== 'string') throw new Error(`${filename}: description must be text.`);
  if (!content.trim()) throw new Error(`${filename}: post body is required.`);
  const plainText = content.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '$1').replace(/[#*`_>~]/g, '').replace(/\s+/g, ' ').trim();
  return { slug, title: data.title, date, tags: data.tags, description: data.description ?? plainText.slice(0, 160), readingTime: Math.max(1, Math.ceil(plainText.split(/\s+/).length / 200)), body: content, draft: data.draft ?? false };
}

export function readPosts(directory: string): BlogPost[] {
  return readdirSync(directory).filter((name) => name.endsWith('.md') && name !== 'README.md').map((name) => parsePost(readFileSync(join(directory, name), 'utf8'), name)).filter((post) => !post.draft).sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
