import { useRef, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { useDemoAnimation } from '../hooks/use-demo-animation';
import type { Story } from '../schemas/story';
import '../styles/demo.css';

function AnimatedMemory({ story }: { story: Story }) {
  const root = useRef<HTMLElement>(null);
  useDemoAnimation(root);
  return (
    <section
      ref={root}
      className="memory-stage"
      aria-label="Recuerdo de demostración"
    >
      <div data-entrance>
        <p className="eyebrow">Un recuerdo · {story.memories[0]?.date}</p>
        <h2>{story.title}</h2>
        <p>{story.memories[0]?.message}</p>
      </div>
      <div className="orbit" data-orbit aria-hidden="true">
        <span />
      </div>
      <p className="scroll-note">
        Continúa bajando. La luz acompaña el recorrido.
      </p>
    </section>
  );
}

export default function MotionDemo({ story }: { story: Story }) {
  const [mounted, setMounted] = useState(true);
  return (
    <div>
      <button
        className="button"
        type="button"
        aria-pressed={mounted}
        aria-controls="animation-sample"
        onClick={() => setMounted(!mounted)}
      >
        <RotateCcw size={18} aria-hidden="true" />
        {mounted ? 'Desmontar demostración' : 'Montar demostración'}
      </button>
      <p className="status" role="status">
        {mounted ? 'Demostración montada' : 'Demostración desmontada'}
      </p>
      <div id="animation-sample">
        {mounted ? (
          <AnimatedMemory story={story} />
        ) : (
          <p className="memory-stage">
            Puedes volver a montar el recuerdo con el botón anterior.
          </p>
        )}
      </div>
    </div>
  );
}
