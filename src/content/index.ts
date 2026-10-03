import data from './portfolio.json';
import type { BlogPost, Project } from './types';
import posts from 'virtual:blog';

export const portfolio = data;
export const projects: Project[] = data.projects;
export const blogPosts: BlogPost[] = posts;
export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}
