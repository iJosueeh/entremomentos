import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createIntroAnimation } from './create-intro-animation';
import { createConnectionAnimation } from './create-connection-animation';
import { createMemoriesAnimation } from './create-memories-animation';
import { createEpilogueAnimation } from './create-epilogue-animation';
import { observePlayerLayout } from './observe-player-layout';
import { createAtmosphereAnimation } from './create-atmosphere-animation';

export function createPlayerAnimation(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  try {
    media.add(
      '(prefers-reduced-motion: no-preference)',
      () => {
        const intro = root.querySelector<HTMLElement>('[data-scene="intro"]');
        const connection = root.querySelector<HTMLElement>(
          '[data-scene="connection"]',
        );
        const memories = root.querySelector<HTMLElement>(
          '[data-scene="memories"]',
        );
        const epilogue = root.querySelector<HTMLElement>(
          '[data-scene="epilogue"]',
        );
        const timelines = [
          intro && createIntroAnimation(intro),
          connection && createConnectionAnimation(connection),
          ...(memories ? createMemoriesAnimation(memories) : []),
          epilogue && createEpilogueAnimation(epilogue),
          ...createAtmosphereAnimation(root),
        ];
        return observePlayerLayout(root, () => {
          timelines.forEach(
            (timeline) => timeline && timeline.scrollTrigger?.refresh(),
          );
        });
      },
      root,
    );
  } catch (error) {
    media.revert();
    throw error;
  }
  return () => {
    media.revert();
  };
}
