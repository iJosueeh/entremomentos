import { beforeEach, describe, expect, it, vi } from 'vitest';

type TimelineDouble = {
  fromTo: ReturnType<typeof vi.fn>;
  scrollTrigger?: { refresh: ReturnType<typeof vi.fn> };
};
const state = vi.hoisted(() => ({
  allowed: true,
  timeline: vi.fn(),
  timelines: [] as TimelineDouble[],
  cleanups: [] as (() => void)[],
  revert: vi.fn(),
  add: vi.fn(),
  register: vi.fn(),
}));
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: state.register,
    matchMedia: () => ({
      add: (
        query: string,
        callback: () => (() => void) | undefined,
        root: HTMLElement,
      ) => {
        state.add(query, root);
        if (state.allowed) {
          const cleanup = callback();
          if (cleanup) state.cleanups.push(cleanup);
        }
      },
      revert: state.revert,
    }),
    timeline: state.timeline,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

import { createPlayerAnimation } from '../src/features/story-player/animations/create-player-animation';

function fixture(
  top = 0,
  fontsReady?: Promise<unknown>,
  photoCount = 0,
  finalSky = false,
  atmosphereCount = 0,
) {
  let frameCallback: (() => void) | undefined;
  const frames = Array.from({ length: photoCount }, () => {
    const drift = {};
    return { drift, parentElement: {}, querySelector: () => drift };
  });
  const memories = { querySelectorAll: () => frames };
  const title = {};
  const light = {};
  const emergence = {};
  const visual = {};
  const first = {};
  const second = {};
  const lines = [{}, {}];
  const nodes = {};
  const glow = {};
  const finalVisual = {};
  const finalLines = [{}, {}];
  const finalStars = Array.from({ length: 7 }, () => ({}));
  const epilogue = {
    querySelector: (selector: string) =>
      ({
        '[data-epilogue-visual]': finalVisual,
        '[data-epilogue-stars]': finalStars,
      })[selector],
    querySelectorAll: (selector: string) =>
      selector === '[data-epilogue-lines] path' ? finalLines : finalStars,
  };
  const ownerDocument = {
    defaultView: {
      innerHeight: 900,
      requestAnimationFrame: (callback: () => void) => {
        frameCallback = callback;
        return 1;
      },
      cancelAnimationFrame: () => {
        frameCallback = undefined;
      },
    },
    fonts: fontsReady ? { ready: fontsReady } : undefined,
  };
  const intro = {
    ownerDocument,
    getBoundingClientRect: () => ({ top, bottom: top + 700 }),
    querySelector: (selector: string) =>
      ({
        '[data-intro-title]': title,
        '[data-intro-light]': light,
        '[data-intro-emergence]': emergence,
      })[selector],
  };
  const connection = {
    querySelector: (selector: string) =>
      ({
        '[data-connection-visual]': visual,
        '[data-connection-light="first"]': first,
        '[data-connection-light="second"]': second,
        '[data-connection-nodes]': nodes,
        '[data-connection-glow]': glow,
      })[selector],
    querySelectorAll: () => lines,
  };
  const atmospheres = Array.from({ length: atmosphereCount }, () => ({
    layer: {},
    closest: () => null,
    querySelector() {
      return this.layer;
    },
  }));
  const root = Object.assign(new EventTarget(), {
    querySelectorAll: () => atmospheres,
    ownerDocument,
    querySelector: (selector: string) =>
      ({
        '[data-scene="intro"]': intro,
        '[data-scene="connection"]': connection,
        '[data-scene="memories"]': photoCount ? memories : undefined,
        '[data-scene="epilogue"]': finalSky ? epilogue : undefined,
      })[selector],
  }) as unknown as HTMLElement;
  return {
    root,
    intro,
    visual,
    title,
    light,
    emergence,
    first,
    second,
    lines,
    nodes,
    glow,
    frames,
    finalVisual,
    finalLines,
    finalStars,
    atmospheres,
    flushFrame: () => {
      const callback = frameCallback;
      frameCallback = undefined;
      callback?.();
    },
  };
}

beforeEach(() => {
  vi.resetAllMocks();
  state.allowed = true;
  state.timelines = [];
  state.cleanups = [];
  state.revert.mockImplementation(() =>
    state.cleanups.forEach((cleanup) => cleanup()),
  );
  state.timeline.mockImplementation((options?: { scrollTrigger?: object }) => {
    const timeline = {
      fromTo: vi.fn().mockReturnThis(),
      scrollTrigger: options?.scrollTrigger ? { refresh: vi.fn() } : undefined,
    };
    state.timelines.push(timeline);
    return timeline;
  });
});

