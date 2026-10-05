import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Progressive enhancement: the server HTML and no-JS view are always visible.
// Only offscreen groups are hidden, and only after an observer is installed.
export function useScrollReveal() {
  const { pathname } = useLocation();
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const groups = Array.from(document.querySelectorAll<HTMLElement>('main [data-reveal]'));
    let observer: IntersectionObserver | undefined;
    const show = (element: HTMLElement) => {
      element.dataset.revealState = 'visible';
      observer?.unobserve(element);
    };
    const configure = () => {
      observer?.disconnect();
      if (media.matches || !('IntersectionObserver' in window)) {
        groups.forEach((group) => group.removeAttribute('data-reveal-state'));
        return;
      }
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => { if (entry.isIntersecting) show(entry.target as HTMLElement); });
      }, { rootMargin: '0px 0px -48px 0px', threshold: 0 });
      groups.forEach((group) => {
        if (group.getBoundingClientRect().top < window.innerHeight - 48 || group.dataset.revealState === 'visible') show(group);
        else { group.dataset.revealState = 'pending'; observer!.observe(group); }
      });
    };
    // Keyboard navigation must never land on invisible controls.
    const focus = (event: FocusEvent) => {
      const group = (event.target as HTMLElement).closest<HTMLElement>('[data-reveal]');
      if (group) show(group);
    };
    configure();
    media.addEventListener('change', configure);
    document.addEventListener('focusin', focus);
    return () => {
      observer?.disconnect();
      groups.forEach((group) => group.removeAttribute('data-reveal-state'));
      media.removeEventListener('change', configure);
      document.removeEventListener('focusin', focus);
    };
  }, [pathname]);
}
