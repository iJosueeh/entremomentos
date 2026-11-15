import type { Story } from '../../schemas/story';
import { useLetter } from '../../hooks/use-letter';
import { X } from 'lucide-react';
import { SceneAtmosphere } from '../SceneAtmosphere';

export function LetterScene({
  id,
  content,
}: {
  id: string;
  content: Story['scenes']['letter'];
}) {
  const letter = useLetter(content);
  return (
    <section
      className="story-player__letter"
      data-scene="letter"
      aria-labelledby={id}
    >
      <SceneAtmosphere kind="letter" />
      <h2 id={id} tabIndex={-1}>
        {content.title}
      </h2>
      <div className="story-player__letter-stage" ref={letter}>
        <button
          className="story-player__envelope-button"
          type="button"
          data-letter-toggle
          aria-expanded="true"
          aria-haspopup="dialog"
          aria-controls={`${id}-dialog`}
          hidden
        >
          <span className="story-player__letter-action" data-letter-label>
            Abrir carta
          </span>
          <span
            className="story-player__envelope"
            data-letter-envelope
            aria-hidden="true"
          >
            <span className="story-player__envelope-lining" />
            <span className="story-player__envelope-flap" data-letter-flap />
            <span className="story-player__envelope-pocket" />
            <span className="story-player__envelope-seal" data-letter-seal>
              <svg viewBox="0 0 32 32" fill="none">
                <path d="M16 4v24M4 16h24M8 8l16 16M8 24 24 8" />
                <circle cx="16" cy="16" r="8" />
              </svg>
            </span>
          </span>
        </button>
        <dialog
          id={`${id}-dialog`}
          className="story-player__letter-dialog"
          data-letter-dialog
          aria-labelledby={id}
          open
        >
          <article
            id={`${id}-paper`}
            className="story-player__letter-paper"
            data-letter-paper
            aria-labelledby={id}
            tabIndex={-1}
          >
            <header className="story-player__letter-header">
              <span aria-hidden="true">Una carta para ti</span>
              <button
                className="story-player__letter-close"
                type="button"
                data-letter-close
                hidden
              >
                <X size={16} aria-hidden="true" /> Cerrar carta
              </button>
            </header>
            <div
              className="story-player__letter-body"
              data-letter-body
              role="region"
              aria-label="Texto de la carta"
              tabIndex={0}
            >
              {content.paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
              <p className="story-player__signature">{content.signature}</p>
            </div>
          </article>
        </dialog>
      </div>
    </section>
  );
}
