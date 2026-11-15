import { gsap } from 'gsap';
import { describe, expect, it, vi } from 'vitest';
import { createLetterAnimation } from '../src/features/story-player/animations/create-letter-animation';

// Real GSAP timelines on numeric objects; this proves reversal, not browser 3D rendering.
function fixture() {
  const paper = {
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
  };
  const flap = { rotationX: 0 };
  const envelope = { y: 0, scale: 1 };
  const seal = { opacity: 1 };
  const dim = { '--letter-dim': 0.58 };
  const source = { left: 500, top: 400, width: 320, height: 200 };
  const target = { left: 420, top: 40, width: 600, height: 800 };
  const targets: Record<string, object[]> = {
    '[data-letter-paper]': [paper],
    '[data-letter-flap]': [flap],
    '[data-letter-envelope]': [envelope],
    '[data-letter-seal]': [seal],
    '[data-letter-dialog]': [dim],
  };
  const root = {
    querySelectorAll: (selector: string) => targets[selector] ?? [],
    querySelector: (selector: string) => ({
      getBoundingClientRect: () =>
        selector === '[data-letter-envelope]' ? source : target,
    }),
  } as unknown as HTMLElement;
  const spy = vi.spyOn(gsap, 'timeline');
  const settled = vi.fn();
  const animation = createLetterAnimation(root, settled);
  const timeline = spy.mock.results[0]!.value as gsap.core.Timeline;
  spy.mockRestore();
  return {
    paper,
    flap,
    envelope,
    seal,
    animation,
    timeline,
    settled,
    source,
    target,
  };
}

describe('letter reversible timeline (real GSAP)', () => {
  it('opens, reverses midway in both directions and returns to the same closed endpoint', () => {
    const f = fixture();
    f.animation.move(true);
    f.timeline.pause().progress(0.55);
    const middle = f.paper.y;
    f.animation.move(false);
    expect(f.timeline.reversed()).toBe(true);
    expect(f.paper.y).toBe(middle);
    f.timeline.pause().progress(0.3);
    f.animation.move(true);
    expect(f.timeline.reversed()).toBe(false);
    f.timeline.pause().progress(1);
    expect(f.paper).toMatchObject({ y: 0, scale: 1, opacity: 1 });
    expect(f.flap.rotationX).toBe(-180);
    expect(f.paper.clipPath).toBe('inset(-12% -12% -12% -12%)');
    expect(f.settled).toHaveBeenLastCalledWith(true);
    f.animation.move(false);
    f.timeline.pause().progress(0);
    expect(f.paper.opacity).toBe(0);
    expect(f.flap.rotationX).toBe(0);
    expect(f.envelope).toMatchObject({ y: 0, scale: 1 });
    expect(f.seal.opacity).toBe(1);
    expect(f.settled).toHaveBeenLastCalledWith(false);
    f.animation.revert();
  });

  it('settles immediate reversals at zero and repeated requests at one', () => {
    const f = fixture();
    f.animation.move(true);
    f.animation.move(false);
    expect(f.settled).toHaveBeenLastCalledWith(false);
    f.animation.move(true, true);
    f.animation.move(true);
    expect(f.settled).toHaveBeenLastCalledWith(true);
    f.animation.revert();
  });

  it('uses the measured envelope origin and refreshes on resize without duplicating timelines', () => {
    const f = fixture();
    f.animation.move(true);
    f.timeline.pause().progress(0);
    expect(f.paper.x).toBeCloseTo(-60);
    expect(f.paper.y).toBeCloseTo(60);
    expect(f.paper.scale).toBeCloseTo((320 * 0.85) / 600);
    f.source.left = 100;
    f.animation.refresh(false);
    expect(f.paper.x).toBeCloseTo(-460);
    f.animation.refresh(true);
    expect(f.paper).toMatchObject({ x: 0, y: 0, scale: 1, opacity: 1 });
    f.animation.revert();
  });

  it('restores original values when disposed during an animation', () => {
    const f = fixture();
    f.timeline.progress(0.5);
    f.animation.revert();
    expect(f.paper).toMatchObject({ y: 0, scale: 1, opacity: 1 });
    expect(f.flap.rotationX).toBe(0);
    expect(f.timeline.parent).toBeNull();
  });
});
