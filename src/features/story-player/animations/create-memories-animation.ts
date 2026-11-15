import { gsap } from 'gsap';
import { playerMotion } from './motion';

export function createMemoriesAnimation(scene: HTMLElement) {
  const motion = playerMotion.memories;
  return Array.from(
    scene.querySelectorAll<HTMLElement>('[data-memory-reveal]'),
  ).map((frame) => {
    const drift = frame.querySelector('[data-memory-drift]');
    const timeline = gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: frame.parentElement,
          start: motion.start,
          end: motion.end,
          scrub: motion.scrub,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(
        frame,
        { scale: motion.initialScale, opacity: motion.initialOpacity },
        { scale: 1, opacity: 1, duration: 0.35, ease: motion.ease },
        0,
      );
    if (drift)
      timeline.fromTo(
        drift,
        { yPercent: -motion.drift, scale: motion.scale },
        { yPercent: motion.drift, scale: motion.scale, duration: 1 },
        0,
      );
    return timeline;
  });
}
