import type { Story } from '../../schemas/story';
import { ArrowDown } from 'lucide-react';

export function IntroScene({
  id,
  title,
  content,
  nextId,
}: {
  id: string;
  title: string;
  content: Story['scenes']['intro'];
  nextId: string;
}) {
  return (
    <section
      className="story-player__intro"
      data-scene="intro"
      aria-labelledby={id}
    >
      <div className="story-player__dawn" aria-hidden="true">
        <div className="story-player__intro-light" data-intro-light>
          <div className="story-player__light-emergence" data-intro-emergence>
            <span className="story-player__light-halo" />
            <span className="story-player__light-core" />
            <span className="story-player__light-ray" />
          </div>
        </div>
      </div>
      <div className="story-player__intro-content">
        <h1 id={id} tabIndex={-1} data-intro-title>
          {title}
        </h1>
        <div className="story-player__intro-message">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
        <a className="story-player__begin" href={`#${nextId}`}>
          Seguir el camino <ArrowDown size={16} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
