import { gsap } from 'gsap';
import { universeMotion } from './motion';

export function createPointerParallax(root: HTMLElement) {
  const media = gsap.matchMedia();
  media.add(
    '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
    () => {
      const hero = root.querySelector<HTMLElement>('[data-universe-hero]');
      if (!hero) return;
      const layers = Array.from(
        hero.querySelectorAll<HTMLElement>('[data-parallax]'),
      ).map((element) => ({
        depth: Number(element.dataset.parallax),
        x: gsap.quickTo(element, 'x', universeMotion.pointer),
        y: gsap.quickTo(element, 'y', universeMotion.pointer),
      }));
      let bounds = hero.getBoundingClientRect();
      const measure = () => {
        bounds = hero.getBoundingClientRect();
      };
      const move = (event: PointerEvent) => {
        if (window.scrollY > hero.offsetHeight * 0.2) {
          reset();
          return;
        }
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        layers.forEach((layer) => {
          layer.x(x * layer.depth);
          layer.y(y * layer.depth);
        });
      };
      const reset = () =>
        layers.forEach((layer) => {
          layer.x(0);
          layer.y(0);
        });
      hero.addEventListener('pointerenter', measure);
      hero.addEventListener('pointermove', move);
      hero.addEventListener('pointerleave', reset);
      window.addEventListener('resize', measure);
      window.addEventListener('scroll', measure, { passive: true });
      return () => {
        hero.removeEventListener('pointerenter', measure);
        hero.removeEventListener('pointermove', move);
        hero.removeEventListener('pointerleave', reset);
        window.removeEventListener('resize', measure);
        window.removeEventListener('scroll', measure);
      };
    },
    root,
  );
  return () => media.revert();
}
