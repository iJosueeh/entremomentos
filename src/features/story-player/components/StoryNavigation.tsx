import type { MouseEvent } from 'react';
import { sceneNavigation } from '../data/scenes';

export function StoryNavigation({
  prefix,
  activeScene,
}: {
  prefix: string;
  activeScene?: string;
}) {
  const focusHeading = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    const link = event.currentTarget;
    link.ownerDocument
      .getElementById(link.hash.slice(1))
      ?.focus({ preventScroll: true });
  };
  return (
    <nav
      className="story-player__navigation"
      aria-label="Escenas de la historia"
    >
      <ul>
        {sceneNavigation.map((scene) => (
          <li key={scene.id}>
            <a
              href={`#${prefix}-${scene.id}`}
              aria-current={activeScene === scene.id ? 'location' : undefined}
              onClick={focusHeading}
            >
              {scene.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
