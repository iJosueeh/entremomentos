import type { Story } from '../../schemas/story';
import { ArrowUp } from 'lucide-react';
import { SceneAtmosphere } from '../SceneAtmosphere';

export function EpilogueScene({
  id,
  content,
  introId,
  memories,
}: {
  id: string;
  content: Story['scenes']['epilogue'];
  introId: string;
  memories: Story['memories'];
}) {
  return (
    <section
      className="story-player__epilogue"
      data-scene="epilogue"
      aria-labelledby={id}
    >
      <SceneAtmosphere kind="epilogue" />
      <div className="story-player__epilogue-content">
        <div
          className="story-player__final-sky"
          data-epilogue-visual
          aria-hidden="true"
        >
          <svg viewBox="0 0 600 240" fill="none">
            <ellipse
              cx="300"
              cy="120"
              rx="260"
              ry="82"
              className="story-player__celestial-orbits"
            />
            <g className="story-player__final-lines" data-epilogue-lines>
              <path pathLength="1" d="m60 156 100-84 140 60 116-90 124 110" />
              <path pathLength="1" d="m60 156 144 50 96-74 150 66 90-46" />
            </g>
            <g className="story-player__final-stars" data-epilogue-stars>
              {[
                [60, 156],
                [160, 72],
                [300, 132],
                [416, 42],
                [540, 152],
                [204, 206],
                [450, 198],
              ].map(([cx, cy], index) => (
                <circle key={index} cx={cx} cy={cy} r={index === 2 ? 5 : 2.5} />
              ))}
            </g>
          </svg>
        </div>
        {memories.length > 0 && (
          <ul
            className="story-player__echoes"
            aria-label="Recuerdos que permanecen"
          >
            {memories.slice(0, 3).map((memory) => (
              <li key={memory.id}>{memory.title}</li>
            ))}
          </ul>
        )}
        <h2 id={id} tabIndex={-1}>
          {content.title}
        </h2>
        {content.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        <a href={`#${introId}`}>
          <ArrowUp size={16} aria-hidden="true" />
          Volver al comienzo
        </a>
      </div>
    </section>
  );
}
