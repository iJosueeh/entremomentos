import type { MouseEventHandler } from 'react';
import { Expand } from 'lucide-react';
import type { StoryImage } from '../schemas/media';

export function StoryPhoto({
  image,
  onExplore,
  title,
  loading = 'lazy',
}: {
  image: StoryImage;
  onExplore?: MouseEventHandler<HTMLAnchorElement>;
  title?: string;
  loading?: 'eager' | 'lazy';
}) {
  const photograph = (
    <img
      src={image.src}
      alt={image.alt}
      width={image.width}
      height={image.height}
      loading={loading}
      decoding="async"
    />
  );
  return (
    <figure className="story-player__photo">
      {onExplore ? (
        <div data-memory-reveal>
          <a
            className="story-player__photo-link"
            href={image.src}
            onClick={onExplore}
            aria-label={`Ampliar fotografía: ${title}`}
          >
            <span className="story-player__photo-window">
              <span data-memory-drift>{photograph}</span>
            </span>
            <span className="story-player__photo-action" aria-hidden="true">
              <Expand size={16} /> Ampliar
            </span>
          </a>
        </div>
      ) : (
        photograph
      )}
      {image.credit && (
        <figcaption>
          Fotografía: <a href={image.credit.sourceUrl}>{image.credit.author}</a>
          {' · '}
          <a href={image.credit.licenseUrl}>{image.credit.license}</a>
        </figcaption>
      )}
    </figure>
  );
}
