import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  effect: undefined as (() => (() => void) | undefined) | undefined,
  active: vi.fn(),
}));
vi.mock('react', () => ({
  useEffect: (effect: typeof state.effect) => {
    state.effect = effect;
  },
  useState: () => [undefined, state.active],
}));

import { useStoryNavigation } from '../src/features/story-player/hooks/use-story-navigation';
import { demoStory } from '../src/features/story-player/data/demo-story';

const intro = { dataset: { scene: 'intro' } };
const letter = { dataset: { scene: 'letter' } };
const ref = {
  current: {
    querySelectorAll: () => [intro, letter],
  } as unknown as HTMLElement,
};
let observers: Array<{
  callback: IntersectionObserverCallback;
  disconnect: ReturnType<typeof vi.fn>;
  observe: ReturnType<typeof vi.fn>;
  options?: IntersectionObserverInit;
}>;
let viewport: EventTarget & {
  innerHeight: number;
  IntersectionObserver?: unknown;
};

function mount() {
  useStoryNavigation(ref, demoStory);
  return state.effect?.();
}
beforeEach(() => {
  vi.clearAllMocks();
  observers = [];
  class Observer {
    disconnect = vi.fn();
    observe = vi.fn();
    constructor(
      public callback: IntersectionObserverCallback,
      public options?: IntersectionObserverInit,
    ) {
      observers.push(this);
    }
  }
  viewport = Object.assign(new EventTarget(), {
    innerHeight: 800,
    IntersectionObserver: Observer,
  });
  vi.stubGlobal('window', viewport);
  vi.stubGlobal('IntersectionObserver', Observer);
});
afterEach(() => vi.unstubAllGlobals());

describe('scene navigation lifecycle (effect harness)', () => {
  it('observes its own sections and updates location without moving focus', () => {
    const dispose = mount();
    const observer = observers[0]!;
    expect(observer.observe.mock.calls.map(([scene]) => scene)).toEqual([
      intro,
      letter,
    ]);
    expect(observer.options?.rootMargin).toBe('-399px 0px -399px 0px');
    observer.callback(
      [
        {
          isIntersecting: true,
          target: letter,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
    expect(state.active).toHaveBeenLastCalledWith('letter');
    dispose?.();
    observer.callback(
      [
        {
          isIntersecting: true,
          target: intro,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver,
    );
    expect(state.active).toHaveBeenLastCalledWith('letter');
  });

  it('rebuilds the reading band on resize and disconnects all resources', () => {
    const remove = vi.spyOn(viewport, 'removeEventListener');
    const dispose = mount();
    viewport.innerHeight = 600;
    viewport.dispatchEvent(new Event('resize'));
    expect(observers[0]!.disconnect).toHaveBeenCalledOnce();
    expect(observers[1]!.options?.rootMargin).toBe('-299px 0px -299px 0px');
    dispose?.();
    expect(observers[1]!.disconnect).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledWith('resize', expect.any(Function));
    viewport.dispatchEvent(new Event('resize'));
    expect(observers).toHaveLength(2);
  });

  it('preserves native anchors when IntersectionObserver is unavailable', () => {
    delete viewport.IntersectionObserver;
    expect(mount()).toBeUndefined();
    expect(observers).toHaveLength(0);
  });
});
