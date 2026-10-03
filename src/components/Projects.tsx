import { Link } from 'react-router';
import type { Project } from '../content/types';
import { getProjectLinks } from '../content/project-links';
import { Arrow, GithubIcon } from './Icon';
import styles from '../styles.module.css';
export function ProjectLinks({ project }: { project: Project }) {
  return <div className={styles.projectLinks}>{getProjectLinks(project).map((link) => <a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">{link.label === 'GitHub' && <GithubIcon />}{link.label}<Arrow diagonal /></a>)}</div>;
}
export function ProjectCard({ project, index }: { project: Project; index: number }) {
  return <article className={styles.projectCard}>
    {project.image && <img className={styles.projectImage} src={project.image.src} alt={project.image.alt} loading="lazy" />}
    <div className={styles.projectCardTop}><span className={styles.mono} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className={styles.projectGlyph} aria-hidden="true">{['{ }', '⌘', '▦', '≋', '↗', '⊞'][index % 6]}</span></div>
    <h3><Link to={`/projects/${project.slug}`}>{project.title}</Link></h3><p>{project.description}</p>
    {project.tags?.length ? <ul className={styles.tags}>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}
    <div className={styles.projectCardBottom}><ProjectLinks project={project} /><Link className={styles.detailLink} to={`/projects/${project.slug}`} aria-label={`View ${project.title}`}><Arrow /></Link></div>
  </article>;
}
