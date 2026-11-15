import { ArrowUpRight } from 'lucide-react';
import { memories } from '../data/universe';
import { Polaroid } from './Polaroid';

export function StoryActs() {
  return (
    <>
      <section
        className="story-act memory-focus"
        id="un-recuerdo"
        data-act="memory"
        aria-labelledby="memory-title"
      >
        <div className="focus-layout" data-pin-panel>
          <div className="focus-photo">
            <Polaroid memory={memories[1]} forestAnchor="memory" />
          </div>
          <div className="focus-copy">
            <h2 id="memory-title">
              Una foto guarda un instante.
              <br />
              <em>Una historia lo vuelve a encender.</em>
            </h2>
            <p className="sample-label">
              Historia ilustrativa · contenido de ejemplo
            </p>
            <blockquote>
              “No recuerdo de qué hablábamos.
              <br />
              Sí recuerdo que no quería que terminara el camino.”
            </blockquote>
            <p>
              EntreMomentos nace para convertir fotografías y palabras en
              historias interactivas que puedas compartir.
            </p>
          </div>
        </div>
      </section>
      <section
        className="story-act constellation-act"
        data-act="constellation"
        aria-labelledby="constellation-title"
      >
        <h2 id="constellation-title">
          Un recuerdo nunca
          <br />
          <em>viene solo.</em>
        </h2>
        <p className="act-intro">
          Un lugar, una frase, algo que todavía te hace sonreír.
          <br />
          Juntos encuentran su propia constelación.
        </p>
        <div className="memory-map">
          <svg
            className="memory-connections"
            viewBox="0 0 1000 700"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              data-connection
              d="M180 190 L510 315 L815 175 M510 315 L260 565 M510 315 L780 565"
            />
          </svg>
          <div className="map-node map-mountain" data-node>
            <Polaroid memory={memories[0]} />
          </div>
          <div className="map-node map-forest">
            <Polaroid memory={memories[1]} forestAnchor="constellation" />
          </div>
          <div className="map-node map-winter" data-node>
            <Polaroid memory={memories[2]} />
          </div>
          <p className="map-node map-note-one" data-node>
            Lo que todavía
            <br />
            <em>recuerdo.</em>
          </p>
          <p className="map-node map-note-two" data-node>
            Lo que me faltó
            <br />
            <em>decir.</em>
          </p>
        </div>
        <p className="sample-label">
          Tres paisajes y dos notas de ejemplo. Ningún recuerdo personal.
        </p>
      </section>
      <section
        className="story-act letter-act"
        data-act="letter"
        aria-labelledby="letter-title"
      >
        <span className="letter-thread" aria-hidden="true" />
        <div className="story-letter">
          <div className="letter-attachment">
            <Polaroid memory={memories[1]} forestAnchor="letter" />
          </div>
          <div className="story-letter-copy">
            <h2 id="letter-title">
              Tu historia
              <br />
              <em>comienza aquí.</em>
            </h2>
            <p>
              Hay recuerdos que merecen algo más que quedarse en la galería.
            </p>
            <p>Para volver a ese lugar, a esa persona, a lo que sentiste.</p>
            <a className="button" href="/demo">
              Explorar la demo <ArrowUpRight size={18} aria-hidden="true" />
            </a>
            <p className="sample-label">
              Una primera muestra técnica. EntreMomentos está en construcción.
            </p>
          </div>
        </div>
      </section>
      <p className="image-credits">
        Paisajes de ejemplo:{' '}
        <a href="https://unsplash.com/photos/_f2m3mEkaaU">Paula Vermeulen</a> y{' '}
        <a href="https://unsplash.com/photos/yNaGxHqjOuw">Ali Inay</a> /{' '}
        <a href="https://unsplash.com/license">Unsplash</a>;{' '}
        <a href="https://commons.wikimedia.org/wiki/File:Autumn_on_Ottawa_National_Forest_Road_Trip_-_Michigan_Upper_Peninsula_Fall_Colors_(29423477943).jpg">
          Tony Webster
        </a>{' '}
        / <a href="https://creativecommons.org/licenses/by/2.0/">CC BY 2.0</a>.
        Texto ilustrativo, sin testimonios.
      </p>
    </>
  );
}
