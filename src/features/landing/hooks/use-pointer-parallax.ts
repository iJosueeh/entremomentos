import { useEffect, type RefObject } from 'react';

export function usePointerParallax(
  ref: RefObject<HTMLElement | null>,
  paused: boolean,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root || paused) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import('../animations/create-pointer-parallax')
      .then(({ createPointerParallax }) => {
        if (!disposed) cleanup = createPointerParallax(root);
      })
      .catch((error: unknown) =>
        console.warn('Parallax no disponible.', error),
      );
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [ref, paused]);
}
