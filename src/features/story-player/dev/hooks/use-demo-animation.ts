import { useEffect, type RefObject } from 'react';

export function useDemoAnimation(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let generation = 0;
    let cleanup: (() => void) | undefined;
    const update = async () => {
      const current = ++generation;
      cleanup?.();
      cleanup = undefined;
      if (preference.matches) return;
      const { createDemoAnimation } =
        await import('../animations/create-demo-animation');
      // An import can resolve after unmount or a preference change.
      if (disposed || current !== generation) return;
      cleanup = createDemoAnimation(root);
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
  }, [ref]);
}
