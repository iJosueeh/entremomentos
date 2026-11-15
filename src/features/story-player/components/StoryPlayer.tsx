import { useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import type { Story } from '../schemas/story';
import { useStoryMotion } from '../hooks/use-story-motion';
import { useStoryNavigation } from '../hooks/use-story-navigation';
import { StoryNavigation } from './StoryNavigation';
import { OpeningSky } from './OpeningSky';
import { IntroScene } from './scenes/IntroScene';
import { ConnectionScene } from './scenes/ConnectionScene';
import { MemoriesScene } from './scenes/MemoriesScene';
import { DiscoveryScene } from './scenes/DiscoveryScene';
import { LetterScene } from './scenes/LetterScene';
import { EpilogueScene } from './scenes/EpilogueScene';
import '../styles/player.css';

export function StoryPlayer({ story }: { story: Story }) {
  const root = useRef<HTMLElement>(null);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const { motionReady, reducedMotion } = useStoryMotion(
    root,
    story,
    manuallyPaused,
  );
  const activeScene = useStoryNavigation(root, story);
  const prefix = `story-${story.id}`;

  return (
    <article
      className="story-player"
      ref={root}
      aria-labelledby={`${prefix}-intro`}
      data-story-version={story.schemaVersion}
      data-motion-paused={manuallyPaused}
      data-reduced-motion={reducedMotion}
    >
      <div className="story-player__toolbar">
        <StoryNavigation prefix={prefix} activeScene={activeScene} />
        <div className="story-player__motion-slot">
          <button
            className="story-player__motion-control"
            type="button"
            hidden={!motionReady || reducedMotion}
            aria-pressed={manuallyPaused}
            onClick={() => setManuallyPaused((paused) => !paused)}
          >
            {manuallyPaused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
            {manuallyPaused
              ? 'Reanudar movimiento decorativo'
              : 'Pausar movimiento decorativo'}
          </button>
          <p
            className="story-player__motion-status"
            role="status"
            hidden={!reducedMotion}
          >
            Movimiento reducido activado en tu dispositivo.
          </p>
        </div>
      </div>
      <div className="story-player__opening" data-atmosphere>
        <OpeningSky />
        <IntroScene
          id={`${prefix}-intro`}
          title={story.title}
          content={story.scenes.intro}
          nextId={`${prefix}-connection`}
        />
        <ConnectionScene
          id={`${prefix}-connection`}
          content={story.scenes.connection}
        />
      </div>
      <MemoriesScene
        id={`${prefix}-memories`}
        content={story.scenes.memories}
        memories={story.memories}
      />
      <DiscoveryScene
        id={`${prefix}-discovery`}
        content={story.scenes.discovery}
        memories={story.memories}
        memoriesId={`${prefix}-memories`}
      />
      <LetterScene id={`${prefix}-letter`} content={story.scenes.letter} />
      <EpilogueScene
        id={`${prefix}-epilogue`}
        content={story.scenes.epilogue}
        introId={`${prefix}-intro`}
        memories={story.memories}
      />
    </article>
  );
}
