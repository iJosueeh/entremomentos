import { gsap } from 'gsap';
import { playerMotion } from './motion';

export function createEpilogueAnimation(scene: HTMLElement) {
  const visual = scene.querySelector('[data-epilogue-visual]');
  const lines = scene.querySelectorAll('[data-epilogue-lines] path');
  const stars = scene.querySelectorAll('[data-epilogue-stars] circle');
  if (!visual || !lines.length || !stars.length) return;
  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: visual,
        ...playerMotion.epilogue,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      lines,
      { strokeDashoffset: 1, opacity: 0.2 },
      { strokeDashoffset: 0, opacity: 1, duration: 1, stagger: 0.12 },
      0,
    )
    .fromTo(
      stars,
      { opacity: 0.25 },
      { opacity: 1, duration: 0.4, stagger: 0.08 },
      0.2,
    );
}
