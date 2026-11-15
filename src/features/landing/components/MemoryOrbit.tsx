import { memories } from '../data/universe';
import { Polaroid } from './Polaroid';

export function MemoryOrbit() {
  return (
    <div
      className="memory-orbit"
      aria-label="Tres paisajes de ejemplo"
      role="group"
    >
      <div className="celestial-orbit orbit-outer" aria-hidden="true" />
      <div className="celestial-orbit orbit-inner" aria-hidden="true" />
      <div className="orbit-light" aria-hidden="true" />
      {memories.map((memory) => (
        <div className={`memory-position memory-${memory.id}`} key={memory.id}>
          <div
            data-parallax={memory.id === 'forest' ? undefined : memory.depth}
          >
            <div data-float={memory.id === 'forest' ? undefined : ''}>
              <Polaroid
                memory={memory}
                forestAnchor={memory.id === 'forest' ? 'hero' : undefined}
              />
            </div>
          </div>
        </div>
      ))}
      <span className="orbit-spark spark-one" aria-hidden="true" />
      <span className="orbit-spark spark-two" aria-hidden="true" />
    </div>
  );
}
