// Nav: translucent blurred bar once scrolled, hides while scrolling down, returns on scroll up.
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { MotionCtx } from '../motion';

export function initNav(ctx: MotionCtx) {
  const root = document.documentElement;
  root.classList.remove('nav-hidden', 'nav-scrolled');
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      root.classList.toggle('nav-scrolled', y > 40);
      // Keep the nav visible for keyboard users and while near the top.
      const focusInNav = document.activeElement?.closest('[data-nav]');
      if (ctx.reduced || focusInNav || y < 160) root.classList.remove('nav-hidden');
      else if (self.direction === 1) root.classList.add('nav-hidden');
      else root.classList.remove('nav-hidden');
    },
  });
  ctx.onCleanup(() => root.classList.remove('nav-hidden', 'nav-scrolled'));
}
