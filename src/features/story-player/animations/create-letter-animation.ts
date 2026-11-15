import { gsap } from 'gsap';
import { playerMotion } from './motion';

export function createLetterAnimation(
  root: HTMLElement,
  settled: (open: boolean) => void,
) {
  const context = gsap.context(() => {}, root);
  let timeline: gsap.core.Timeline;
  const dialog = root.querySelector<HTMLElement>('[data-letter-dialog]')!;
  const envelope = root.querySelector<HTMLElement>('[data-letter-envelope]')!;
  // Measure in viewport coordinates: the native modal escapes transformed ancestors.
  const origin = () => {
    const source = envelope.getBoundingClientRect();
    const target = dialog.getBoundingClientRect();
    return {
      x: source.left + source.width / 2 - (target.left + target.width / 2),
      y: source.top + source.height / 2 - (target.top + target.height / 2),
      scale: Math.min(0.85, (source.width * 0.85) / (target.width || 1)),
      rise: source.height * 0.3,
    };
  };
  try {
    context.add(() => {
      timeline = gsap.timeline({
        paused: true,
        defaults: { ease: playerMotion.letter.ease },
        onComplete: () => settled(true),
        onReverseComplete: () => settled(false),
      });
      timeline
        .fromTo(
          '[data-letter-seal]',
          { opacity: 1 },
          { opacity: 0, duration: 0.12 },
          0,
        )
        .fromTo(
          '[data-letter-flap]',
          { rotationX: 0 },
          { rotationX: -180, duration: playerMotion.letter.flap },
          0,
        )
        .fromTo(
          '[data-letter-dialog]',
          { '--letter-dim': 0 },
          { '--letter-dim': 0.58, duration: playerMotion.letter.paper },
          0,
        )
        .fromTo(
          '[data-letter-paper]',
          {
            x: () => origin().x,
            y: () => origin().y,
            scale: () => origin().scale,
            opacity: 0,
            clipPath: 'inset(40% 0% 40% 0%)',
          },
          {
            x: () => origin().x,
            y: () => origin().y - origin().rise,
            scale: () => origin().scale,
            opacity: 1,
            duration: 0.22,
          },
          playerMotion.letter.flap,
        )
        .to('[data-letter-paper]', {
          x: 0,
          y: 0,
          scale: 1,
          clipPath: 'inset(-12% -12% -12% -12%)',
          duration: playerMotion.letter.paper,
        });
    });
  } catch (error) {
    context.revert();
    throw error;
  }
  const refresh = (open: boolean) => {
    // Render both ends after invalidation, including fromTo values before its start.
    timeline
      .pause()
      .invalidate()
      .progress(1, true)
      .progress(open ? 1 : 0, true);
  };
  return {
    move(open: boolean, instant = false) {
      if (instant) refresh(open);
      else if (timeline.progress() === (open ? 1 : 0)) {
        timeline.pause();
        settled(open);
      } else if (open) {
        if (timeline.progress() === 0) refresh(false);
        timeline.timeScale(1).play();
      } else timeline.timeScale(playerMotion.letter.closeSpeed).reverse();
    },
    refresh,
    revert: () => context.revert(),
  };
}
