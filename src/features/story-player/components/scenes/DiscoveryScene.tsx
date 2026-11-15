import type { Story } from '../../schemas/story';
import { SceneAtmosphere } from '../SceneAtmosphere';

export function DiscoveryScene({
  id,
  content,
  memories,
  memoriesId,
}: {
  id: string;
  content: Story['scenes']['discovery'];
  memories: Story['memories'];
  memoriesId: string;
}) {
  return (
    <section
      className="story-player__discovery"
      data-scene="discovery"
      aria-labelledby={id}
    >
      <SceneAtmosphere kind="discovery" />
      <h2 id={id} tabIndex={-1}>
        {content.title}
      </h2>
      {content.paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
      {memories.length > 0 && (
        <details className="story-player__threads">
          <summary>Seguir el hilo de los recuerdos</summary>
          <ol>
            {memories.map((memory, index) => (
              <li key={memory.id}>
                <a href={`#${memoriesId}-memory-${index + 1}`}>
                  {memory.title}
                </a>
              </li>
            ))}
          </ol>
        </details>
      )}
    </section>
  );
}
