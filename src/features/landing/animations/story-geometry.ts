export interface StoryPoint {
  scroll: number;
  x: number;
  y: number;
  width: number;
  angle: number;
}

// Document coordinates keep the flight independent from scroll direction.
export function interpolateStory(
  points: readonly StoryPoint[],
  scroll: number,
): StoryPoint {
  const first = points[0];
  if (!first) throw new Error('A story needs at least one anchor');
  if (scroll <= first.scroll) return { ...first };
  for (let i = 1; i < points.length; i++) {
    const next = points[i];
    const previous = points[i - 1];
    if (!next || !previous || scroll > next.scroll) continue;
    const progress = Math.min(
      1,
      Math.max(
        0,
        (scroll - previous.scroll) / Math.max(1, next.scroll - previous.scroll),
      ),
    );
    return {
      scroll,
      x: previous.x + (next.x - previous.x) * progress,
      y: previous.y + (next.y - previous.y) * progress,
      width: previous.width + (next.width - previous.width) * progress,
      angle: previous.angle + (next.angle - previous.angle) * progress,
    };
  }
  return { ...points[points.length - 1]! };
}
