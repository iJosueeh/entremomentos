import { gsap } from 'gsap';
import { playerMotion } from './motion';

const entered = new WeakSet<HTMLElement>();

export function createIntroAnimation(scene: HTMLElement) {
  const light = scene.querySelector('[data-intro-light]');
  const emergence = scene.querySelector('[data-intro-emergence]');
  const title = scene.querySelector('[data-intro-title]');
  if (!light || !emergence || !title) return;

  if (!entered.has(scene)) {
    entered.add(scene);
    const rect = scene.getBoundingClientRect();
    const viewport = scene.ownerDocument.defaultView?.innerHeight ?? 0;
    // Deep links and resuming decoration never replay an off-screen entrance.
    if (rect.bottom > 0 && rect.top < viewport) {
      gsap
        .timeline({ defaults: { ease: playerMotion.entrance.ease } })
        .fromTo(
          emergence,
          { opacity: 0.08, scale: 0.65 },
          {
            opacity: 1,
            scale: 1,
            duration: playerMotion.entrance.duration,
          },
          0,
        )
        .fromTo(
          title,
          { opacity: 0.78, y: playerMotion.entrance.distance },
          {
            opacity: 1,
            y: 0,
            duration: playerMotion.entrance.titleDuration,
          },
          0,
        );
    }
  }

  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: scene,
        start: 'top top',
        end: 'bottom top',
        scrub: playerMotion.intro.scrub,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      light,
      { y: 0 },
      { y: playerMotion.intro.distance, duration: 1 },
      0,
    );
}