describe('player scene animation ownership', () => {
  it('owns all ambient layers with reversible scrub and scoped refresh/cleanup', async () => {
    const f = fixture(0, Promise.resolve(), 3, true, 5);
    const cleanup = createPlayerAnimation(f.root);
    const ambient = state.timelines.slice(-5);
    expect(ambient).toHaveLength(5);
    ambient.forEach((timeline, index) => {
      const atmosphere = f.atmospheres[index]!;
      expect(timeline.fromTo.mock.calls[0]).toEqual([
        atmosphere.layer,
        { y: -16, opacity: 0.65 },
        { y: 16, opacity: 1, ease: 'none', duration: 1 },
        0,
      ]);
      const options = state.timeline.mock.calls.at(index - 5)?.[0]
        .scrollTrigger;
      expect(options).toMatchObject({
        trigger: atmosphere,
        scrub: 0.5,
        start: 'top bottom',
        end: 'bottom top',
      });
      expect(options).not.toHaveProperty('pin');
    });
    await Promise.resolve();
    f.flushFrame();
    for (const timeline of ambient)
      expect(timeline.scrollTrigger?.refresh).toHaveBeenCalledOnce();
    cleanup();
    expect(state.revert).toHaveBeenCalledOnce();
    f.flushFrame();
    for (const timeline of ambient)
      expect(timeline.scrollTrigger?.refresh).toHaveBeenCalledOnce();
  });
  it('connects the epilogue with reversible scrub, static text and only owned refreshes', async () => {
    const f = fixture(0, Promise.resolve(), 3, true);
    const cleanup = createPlayerAnimation(f.root);
    const timeline = state.timelines.at(-1)!;
    expect(state.timeline.mock.calls.at(-1)?.[0]).toMatchObject({
      scrollTrigger: {
        trigger: f.finalVisual,
        start: 'top 85%',
        end: 'center 45%',
        scrub: 0.5,
      },
    });
    expect(
      state.timeline.mock.calls.at(-1)?.[0].scrollTrigger,
    ).not.toHaveProperty('pin');
    expect(timeline.fromTo.mock.calls.map(([target]) => target)).toEqual([
      f.finalLines,
      f.finalStars,
    ]);
    expect(timeline.fromTo.mock.calls[0]?.slice(1, 3)).toEqual([
      { strokeDashoffset: 1, opacity: 0.2 },
      expect.objectContaining({ strokeDashoffset: 0, opacity: 1 }),
    ]);
    await Promise.resolve();
    f.flushFrame();
    expect(timeline.scrollTrigger?.refresh).toHaveBeenCalledOnce();
    cleanup();
    expect(state.revert).toHaveBeenCalledOnce();
  });

  it('uses scoped, reversible scroll timelines without pinning or hiding narrative', () => {
    const f = fixture();
    const cleanup = createPlayerAnimation(f.root);
    expect(state.add).toHaveBeenCalledWith(
      '(prefers-reduced-motion: no-preference)',
      f.root,
    );
    expect(state.timeline).toHaveBeenCalledTimes(3);
    const scrollOptions = state.timeline.mock.calls
      .map(([options]) => options.scrollTrigger)
      .filter(Boolean);
    expect(scrollOptions).toEqual([
      expect.objectContaining({
        trigger: f.intro,
        scrub: 0.5,
        start: 'top top',
        end: 'bottom top',
      }),
      expect.objectContaining({
        trigger: f.visual,
        scrub: 0.5,
        start: 'top 85%',
        end: 'center 45%',
      }),
    ]);
    for (const options of scrollOptions)
      expect(options).not.toHaveProperty('pin');
    const calls = state.timelines.flatMap(
      (timeline) => timeline.fromTo.mock.calls,
    );
    expect(calls.map(([target]) => target)).toEqual([
      f.emergence,
      f.title,
      f.light,
      f.first,
      f.second,
      f.lines,
      f.nodes,
      f.glow,
    ]);
    const titleTween = calls.find(([target]) => target === f.title);
    expect(titleTween?.[1].opacity).toBeGreaterThanOrEqual(0.75);
    expect(calls.find(([target]) => target === f.lines)?.slice(1, 3)).toEqual([
      { strokeDashoffset: 1, opacity: 0 },
      expect.objectContaining({ strokeDashoffset: 0, opacity: 1 }),
    ]);
    cleanup();
    expect(state.revert).toHaveBeenCalledOnce();
  });

  it('resumes at scroll position without repeating the title entrance', () => {
    const f = fixture();
    createPlayerAnimation(f.root)();
    createPlayerAnimation(f.root)();
    const titleTweens = state.timelines
      .flatMap((timeline) => timeline.fromTo.mock.calls)
      .filter(([target]) => target === f.title);
    expect(titleTweens).toHaveLength(1);
    expect(state.timeline).toHaveBeenCalledTimes(5);
  });

  it.each([-1000, 1200])(
    'skips timed entrances when Intro is offscreen at %ipx',
    (top) => {
      createPlayerAnimation(fixture(top).root)();
      expect(state.timeline).toHaveBeenCalledTimes(2);
      expect(
        state.timeline.mock.calls.every(([options]) => options.scrollTrigger),
      ).toBe(true);
    },
  );

  it('does not create timelines when reduced motion is enabled', () => {
    state.allowed = false;
    createPlayerAnimation({} as HTMLElement)();
    expect(state.timeline).not.toHaveBeenCalled();
    expect(state.revert).toHaveBeenCalledOnce();
  });

  it('cleans partial initialization when GSAP fails', () => {
    state.timeline.mockImplementationOnce(() => {
      throw new Error('initialization failed');
    });
    expect(() => createPlayerAnimation(fixture().root)).toThrow(
      'initialization failed',
    );
    expect(state.revert).toHaveBeenCalledOnce();
  });

  it('refreshes only its own scroll triggers after fonts settle', async () => {
    const f = fixture(0, Promise.resolve());
    const cleanup = createPlayerAnimation(f.root);
    await Promise.resolve();
    f.flushFrame();
    const refreshes = state.timelines.flatMap((timeline) =>
      timeline.scrollTrigger ? [timeline.scrollTrigger.refresh] : [],
    );
    expect(refreshes).toHaveLength(2);
    for (const refresh of refreshes) expect(refresh).toHaveBeenCalledOnce();
    cleanup();
  });

  it.each([1, 12, 100])(
    'animates %i photos in editorial order without targeting text or the viewer',
    (count) => {
      const f = fixture(0, undefined, count);
      createPlayerAnimation(f.root)();
      const photoTimelines = state.timelines.slice(3);
      expect(photoTimelines).toHaveLength(count);
      photoTimelines.forEach((timeline, index) => {
        const frame = f.frames[index]!;
        expect(timeline.fromTo.mock.calls.map(([target]) => target)).toEqual([
          frame,
          frame.drift,
        ]);
        expect(
          timeline.fromTo.mock.calls[0]?.[1].opacity,
        ).toBeGreaterThanOrEqual(0.75);
        expect(timeline.fromTo.mock.calls[0]?.[2]).toMatchObject({
          opacity: 1,
          scale: 1,
        });
        const options = state.timeline.mock.calls[index + 3]?.[0].scrollTrigger;
        expect(options).toMatchObject({
          trigger: frame.parentElement,
          scrub: 0.5,
        });
        expect(options).not.toHaveProperty('pin');
      });
    },
  );

  it('ignores late font callbacks after cleanup', async () => {
    let resolveFonts: (() => void) | undefined;
    const ready = new Promise<void>((resolve) => {
      resolveFonts = resolve;
    });
    createPlayerAnimation(fixture(0, ready).root)();
    resolveFonts?.();
    await ready;
    for (const timeline of state.timelines)
      if (timeline.scrollTrigger)
        expect(timeline.scrollTrigger.refresh).not.toHaveBeenCalled();
  });

  it('refreshes gallery triggers together with opening triggers after geometry changes', async () => {
    const f = fixture(0, Promise.resolve(), 3);
    const cleanup = createPlayerAnimation(f.root);
    await Promise.resolve();
    f.flushFrame();
    const refreshes = state.timelines.flatMap((timeline) =>
      timeline.scrollTrigger ? [timeline.scrollTrigger.refresh] : [],
    );
    expect(refreshes).toHaveLength(5);
    for (const refresh of refreshes) expect(refresh).toHaveBeenCalledOnce();
    cleanup();
  });

  it('reverts partially created gallery motion when a later photo fails', () => {
    const createTimeline = state.timeline.getMockImplementation()!;
    let count = 0;
    state.timeline.mockImplementation((options) => {
      if (++count === 5) throw new Error('photo initialization failed');
      return createTimeline(options);
    });
    expect(() => createPlayerAnimation(fixture(0, undefined, 3).root)).toThrow(
      'photo initialization failed',
    );
    expect(state.revert).toHaveBeenCalledOnce();
  });

  it('reverts the shared context when a later atmosphere fails to initialize', () => {
    const createTimeline = state.timeline.getMockImplementation()!;
    let count = 0;
    state.timeline.mockImplementation((options) => {
      if (++count === 5) throw new Error('ambient initialization failed');
      return createTimeline(options);
    });
    expect(() =>
      createPlayerAnimation(fixture(0, undefined, 0, false, 2).root),
    ).toThrow('ambient initialization failed');
    expect(state.revert).toHaveBeenCalledOnce();
  });
});
