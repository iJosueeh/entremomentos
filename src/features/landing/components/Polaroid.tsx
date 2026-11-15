import { memories } from '../data/universe';

type Memory = (typeof memories)[number];
export function Polaroid({
  memory,
  forestAnchor,
  decorative = false,
}: {
  memory: Memory;
  forestAnchor?: string;
  decorative?: boolean;
}) {
  return (
    <figure
      className="polaroid"
      data-photo={forestAnchor ? undefined : ''}
      data-forest-anchor={forestAnchor}
      data-angle={forestAnchor === 'hero' ? 11 : 0}
      aria-hidden={decorative || undefined}
    >
      <img
        src={memory.src}
        srcSet={
          memory.id === 'forest'
            ? '/images/demo-forest.webp 640w, /images/demo-forest-large.webp 1280w'
            : undefined
        }
        sizes={
          memory.id === 'forest' ? '(min-width: 1024px) 560px, 85vw' : undefined
        }
        alt={decorative ? '' : memory.alt}
        width="640"
        height="440"
        decoding="async"
      />
      <figcaption>{memory.note}</figcaption>
    </figure>
  );
}
