import { gsap } from 'gsap';
import { describe, expect, it, vi } from 'vitest';
import { createPhotoAnimation } from '../src/features/story-player/animations/create-photo-animation';
import { createAtmosphereAnimation } from '../src/features/story-player/animations/create-atmosphere-animation';
import { photoGeometry } from '../src/features/story-player/animations/photo-geometry';

describe('photo geometry', () => {
  it.each([
    [640, 423],
    [423, 640],
    [1200, 300],
    [300, 1200],
  ])(
    'preserves %i × %i with uniform scaling and no letterbox geometry',
    (width, height) => {
      const rect = { left: 50, top: 80, width: width / 2, height: height / 2 };
      const geometry = photoGeometry(rect, rect, width);
      expect(geometry).toEqual({
        x: 50,
        y: 80,
        scale: 0.5,
        clipPath: 'inset(0% 0% 0% 0%)',
      });
      expect((width * geometry.scale) / (height * geometry.scale)).toBe(
        width / height,
      );
    },
  );
  it('accounts for the original drift/hover crop independently of image scale', () => {
    const geometry = photoGeometry(
      { left: 90, top: 180, width: 200, height: 400 },
      { left: 100, top: 200, width: 180, height: 360 },
      400,
    );
    expect(geometry).toMatchObject({
      x: 90,
      y: 180,
      scale: 0.5,
      clipPath: 'inset(5% 5% 5% 5%)',
    });
  });
  it('rejects unmeasurable geometry and clamps crop outside the image', () => {
    const rect = { left: 0, top: 0, width: 0, height: 10 };
    expect(() => photoGeometry(rect, rect, 640)).toThrow();
    const valid = { ...rect, width: 10 };
    expect(
      photoGeometry(
        valid,
        { ...valid, left: -100, top: -100, width: 1000, height: 1000 },
        10,
      ).clipPath,
    ).toBe('inset(0% 0% 0% 0%)');
  });
});

// Real GSAP on numeric/DOM doubles: proves interpolation and cleanup, not painted frames.
function fixture() {
  let target = { left: 200, top: 120, width: 640, height: 400 };
  const original = { left: 60, top: 800, width: 320, height: 200 };
  const source = { getBoundingClientRect: () => original };
  const window = {
    visibility: 'visible',
    opacity: 1,
    getBoundingClientRect: () => original,
  };
  const proxy = {
    x: 0,
    y: 0,
    scale: 1,
    clipPath: 'inset(0% 0% 0% 0%)',
    visibility: 'visible',
    opacity: 1,
    transformOrigin: '0 0',
    style: {},
    setAttribute: vi.fn(),
    remove: vi.fn(),
  };
  const image = {
    visibility: 'visible',
    getBoundingClientRect: () => target,
    cloneNode: () => proxy,
  };
  const shade = { opacity: 1 };
  const chrome = { opacity: 1 };
  const dialog = {
    ownerDocument: { defaultView: null },
    append: vi.fn(),
    querySelector: () => shade,
    querySelectorAll: () => [chrome],
  } as unknown as HTMLDialogElement;
  const opener = {
    querySelector: (selector: string) => (selector === 'img' ? source : window),
  } as unknown as HTMLAnchorElement;
  const spy = vi.spyOn(gsap, 'timeline');
  const settled = vi.fn();
  const animation = createPhotoAnimation(
    dialog,
    opener,
    image as unknown as HTMLImageElement,
    settled,
  );
  const current = () => spy.mock.results.at(-1)!.value as gsap.core.Timeline;
  return {
    proxy,
    image,
    shade,
    chrome,
    original,
    animation,
    current,
    settled,
    resize: () => {
      target = { left: 20, top: 60, width: 400, height: 250 };
    },
    dispose: () => {
      animation.revert();
      spy.mockRestore();
    },
  };
}

