import type { Story } from '../../schemas/story';
import { ConnectionConstellation } from '../ConnectionConstellation';

export function ConnectionScene({
  id,
  content,
}: {
  id: string;
  content: Story['scenes']['connection'];
}) {
  return (
    <section
      className="story-player__connection"
      data-scene="connection"
      aria-labelledby={id}
    >
      <div className="story-player__connection-content">
        <h2 id={id} tabIndex={-1}>
          {content.title}
        </h2>
        {content.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
      <ConnectionConstellation id={id} />
      <div className="story-player__afterglow" aria-hidden="true" />
    </section>
  );
}
