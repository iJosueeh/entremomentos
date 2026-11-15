import { useEffect, useRef, type RefObject } from 'react';

export function useLandingMotion(
  ref: RefObject<HTMLElement | null>,
  paused: boolean,
) {
  const entered = useRef(false);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.dataset.motionReady = '';
    const preserveReading = (operation: () => void) => {
      const acts = Array.from(root.querySelectorAll<HTMLElement>('[data-act]'));
      const act = acts.find(
        (act) => act.getBoundingClientRect().bottom > window.innerHeight / 2,
      );
      const anchor = act?.querySelector<HTMLElement>('[data-pin-panel]') ?? act;
      const before = anchor?.getBoundingClientRect().top;
      operation();
      if (anchor && before !== undefined)
        window.scrollBy(0, anchor.getBoundingClientRect().top - before);
    };
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([
      import('../animations/create-universe-animation'),
      import('../animations/create-story-animation'),
      document.fonts.ready,
      ...Array.from(root.querySelectorAll('img')).map((image) =>
        image.decode().catch(() => undefined),
      ),
    ])
      .then(([{ createUniverseAnimation }, { createStoryAnimation }]) => {
        if (disposed) return;
        const ambient = createUniverseAnimation(root, paused, !entered.current);
        let story: (() => void) | undefined;
        try {
          preserveReading(() => {
            story = paused ? undefined : createStoryAnimation(root);
          });
        } catch (error) {
          ambient();
          throw error;
        }
        cleanup = () => {
          story?.();
          ambient();
        };
        entered.current = true;
      })
      .catch((error: unknown) =>
        console.warn('El universo permanece en modo estático.', error),
      );
    return () => {
      disposed = true;
      preserveReading(() => cleanup?.());
      delete root.dataset.motionReady;
    };
  }, [ref, paused]);
}
