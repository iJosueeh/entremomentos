import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { universeMotion as motion } from './motion';

export function createUniverseAnimation(
  root: HTMLElement,
  paused: boolean,
  enter: boolean,
) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add(
    '(prefers-reduced-motion: no-preference)',
    () => {
      if (paused) return;
      if (enter) {
        gsap
          .timeline({
            defaults: {
              duration: motion.entrance.duration,
              ease: motion.entrance.ease,
            },
          })
          .from(root.querySelectorAll('[data-enter]'), {
            y: motion.entrance.distance,
            opacity: 0,
            stagger: motion.entrance.stagger,
          })
          .from(
            root.querySelectorAll(
              '[data-universe-hero] [data-photo]:not([data-forest-anchor])',
            ),
            {
              y: 30,
              opacity: 0,
              stagger: 0.18,
              clearProps: 'opacity,transform',
            },
            0.35,
          );
      }
      const ambient = gsap.timeline({ paused: true });
      root.querySelectorAll('[data-float]').forEach((element, i) => {
        ambient.to(
          element,
          {
            y: (i % 2 ? -1 : 1) * motion.float.distance,
            duration: motion.float.duration + i * motion.float.stagger,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          },
          0,
        );
      });
      root.querySelectorAll('[data-stars]').forEach((element, i) => {
        ambient.to(
          element,
          {
            x: (i - 1) * 9,
            y: -8 - i * 6,
            duration: motion.atmosphere.duration + i * 7,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          },
          0,
        );
      });
      root.querySelectorAll('[data-nebula]').forEach((element, i) => {
        ambient.to(
          element,
          {
            x: (i ? -1 : 1) * motion.atmosphere.distance,
            y: 12,
            duration: motion.atmosphere.duration + i * 9,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          },
          0,
        );
      });
      let visible = true;
      const sync = () => {
        if (visible && !document.hidden) ambient.play();
        else ambient.pause();
      };
      const hero = root.querySelector('[data-universe-hero]');
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry?.isIntersecting ?? false;
        sync();
      });
      if (hero) observer.observe(hero);
      document.addEventListener('visibilitychange', sync);
      sync();
      return () => {
        observer.disconnect();
        document.removeEventListener('visibilitychange', sync);
      };
    },
    root,
  );
  return () => media.revert();
}
