// Tiffin: floating hero, research cards dealt into place, moodboard zoom/drift, SAATH logo drawn right to left.
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import type { MotionCtx } from '../motion';
import { DUR, EASE } from '../motion';
import { heroParallax } from './shared';

export default function tiffin(ctx: MotionCtx) {
  const { reduced } = ctx;
  heroParallax(ctx, { depth: 8 });

  // Slow float on the product shot.
  const img = document.querySelector<HTMLElement>('[data-hero-media] img');
  if (img && !reduced) gsap.to(img, { y: -10, duration: 4.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  // The ten research points are dealt from a stack like cards.
  const deal = document.querySelector<HTMLElement>('[data-deal]');
  if (deal) {
    const cards = gsap.utils.toArray<HTMLElement>(deal.children);
    if (reduced) {
      gsap.from(cards, { opacity: 0, duration: DUR.s, stagger: 0.04, scrollTrigger: { trigger: deal, start: 'top 85%', toggleActions: 'play none none none' } });
    } else {
      const box = deal.getBoundingClientRect();
      gsap.from(cards, {
        x: (i, el: HTMLElement) => box.left + box.width / 2 - (el.getBoundingClientRect().left + el.offsetWidth / 2),
        y: (i, el: HTMLElement) => box.top - el.getBoundingClientRect().top - 40,
        rotation: () => gsap.utils.random(-14, 14),
        opacity: 0,
        duration: DUR.l,
        ease: EASE.out,
        stagger: 0.07,
        scrollTrigger: { trigger: deal, start: 'top 80%', toggleActions: 'play none none none' },
      });
    }
  }

  // Moodboard: zooms out from 1.15 and drifts inside its frame as it passes.
  const mood = document.querySelector<HTMLElement>('[data-moodboard]');
  const moodMedia = mood?.querySelector<HTMLElement>('[data-moodboard-media]');
  if (mood && moodMedia && !reduced) {
    gsap.fromTo(
      moodMedia,
      { scale: 1.18, yPercent: -4 },
      { scale: 1, yPercent: 4, ease: 'none', scrollTrigger: { trigger: mood, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  }

  // SAATH: the word's letters rise, and the logo is revealed right to left (the direction Urdu is written).
  const saath = document.querySelector<HTMLElement>('[data-saath]');
  if (saath) {
    const logo = saath.querySelector<HTMLElement>('[data-saath-logo]');
    const word = saath.querySelector<HTMLElement>('[data-saath-word]');
    const tl = gsap.timeline({ scrollTrigger: { trigger: saath, start: 'top 75%', toggleActions: 'play none none none' } });
    if (logo) {
      if (reduced) tl.from(logo, { opacity: 0, duration: DUR.s });
      else tl.fromTo(logo, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.8, ease: EASE.inOut });
    }
    if (word && !reduced) {
      const split = SplitText.create(word, { type: 'chars', mask: 'chars' });
      tl.from(split.chars, { yPercent: 100, duration: DUR.m, ease: EASE.out, stagger: 0.06 }, 0.4);
    }
  }
}
