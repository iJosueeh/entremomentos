import { X } from 'lucide-react';
import type { Story } from '../../schemas/story';
import { useMemoryViewer } from '../../hooks/use-memory-viewer';
import { StoryPhoto } from '../StoryPhoto';
import { SceneAtmosphere } from '../SceneAtmosphere';

const dateFormat = new Intl.DateTimeFormat('es-PE', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function MemoriesScene({
  id,
  content,
  memories,
}: {
  id: string;
  content: Story['scenes']['memories'];
  memories: Story['memories'];
}) {
  const {
    dialog,
    memory: selectedMemory,
    openPhoto,
  } = useMemoryViewer(memories);
  return (
    <section
      className="story-player__gallery"
      data-scene="memories"
      aria-labelledby={id}
    >
      <SceneAtmosphere
        kind="memories"
        image={memories.find((memory) => memory.image)?.image}
      />
      <div className="story-player__gallery-content">
        <header className="story-player__gallery-heading">
          <h2 id={id} tabIndex={-1}>
            {content.title}
          </h2>
          {content.introduction.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </header>
        {memories.length > 0 && (
          <ol className="story-player__memories">
            {memories.map((memory, index) => (
              <li
                key={memory.id}
                className="story-player__memory"
                data-has-image={!!memory.image}
              >
                <div className="story-player__memory-copy">
                  <time dateTime={memory.date}>
                    {dateFormat.format(new Date(`${memory.date}T00:00:00Z`))}
                  </time>
                  <h3 id={`${id}-memory-${index + 1}`} tabIndex={-1}>
                    {memory.title}
                  </h3>
                  <p>{memory.message}</p>
                </div>
                {memory.image && (
                  <StoryPhoto
                    image={memory.image}
                    title={memory.title}
                    onExplore={(event) => openPhoto(event, memory)}
                  />
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
      {memories.length > 0 && (
        <dialog
          ref={dialog}
          className="story-player__viewer"
          aria-labelledby={`${id}-photo-title`}
        >
          <div
            className="story-player__viewer-shade"
            data-viewer-shade
            aria-hidden="true"
          />
          <button className="story-player__viewer-close" type="button">
            <X size={18} aria-hidden="true" /> Cerrar fotografía
          </button>
          <div className="story-player__viewer-content" data-viewer-content>
            <h3 id={`${id}-photo-title`} data-viewer-chrome>
              {selectedMemory?.title ?? 'Fotografía ampliada'}
            </h3>
            {selectedMemory?.image && (
              <>
                <StoryPhoto image={selectedMemory.image} loading="eager" />
                <p data-viewer-chrome>{selectedMemory.message}</p>
              </>
            )}
          </div>
        </dialog>
      )}
    </section>
  );
}
