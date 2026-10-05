import { Link, useParams } from 'react-router';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { blogPosts, formatDate, projects } from '../content';
import { ProjectLinks } from '../components/Projects';
import { Arrow } from '../components/Icon';
import styles from '../styles.module.css';

export function ProjectDetail() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return <NotFound />;
  return <article className={`${styles.container} ${styles.detailPage}`}><Link className={styles.backLink} to="/#portfolio">← Projects</Link><div className={styles.detailHeader}><span className={styles.eyebrow}>PROJECTS</span><h1>{project.title}</h1><p className={styles.detailIntro}>{project.description}</p>{project.tags?.length ? <ul className={styles.tags}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}<ProjectLinks project={project} /></div>{project.image && <img className={styles.detailImage} src={project.image.src} alt={project.image.alt} />}<div className={styles.moreProjects} data-reveal><h2>Projects</h2>{projects.filter((item) => item.slug !== slug).map((item) => <Link key={item.slug} to={`/projects/${item.slug}`}>{item.title}<Arrow /></Link>)}</div></article>;
}
export function Blog() {
  return <div className={`${styles.container} ${styles.blogPage}`}><div className={styles.pageHeading}><span className={styles.eyebrow}>ROHIT PADWAL</span><h1>Blog<span className={styles.brandDot}>.</span></h1></div>{blogPosts.length ? <div className={styles.blogList}>{blogPosts.map((post) => <article className={styles.blogCard} data-reveal key={post.slug}><div className={styles.postMeta}><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.readingTime} min read</span></div><h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.description}</p><ul className={styles.tags}>{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul><Link className={styles.textLink} to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>Read post <Arrow /></Link></article>)}</div> : <div className={styles.emptyState}><span className={styles.emptyGlyph} aria-hidden="true">[ ]</span><h2>No posts yet.</h2><p>New posts will appear here.</p><Link className={styles.textLink} to="/#portfolio">Projects<Arrow /></Link></div>}</div>;
}
export function BlogPostPage() {
  const { slug } = useParams();
  const post = blogPosts.find((item) => item.slug === slug);
  if (!post) return <NotFound />;
  return <article className={`${styles.container} ${styles.articlePage}`}><Link className={styles.backLink} to="/blog">← Blog</Link><header className={styles.articleHeader}><div className={styles.postMeta}><time dateTime={post.date}>{formatDate(post.date)}</time><span>{post.readingTime} min read</span></div><h1>{post.title}</h1><ul className={styles.tags}>{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></header><div className={styles.prose} data-reveal><Markdown remarkPlugins={[remarkGfm]} components={{ a: ({ href, children }) => <a href={href} {...(href?.startsWith('https://') || href?.startsWith('http://') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>, img: ({ src, alt }) => <img src={src} alt={alt ?? ''} loading="lazy" /> }}>{post.body}</Markdown></div><Link className={styles.textLink} to="/blog">← All posts</Link></article>;
}
export function NotFound() {
  return <div className={`${styles.container} ${styles.notFound}`}><span className={styles.eyebrow}>404</span><h1>Page not found.</h1><p>This page could not be found.</p><Link className={styles.buttonPrimary} to="/">Home<Arrow /></Link></div>;
}