describe('shared photo motion (real GSAP)', () => {
  it('opens and returns to the measured origin, retaining the image until completion', () => {
    const f = fixture();
    expect(f.proxy).toMatchObject({ x: 60, y: 800, scale: 0.5 });
    f.animation.move(true);
    expect(f.current().duration()).toBe(0.56);
    f.current().pause().progress(1);
    expect(f.proxy).toMatchObject({
      x: 200,
      y: 120,
      scale: 1,
      visibility: 'hidden',
    });
    expect(f.image.visibility).toBe('visible');
    expect(f.shade.opacity).toBe(1);
    f.animation.move(false);
    expect(f.proxy.visibility).toBe('visible');
    expect(f.image.visibility).toBe('hidden');
    f.current().pause().progress(1);
    expect(f.proxy).toMatchObject({ x: 60, y: 800, scale: 0.5 });
    expect(f.shade.opacity).toBe(0);
    expect(f.settled).toHaveBeenLastCalledWith(false);
    f.dispose();
    expect(f.proxy.remove).toHaveBeenCalledOnce();
    expect(f.image.visibility).toBe('visible');
  });

  it('retargets both ways from the exact current frame and kills replaced timelines', () => {
    const f = fixture();
    f.animation.move(true);
    const first = f.current();
    first.pause().progress(0.45);
    const x = f.proxy.x;
    f.animation.move(false);
    expect(first.parent).toBeNull();
    expect(f.proxy.x).toBe(x);
    f.current().pause().progress(0.4);
    const y = f.proxy.y;
    f.animation.move(true);
    expect(f.proxy.y).toBe(y);
    f.current().pause().progress(1);
    expect(f.proxy.scale).toBe(1);
    f.dispose();
  });

  it('retargets resize from the current frame, remeasures the return and reverts during motion', () => {
    const f = fixture();
    f.animation.move(true);
    f.current().pause().progress(0.4);
    const x = f.proxy.x;
    f.resize();
    f.animation.refresh(true);
    expect(f.proxy.x).toBe(x);
    f.current().pause().progress(1);
    expect(f.proxy).toMatchObject({ x: 20, y: 60, scale: 0.625 });
    f.original.left = 75;
    f.animation.move(false);
    f.current().pause().progress(1);
    expect(f.proxy.x).toBe(75);
    f.animation.move(true);
    f.current().pause().progress(0.4);
    const interrupted = f.current();
    f.dispose();
    expect(interrupted.parent).toBeNull();
    expect(f.image.visibility).toBe('visible');
    expect(f.shade.opacity).toBe(1);
  });
});

describe('ambient interpolation (real GSAP, scroll progress simulated)', () => {
  it('returns to the same values when scroll progress moves backward and reverts its styles', () => {
    const layer = { y: 0, opacity: 1 };
    const atmosphere = { closest: () => null, querySelector: () => layer };
    const root = {
      querySelectorAll: () => [atmosphere],
    } as unknown as HTMLElement;
    const timeline = gsap.timeline.bind(gsap);
    const spy = vi
      .spyOn(gsap, 'timeline')
      .mockImplementation((options) =>
        timeline({ ...options, scrollTrigger: undefined, paused: true }),
      );
    const context = gsap.context(() => {});
    let owned: gsap.core.Timeline[] = [];
    context.add(() => {
      owned = createAtmosphereAnimation(root);
    });
    const animation = owned[0]!;
    animation.progress(0.2);
    const initial = { ...layer };
    animation.progress(0.8);
    expect(layer.y).toBeGreaterThan(initial.y);
    animation.progress(0.2);
    expect(layer.y).toBeCloseTo(initial.y);
    expect(layer.opacity).toBeCloseTo(initial.opacity);
    context.revert();
    expect(layer).toMatchObject({ y: 0, opacity: 1 });
    expect(animation.parent).toBeNull();
    spy.mockRestore();
  });
});

describe('epilogue constellation (real GSAP, simulated scroll)', () => {
  it('coordinates individual stars, reverses progress and restores all properties on cleanup', async () => {
    const { createEpilogueAnimation } =
      await import('../src/features/story-player/animations/create-epilogue-animation');
    const lines = Array.from({ length: 2 }, () => ({
      strokeDashoffset: 0,
      opacity: 1,
    }));
    const stars = Array.from({ length: 7 }, () => ({ opacity: 1 }));
    const scene = {
      querySelector: () => ({}),
      querySelectorAll: (selector: string) =>
        selector.includes('path') ? lines : stars,
    } as unknown as HTMLElement;
    const original = gsap.timeline.bind(gsap);
    const spy = vi
      .spyOn(gsap, 'timeline')
      .mockImplementation((options) =>
        original({ ...options, scrollTrigger: undefined, paused: true }),
      );
    const context = gsap.context(() => {});
    let timeline!: gsap.core.Timeline;
    context.add(() => {
      timeline = createEpilogueAnimation(scene)!;
    });
    timeline.progress(0.35);
    expect(stars[0]!.opacity).toBeGreaterThan(stars[6]!.opacity);
    const snapshot = [
      ...lines.map((line) => line.strokeDashoffset),
      ...stars.map((star) => star.opacity),
    ];
    timeline.progress(1);
    expect(lines.every((line) => line.strokeDashoffset === 0)).toBe(true);
    expect(stars.every((star) => star.opacity === 1)).toBe(true);
    timeline.progress(0.35);
    expect([
      ...lines.map((line) => line.strokeDashoffset),
      ...stars.map((star) => star.opacity),
    ]).toEqual(snapshot);
    context.revert();
    expect(
      lines.every((line) => line.strokeDashoffset === 0 && line.opacity === 1),
    ).toBe(true);
    expect(stars.every((star) => star.opacity === 1)).toBe(true);
    expect(timeline.parent).toBeNull();
    spy.mockRestore();
  });
});
