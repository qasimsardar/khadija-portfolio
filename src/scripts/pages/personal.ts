// A short entrance settles into a gentle, staggered fan drift; each image pauses on hover.
import gsap from 'gsap';
import type { MotionCtx } from '../motion';

export default function personal(ctx: MotionCtx) {
  const stage = document.querySelector<HTMLElement>('[data-personal-collage]');
  const cards = stage?.querySelectorAll<HTMLElement>('[data-personal-card]');
  if (!stage || !cards?.length || ctx.reduced) return;

  const rotations = [-14, -6, 6, 14];
  const idleTweens: gsap.core.Tween[] = [];
  const slideClocks: gsap.core.Tween[] = [];
  const hoverHandlers: { card: HTMLElement; enter: () => void; leave: () => void }[] = [];

  gsap.fromTo(cards,
    { autoAlpha: 0, y: 46, scale: 0.92, rotation: (i) => rotations[i] + (i % 2 ? 4 : -4) },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      rotation: (i) => rotations[i],
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: { trigger: stage, start: 'top 80%', toggleActions: 'play none none none' },
      onComplete: () => {
        cards.forEach((card, i) => {
          const float = gsap.to(card, {
            y: i % 2 ? -7 : 7,
            rotation: rotations[i] + (i % 2 ? -1.3 : 1.3),
            duration: 2.8 + i * 0.32,
            delay: i * 0.18,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
          idleTweens.push(float);
          const frame = card.querySelector<HTMLElement>('[data-category-frame]');
          const slides = frame ? Array.from(frame.querySelectorAll<HTMLElement>('picture')) : [];
          let slideClock: gsap.core.Tween | undefined;
          if (slides.length > 1) {
            let current = 0;
            const showNext = async () => {
              const next = (current + 1) % slides.length;
              const nextImage = slides[next].querySelector('img');
              if (nextImage) {
                nextImage.loading = 'eager';
                await nextImage.decode().catch(() => undefined);
              }
              slides[current].setAttribute('aria-hidden', 'true');
              slides[next].setAttribute('aria-hidden', 'false');
              gsap.to(slides[current], { autoAlpha: 0, duration: 0.75, ease: 'power1.inOut' });
              gsap.to(slides[next], { autoAlpha: 1, duration: 0.75, ease: 'power1.inOut' });
              current = next;
              slideClock = gsap.delayedCall(3.4, showNext);
              slideClocks.push(slideClock);
            };
            slideClock = gsap.delayedCall(3.4 + i * 0.42, showNext);
            slideClocks.push(slideClock);
          }
          const enter = () => {
            float.pause();
            slideClock?.pause();
          };
          const leave = () => {
            float.resume();
            slideClock?.resume();
          };
          card.addEventListener('pointerenter', enter);
          card.addEventListener('pointerleave', leave);
          hoverHandlers.push({ card, enter, leave });
        });
      },
    },
  );

  ctx.onCleanup(() => {
    idleTweens.forEach((tween) => tween.kill());
    slideClocks.forEach((clock) => clock.kill());
    hoverHandlers.forEach(({ card, enter, leave }) => {
      card.removeEventListener('pointerenter', enter);
      card.removeEventListener('pointerleave', leave);
    });
  });
}
