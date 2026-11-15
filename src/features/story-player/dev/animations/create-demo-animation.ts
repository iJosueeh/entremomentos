import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from './motion';

// Called only by a React effect. SSR imports perform no browser initialization.
export function createDemoAnimation(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const context = gsap.context(() => {
    gsap.from('[data-entrance]', {
      y: motion.entrance.distance,
      opacity: 0,
      duration: motion.entrance.duration,
      ease: motion.entrance.ease,
    });
    gsap.fromTo(
      '[data-orbit]',
      { y: motion.scroll.distance },
      {
        y: -motion.scroll.distance,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: motion.scroll.scrub,
          invalidateOnRefresh: true,
        },
      },
    );
  }, root);
  return () => context.revert();
}
