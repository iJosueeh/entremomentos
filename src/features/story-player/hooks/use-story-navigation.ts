import { useEffect, useState, type RefObject } from 'react';
import type { Story } from '../schemas/story';

export function useStoryNavigation(
  ref: RefObject<HTMLElement | null>,
  story: Story,
) {
  const [activeScene, setActiveScene] = useState<string>();
  useEffect(() => {
    const root = ref.current;
    if (!root || !('IntersectionObserver' in window)) return;
    const scenes = Array.from(
      root.querySelectorAll<HTMLElement>('[data-scene]'),
    );
    let disposed = false;
    let observer: IntersectionObserver | undefined;
    const observe = () => {
      observer?.disconnect();
      // Pixel margins keep the reading band independent of viewport width.
      const half = Math.max(0, Math.floor(window.innerHeight / 2) - 1);
      observer = new IntersectionObserver(
        (entries) => {
          if (disposed) return;
          const scene = entries.find((entry) => entry.isIntersecting);
          if (scene)
            setActiveScene((scene.target as HTMLElement).dataset.scene);
        },
        { rootMargin: `-${half}px 0px -${half}px 0px` },
      );
      scenes.forEach((scene) => observer?.observe(scene));
    };
    setActiveScene(undefined);
    observe();
    window.addEventListener('resize', observe);
    return () => {
      disposed = true;
      observer?.disconnect();
      window.removeEventListener('resize', observe);
    };
  }, [ref, story]);
  return activeScene;
}
