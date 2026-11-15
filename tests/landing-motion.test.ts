import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  allowed: true,
  cleanup: undefined as (() => void) | undefined,
  visibility: undefined as IntersectionObserverCallback | undefined,
  ambient: { to: vi.fn(), play: vi.fn(), pause: vi.fn() },
  disconnect: vi.fn(),
  observe: vi.fn(),
  from: vi.fn(),
  register: vi.fn(),
}));

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: state.register,
    matchMedia: () => ({
      add: (_query: string, callback: () => (() => void) | undefined) => {
        if (state.allowed) state.cleanup = callback();
      },
      revert: () => state.cleanup?.(),
    }),
    from: state.from,
    timeline: () => state.ambient,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({ ScrollTrigger: {} }));

import { createUniverseAnimation } from '../src/features/landing/animations/create-universe-animation';

function fixture() {
  const hero = {};
  return {
    querySelector: () => hero,
    querySelectorAll: (selector: string) =>
      selector === '[data-reveal]' ? [{}] : [],
  } as unknown as HTMLElement;
}

beforeEach(() => {
  vi.clearAllMocks();
  state.allowed = true;
  state.cleanup = undefined;
  state.visibility = undefined;
  vi.stubGlobal(
    'document',
    Object.assign(new EventTarget(), { hidden: false }),
  );
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(callback: IntersectionObserverCallback) {
        state.visibility = callback;
      }
      observe = state.observe;
      disconnect = state.disconnect;
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

describe('landing ambient lifecycle', () => {
  it('pauses offscreen and in hidden tabs, resumes only when both permit it', () => {
    const cleanup = createUniverseAnimation(fixture(), false, false);
    expect(state.ambient.play).toHaveBeenCalledOnce();
    const visibility = (isIntersecting: boolean) =>
      state.visibility?.(
        [{ isIntersecting } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    visibility(false);
    expect(state.ambient.pause).toHaveBeenCalledOnce();
    Object.assign(document, { hidden: true });
    visibility(true);
    expect(state.ambient.play).toHaveBeenCalledOnce();
    Object.assign(document, { hidden: false });
    document.dispatchEvent(new Event('visibilitychange'));
    expect(state.ambient.play).toHaveBeenCalledTimes(2);
    cleanup();
    expect(state.disconnect).toHaveBeenCalledOnce();
    document.dispatchEvent(new Event('visibilitychange'));
    expect(state.ambient.play).toHaveBeenCalledTimes(2);
  });

  it('creates no ambient observers when the visitor pauses decoration', () => {
    createUniverseAnimation(fixture(), true, false)();
    expect(state.observe).not.toHaveBeenCalled();
    expect(state.from).not.toHaveBeenCalled();
    expect(state.ambient.play).not.toHaveBeenCalled();
  });

  it('creates no tweens or observers when the motion media query does not match', () => {
    state.allowed = false;
    createUniverseAnimation(fixture(), false, true)();
    expect(state.from).not.toHaveBeenCalled();
    expect(state.observe).not.toHaveBeenCalled();
    expect(state.from).not.toHaveBeenCalled();
    expect(state.ambient.play).not.toHaveBeenCalled();
  });
});
