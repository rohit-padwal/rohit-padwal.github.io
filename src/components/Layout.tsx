import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { portfolio } from '../content';
import { Arrow } from './Icon';
import styles from '../styles.module.css';
import { useScrollReveal } from './useScrollReveal';

const navigation = [
  ['Home', '/#hero'], ['About', '/#about'], ['Skills', '/#skills'], ['Education', '/#education'],
  ['Professional Experience', '/#workEx'], ['Resume', '/#myresume'], ['Projects', '/#portfolio'], ['Blog', '/blog'], ['Contact', '/#contact'],
];

export function Layout() {
  useScrollReveal();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);
  useEffect(() => { setOpen(false); }, [location]);
  useEffect(() => {
    if (!open) return;
    nav.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [open]);
  useEffect(() => {
    const changedPage = previousPath.current !== location.pathname;
    previousPath.current = location.pathname;
    const id = requestAnimationFrame(() => {
      if (location.hash) {
        let anchor = location.hash.slice(1);
        try { anchor = decodeURIComponent(anchor); } catch { /* Ignore malformed fragments. */ }
        const target = document.getElementById(anchor);
        target?.scrollIntoView({ behavior: 'instant' });
        const heading = target?.querySelector<HTMLElement>('h1, h2');
        heading?.setAttribute('tabindex', '-1');
        heading?.focus({ preventScroll: true });
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' });
        if (changedPage) document.getElementById('main')?.focus({ preventScroll: true });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [location.pathname, location.hash]);
  return <>
    <a className={styles.skipLink} href="#main">Skip to content</a>
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} to="/" aria-label="Rohit Padwal — Home"><span className={styles.monogram} aria-hidden="true">rp<span>.</span></span><span>Rohit Padwal</span></Link>
        <button ref={toggle} className={styles.menuToggle} aria-controls="site-nav" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}<span aria-hidden="true">{open ? '×' : '☰'}</span></button>
        <nav ref={nav} id="site-nav" aria-label="Main navigation" className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          {navigation.map(([label, href]) => <Link key={label} to={href} aria-current={(href === '/blog' ? location.pathname.startsWith('/blog') : location.pathname === '/' && (location.hash === href.slice(1) || (href === '/#hero' && !location.hash))) ? 'page' : undefined}>{label}</Link>)}
        </nav>
      </div>
    </header>
    <main id="main" tabIndex={-1}><Outlet /></main>
    <footer className={styles.footer}><div className={styles.container}>
      <div className={styles.footerTop}><Link className={styles.brand} to="/">Rohit Padwal<span className={styles.brandDot}>.</span></Link><a className={styles.textLink} href="/#hero">Back to top <Arrow diagonal /></a></div>
      <div className={styles.footerBottom}><span>© Copyright <strong>Rohit Padwal</strong></span><div className={styles.footerSocials}>{portfolio.socials.map((social) => <a key={social.label} href={social.url} target="_blank" rel="noopener noreferrer">{social.label === 'github' ? 'GitHub' : 'LinkedIn'} <Arrow diagonal /></a>)}</div></div>
    </div></footer>
  </>;
}
