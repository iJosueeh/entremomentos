import { describe, expect, it } from 'vitest';
import {
  interpolateStory,
  type StoryPoint,
} from '../src/features/landing/animations/story-geometry';
import { storyMotion } from '../src/features/landing/animations/motion';
const points: StoryPoint[] = [
  { scroll: 0, x: 100, y: 300, width: 140, angle: 11 },
  { scroll: 1000, x: 300, y: 1400, width: 500, angle: 0 },
  { scroll: 1468, x: 300, y: 1868, width: 500, angle: 0 },
  { scroll: 2200, x: 600, y: 2600, width: 220, angle: 0 },
];
describe('continuous forest geometry', () => {
  it('matches each anchor exactly in either scroll direction', () => {
    for (const point of [...points, ...points.slice().reverse()])
      expect(interpolateStory(points, point.scroll)).toEqual(point);
  });
  it('holds the viewport position throughout the pin interval', () => {
    for (const scroll of [1000, 1100, 1300, 1468]) {
      const frame = interpolateStory(points, scroll);
      expect(frame.y - scroll).toBe(400);
      expect(frame.width).toBe(500);
    }
  });
  it('has continuous boundaries without geometry jumps', () => {
    for (const point of points.slice(1, -1)) {
      const before = interpolateStory(points, point.scroll - 0.001);
      const after = interpolateStory(points, point.scroll + 0.001);
      expect(Math.abs(after.x - before.x)).toBeLessThan(0.01);
      expect(Math.abs(after.y - before.y)).toBeLessThan(0.01);
    }
  });
  it('clamps overscroll and rejects a missing anchor set', () => {
    expect(interpolateStory(points, -100)).toEqual(points[0]);
    expect(interpolateStory(points, 9999)).toEqual(points.at(-1));
    expect(() => interpolateStory([], 0)).toThrow();
  });
  it('reserves the brief pin for large, tall viewports', () => {
    expect(storyMotion.desktop).toBe(
      '(min-width: 1024px) and (min-height: 720px)',
    );
    expect(storyMotion.pinViewport).toBe(0.65);
  });
});
