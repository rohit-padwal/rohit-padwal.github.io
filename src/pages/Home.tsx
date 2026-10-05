import { Link } from 'react-router';
import { portfolio, projects } from '../content';
import { Arrow } from '../components/Icon';
import { Section } from '../components/Section';
import { ProjectCard } from '../components/Projects';
import { ContactForm } from '../components/ContactForm';
import styles from '../styles.module.css';

function Hero() {
  return <section id="hero" className={styles.hero} aria-labelledby="hero-heading"><div className={`${styles.container} ${styles.heroGrid}`}>
    <div className={styles.heroCopy}><div className={styles.eyebrow}><span className={styles.shortRule} /> SOFTWARE ENGINEER</div><h1 id="hero-heading">Rohit<br />Padwal<span className={styles.brandDot}>.</span></h1><p className={styles.positioning}>{portfolio.positioning}</p><div className={styles.heroSpecialties}><span>Observability</span><span>AI &amp; Machine Learning</span></div>
      <div className={styles.heroActions}><a className={styles.buttonPrimary} href="#portfolio">Projects <Arrow /></a><a className={styles.buttonSecondary} href={portfolio.resume.url} target="_blank" rel="noopener noreferrer">{portfolio.resume.label}<Arrow diagonal /></a></div>
      <p className={styles.roles}>I'm {portfolio.roles.map((role, index) => <span key={role}>{index > 0 && <span aria-hidden="true"> / </span>}{role}</span>)}</p>
    </div>
    <div className={styles.heroVisual}><div className={styles.imageFrame}><img src="/assets/img/hero-bg.jpg" width="1920" height="1283" alt="Rohit Padwal in a mountain landscape" fetchPriority="high" /><div className={styles.imageCaption}><span>Rohit Padwal</span><span className={styles.mono}>Software Engineer / Traveller</span></div></div><div className={styles.visualCorner} aria-hidden="true">+</div><span className={styles.visualIndex} aria-hidden="true">01 — PORTFOLIO</span></div>
  </div><div className={`${styles.container} ${styles.heroBottom}`}><a href="#about">About <span aria-hidden="true">↓</span></a><div>{portfolio.socials.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer">{social.label === 'github' ? 'GitHub' : 'LinkedIn'}<Arrow diagonal /></a>)}</div></div></section>;
}
function About() {
  return <Section id="about" number="01" title="About"><div className={styles.aboutGrid} data-reveal><p className={styles.aboutText}>{portfolio.about}</p><div className={styles.aboutAside}><img src="/assets/img/profile-img.jpg" width="966" height="910" alt="Portrait of Rohit Padwal" loading="lazy" /><blockquote>{portfolio.quote.map((line) => <p key={line}>{line}</p>)}</blockquote></div></div></Section>;
}
function Facts() {
  return <section id="facts" className={styles.facts} aria-labelledby="facts-heading"><div className={styles.container}><div className={styles.factsHead} data-reveal><h2 id="facts-heading">Facts</h2><p>{portfolio.factsIntro}</p></div><dl className={styles.factsGrid} data-reveal>{portfolio.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value.toLocaleString('en-US')}</dd></div>)}</dl></div></section>;
}
function Experience() {
  return <Section id="workEx" number="02" title="Professional Work experience"><ol className={styles.timeline} data-reveal>{portfolio.experience.map((job, index) => <li key={`${job.company}-${job.dates}`} className={styles.timelineItem}><div className={styles.timelineDate}><span className={styles.timelineDot} aria-hidden="true" /><span>{job.dates}</span>{index === 0 && <span className={styles.current}>Present</span>}</div><div className={styles.timelineContent}><h3>{job.title}</h3><p className={styles.company}>{job.company}</p><p className={styles.location}>{job.location}</p></div></li>)}</ol></Section>;
}
function Skills() {
  return <Section id="skills" number="03" title="Skills" intro={portfolio.skillsIntro} tinted><div className={styles.skillBars} data-reveal>{portfolio.skills.map((skill) => <div className={styles.skillBar} key={skill.name}><div><span>{skill.name}</span><span className={styles.mono}>{skill.value}%</span></div><progress value={skill.value} max={100} aria-label={`${skill.name}: ${skill.value}%`} /></div>)}</div><h2 className={styles.otherSkillsHeading}>Other Skills</h2><div className={styles.skillsGrid} data-reveal>{portfolio.skillGroups.map((group, index) => <article className={styles.skillGroup} key={group.title}><span className={styles.skillIndex} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><h3>{group.title}</h3><ul className={styles.tags}>{group.items.map((skill) => <li key={skill}>{skill}</li>)}</ul></article>)}</div></Section>;
}
function Projects() {
  return <Section id="portfolio" number="04" title="Projects" intro={portfolio.projectsIntro}><div className={styles.projectsGrid} data-reveal>{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div></Section>;
}
function Education() {
  return <Section id="education" number="05" title="Education" tinted><div className={styles.educationGrid} data-reveal>{portfolio.education.map((education) => <article key={education.school} className={styles.educationCard}><p className={styles.mono}>{education.dates}</p><h3>{education.school}</h3><p className={styles.degree}>{education.degree}</p><p className={styles.grade}>{education.grade}</p><ul>{education.details.map((detail) => <li key={detail}>{detail}</li>)}</ul></article>)}</div></Section>;
}
function Resume() {
  return <section id="myresume" className={styles.resume} aria-labelledby="resume-heading"><div className={`${styles.container} ${styles.resumeInner}`} data-reveal><div><span className={styles.eyebrow}>RESUME</span><h2 id="resume-heading">{portfolio.resume.heading}</h2></div><a className={styles.buttonPrimary} href={portfolio.resume.url} title="Download Resume" target="_blank" rel="noopener noreferrer">{portfolio.resume.label}<Arrow diagonal /></a></div></section>;
}
function BlogPreview() {
  return <section className={styles.blogPreview} aria-labelledby="blog-preview-heading"><div className={`${styles.container} ${styles.blogPreviewInner}`} data-reveal><h2 id="blog-preview-heading">Blog</h2><Link className={styles.textLink} to="/blog">View blog <Arrow /></Link></div></section>;
}
function Contact() {
  return <Section id="contact" number="06" title="Contact" intro={portfolio.contactIntro}><div className={styles.contactGrid} data-reveal><div className={styles.contactInfo}><span className={styles.eyebrow}>Email:</span><a className={styles.email} href={`mailto:${portfolio.email}`}>{portfolio.email}<Arrow diagonal /></a><div className={styles.contactSocials}>{portfolio.socials.map((social) => <a className={styles.textLink} key={social.label} href={social.url} target="_blank" rel="noopener noreferrer">{social.label === 'github' ? 'GitHub' : 'LinkedIn'}<Arrow diagonal /></a>)}</div></div><ContactForm /></div></Section>;
}
export function Home() {
  return <><Hero /><About /><Facts /><Experience /><Skills /><Projects /><Education /><Resume /><BlogPreview /><Contact /></>;
}
