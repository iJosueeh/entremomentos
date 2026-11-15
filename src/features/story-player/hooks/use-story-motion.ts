import { useEffect, useState, type RefObject } from 'react';
import type { Story } from '../schemas/story';

export function useStoryMotion(
  ref: RefObject<HTMLElement | null>,
  story: Story,
  manuallyPaused: boolean,
) {
  const [motionReady, setMotionReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let generation = 0;
    let cleanup: (() => void) | undefined;
    let animationModule:
      | Promise<typeof import('../animations/create-player-animation')>
      | undefined;

    const update = async () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      setReducedMotion(preference.matches);
      if (preference.matches) {
        setMotionReady(false);
        return;
      }
      if (manuallyPaused) {
        setMotionReady(true);
        return;
      }
      try {
        // Rapid preference changes share one in-flight import per effect.
        animationModule ??= import('../animations/create-player-animation');
        const { createPlayerAnimation } = await animationModule;
        if (disposed || current !== generation) return;
        cleanup = createPlayerAnimation(root);
        setMotionReady(true);
      } catch (error: unknown) {
        animationModule = undefined;
        if (!disposed && current === generation) {
          setMotionReady(false);
          console.warn('La historia permanece en modo estático.', error);
        }
      }
    };

    const onChange = () => {
      void update();
    };
    preference.addEventListener('change', onChange);
    void update();
    return () => {
      disposed = true;
      generation++;
      preference.removeEventListener('change', onChange);
      cleanup?.();
    };
  }, [ref, story, manuallyPaused]);

  return { motionReady, reducedMotion };
}
