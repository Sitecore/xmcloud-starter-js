'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const DESKTOP_QUERY = '(min-width: 1024px)';
const REVEAL_SELECTOR =
  '.wl-section .wl-heading, .wl-section .wl-lead, .wl-stack-card, .wl-tile, .wl-feature, .wl-card, .wl-cta__title';

const isEditing = (): boolean => !!document.querySelector('.editing-mode');

const closeAllMenus = (except?: Element | null): void => {
  document.querySelectorAll('.wl-nav__item--has-menu.is-open').forEach((item) => {
    if (item !== except) item.classList.remove('is-open');
  });
};

/**
 * Progressive enhancements for the Williams Lea demo theme (see src/assets/williamslea.css).
 * Content stays fully usable without this script; it only adds menu toggling,
 * header/stack-card scroll effects and reveal animations when `wl-` markup is present.
 */
const WilliamsLeaInteractions = (): null => {
  const pathname = usePathname();

  // Click and keyboard handling via delegation, so it survives Rich Text re-renders.
  useEffect(() => {
    const handleClick = (event: MouseEvent): void => {
      const target = event.target as Element | null;
      if (!target || isEditing()) return;

      const toggle = target.closest('.wl-nav-toggle');
      if (toggle) {
        const header = toggle.closest('.wl-header');
        const isOpen = header?.classList.toggle('wl-header--open') ?? false;
        toggle.setAttribute('aria-expanded', String(isOpen));
        return;
      }

      const menuLink = target.closest('.wl-nav__item--has-menu > .wl-nav__link');
      if (menuLink && !window.matchMedia(DESKTOP_QUERY).matches) {
        event.preventDefault();
        const item = menuLink.parentElement;
        closeAllMenus(item);
        item?.classList.toggle('is-open');
        return;
      }

      if (!target.closest('.wl-nav')) closeAllMenus();
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') return;
      closeAllMenus();
      document.querySelectorAll('.wl-header--open').forEach((header) => {
        header.classList.remove('wl-header--open');
        header.querySelector('.wl-nav-toggle')?.setAttribute('aria-expanded', 'false');
      });
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Scroll-driven effects and reveal animations, re-initialised per route.
  useEffect(() => {
    const header = document.querySelector('.wl-header');
    const stackCards = Array.from(document.querySelectorAll<HTMLElement>('.wl-stack-card'));
    if (!header && stackCards.length === 0) return;

    let frame = 0;
    const updateOnScroll = (): void => {
      frame = 0;
      header?.classList.toggle('wl-header--scrolled', window.scrollY > 10);
      stackCards.forEach((card, index) => {
        const next = stackCards[index + 1];
        if (!next) return;
        const overlap = card.getBoundingClientRect().bottom - next.getBoundingClientRect().top;
        card.classList.toggle('is-stacked', overlap > card.offsetHeight * 0.4);
      });
    };
    const handleScroll = (): void => {
      if (!frame) frame = window.requestAnimationFrame(updateOnScroll);
    };

    updateOnScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let observer: IntersectionObserver | undefined;
    if (!prefersReducedMotion && !isEditing() && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.replace('wl-reveal-pending', 'wl-reveal-done');
            observer?.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px' }
      );

      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.classList.add('wl-reveal-pending');
        observer?.observe(element);
      });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      document
        .querySelectorAll('.wl-reveal-pending')
        .forEach((element) => element.classList.remove('wl-reveal-pending'));
    };
  }, [pathname]);

  return null;
};

export default WilliamsLeaInteractions;
