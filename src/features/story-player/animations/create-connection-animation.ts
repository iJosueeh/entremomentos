import { gsap } from 'gsap';
import { playerMotion } from './motion';

export function createConnectionAnimation(scene: HTMLElement) {
  const visual = scene.querySelector('[data-connection-visual]');
  const first = scene.querySelector('[data-connection-light="first"]');
  const second = scene.querySelector('[data-connection-light="second"]');
  const lines = scene.querySelectorAll('[data-connection-lines] path');
  const nodes = scene.querySelector('[data-connection-nodes]');
  const glow = scene.querySelector('[data-connection-glow]');
  if (!visual || !first || !second || !lines.length || !nodes || !glow) return;

  return gsap
    .timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: visual,
        start: playerMotion.connection.start,
        end: playerMotion.connection.end,
        scrub: playerMotion.connection.scrub,
        invalidateOnRefresh: true,
      },
    })
    .fromTo(
      first,
      { ...playerMotion.connection.first, opacity: 0.15 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.45,
      },
      0,
    )
    .fromTo(
      second,
      { ...playerMotion.connection.second, opacity: 0.15 },
      {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 0.45,
      },
      0,
    )
    .fromTo(
      lines,
      { strokeDashoffset: 1, opacity: 0 },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 0.5,
      },
      0.35,
    )
    .fromTo(nodes, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.5)
    .fromTo(
      glow,
      { opacity: 0.12, scale: 0.85 },
      {
        opacity: 0.7,
        scale: 1,
        duration: 0.8,
      },
      0.2,
    );
}
