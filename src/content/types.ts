export interface Project {
  slug: string;
  title: string;
  description: string;
  githubUrl?: string;
  liveDemoUrl?: string;
  image?: { src: string; alt: string };
  tags?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  readingTime: number;
  body: string;
  draft: boolean;
}
