export function ConnectionConstellation({ id }: { id: string }) {
  return (
    <div
      className="story-player__encounter"
      data-connection-visual
      aria-hidden="true"
    >
      <div className="story-player__encounter-glow" data-connection-glow />
      <svg viewBox="0 0 640 560" fill="none" focusable="false">
        <defs>
          <radialGradient id={`${id}-warm`}>
            <stop stopColor="var(--color-blush)" stopOpacity="0.5" />
            <stop offset="1" stopColor="var(--color-blush)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-cool`}>
            <stop stopColor="var(--color-lavender)" stopOpacity="0.45" />
            <stop
              offset="1"
              stopColor="var(--color-lavender)"
              stopOpacity="0"
            />
          </radialGradient>
        </defs>
        <g className="story-player__celestial-orbits">
          <circle cx="320" cy="280" r="216" />
          <circle cx="320" cy="280" r="156" strokeDasharray="1 12" />
          <path d="M58 280h24m476 0h24M320 18v24m0 476v24" />
        </g>
        <g className="story-player__constellation-lines" data-connection-lines>
          <path pathLength="1" d="M168 316 258 246 352 294 402 160 478 188" />
          <path pathLength="1" d="M258 246 228 134M352 294 434 406" />
        </g>
        <g className="story-player__constellation-nodes" data-connection-nodes>
          <circle cx="258" cy="246" r="3" />
          <circle cx="352" cy="294" r="3" />
          <circle cx="402" cy="160" r="3" />
          <circle cx="228" cy="134" r="2" />
          <circle cx="434" cy="406" r="2" />
        </g>
        <g data-connection-light="first">
          <circle cx="168" cy="316" r="90" fill={`url(#${id}-warm)`} />
          <circle
            className="story-player__light-ring"
            cx="168"
            cy="316"
            r="16"
          />
          <circle cx="168" cy="316" r="5" fill="var(--color-ivory)" />
          <path className="story-player__star-rays" d="M168 300v32m-16-16h32" />
        </g>
        <g data-connection-light="second">
          <circle cx="478" cy="188" r="100" fill={`url(#${id}-cool)`} />
          <circle
            className="story-player__light-ring"
            cx="478"
            cy="188"
            r="20"
          />
          <circle cx="478" cy="188" r="5" fill="var(--color-ivory)" />
          <path className="story-player__star-rays" d="M478 169v38m-19-19h38" />
        </g>
      </svg>
    </div>
  );
}
