import { gsap } from 'gsap';
import { playerMotion } from './motion';

// Owned by the player's existing matchMedia: no independent loops or scroll listeners.
export function createAtmosphereAnimation(root: HTMLElement) {
  const motion = playerMotion.atmosphere;
  return Array.from(
    root.querySelectorAll<HTMLElement>('[data-atmosphere]'),
  ).map((atmosphere) =>
    gsap
      .timeline({
        scrollTrigger: {
          trigger: atmosphere.closest('[data-scene]') ?? atmosphere,
          start: motion.start,
          end: motion.end,
          scrub: motion.scrub,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(
        atmosphere.querySelector('[data-atmosphere-layer]'),
        { y: -motion.distance, opacity: 0.65 },
        { y: motion.distance, opacity: 1, ease: 'none', duration: 1 },
        0,
      ),
  );
}
