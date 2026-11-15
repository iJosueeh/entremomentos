import { useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';
import { UniverseBackdrop } from './UniverseBackdrop';
import { MemoryOrbit } from './MemoryOrbit';
import { StoryActs } from './StoryActs';
import { Polaroid } from './Polaroid';
import { memories } from '../data/universe';
import { useLandingMotion } from '../hooks/use-landing-motion';
import { usePointerParallax } from '../hooks/use-pointer-parallax';
import '../styles/landing.css';
import '../styles/story.css';

export function Landing() {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  useLandingMotion(ref, paused);
  usePointerParallax(ref, paused);
  return (
    <div className="living-universe" ref={ref}>
      <section
        data-act="hero"
        className="universe-hero"
        data-universe-hero
        aria-labelledby="universe-title"
      >
        <UniverseBackdrop />
        <MemoryOrbit />
        <div className="universe-copy">
          <h1 id="universe-title" data-enter>
            Hay instantes que
            <br />
            merecen <em>quedarse.</em>
          </h1>
          <p className="universe-intro" data-enter>
            Tus fotografías, tus palabras, tu historia.
            <br />
            Un pequeño universo para volver a sentir.
          </p>
          <div className="universe-actions" data-enter>
            <a className="button universe-cta" href="/demo">
              Explorar la demo <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <span className="universe-stage">
              Una primera luz. Un proyecto en construcción.
            </span>
          </div>
        </div>
        <div className="universe-caption">
          <span className="tiny-star" aria-hidden="true" />
          Universo Vivo <span className="caption-divider">/</span> Paisajes de
          ejemplo
        </div>
        <div className="hero-bottom">
          <a className="scroll-invitation" href="#un-recuerdo">
            <ArrowDown size={16} aria-hidden="true" /> Sigue el hilo
          </a>
          <button
            className="motion-control"
            type="button"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
            {paused ? 'Reanudar movimiento' : 'Pausar movimiento'}
          </button>
        </div>
      </section>
      <StoryActs />
      <div className="forest-traveler" data-traveler aria-hidden="true">
        <Polaroid memory={memories[1]} decorative />
      </div>
    </div>
  );
}
