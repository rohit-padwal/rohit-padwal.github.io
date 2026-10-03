import type { ReactNode } from 'react';
import styles from '../styles.module.css';
export function Section({ id, number, title, intro, children, tinted = false }: { id: string; number: string; title: string; intro?: string; children: ReactNode; tinted?: boolean }) {
  return <section id={id} className={`${styles.section} ${tinted ? styles.tinted : ''}`} aria-labelledby={`${id}-heading`}><div className={styles.container}>
    <div className={styles.sectionHead}><span className={styles.sectionNumber} aria-hidden="true">{number} /</span><div><h2 id={`${id}-heading`}>{title}</h2>{intro && <p className={styles.intro}>{intro}</p>}</div></div>
    {children}
  </div></section>;
}
