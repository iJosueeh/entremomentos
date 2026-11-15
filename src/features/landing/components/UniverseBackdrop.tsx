import { stars } from '../data/universe';

export function UniverseBackdrop() {
  return (
    <div className="universe-backdrop" aria-hidden="true">
      <div className="nebula nebula-lavender" data-nebula />
      <div className="nebula nebula-blush" data-nebula />
      {[0, 1, 2].map((layer) => (
        <div className="star-layer" data-stars key={layer}>
          {stars
            .filter((star) => star.layer === layer)
            .map((star, i) => (
              <i
                key={i}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: star.size,
                  height: star.size,
                  opacity: star.opacity,
                }}
              />
            ))}
        </div>
      ))}
    </div>
  );
}
