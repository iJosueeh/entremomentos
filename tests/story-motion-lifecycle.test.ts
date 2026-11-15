import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({
  effect: undefined as (() => (() => void) | undefined) | undefined,
  dependencies: undefined as unknown[] | undefined,
  ready: vi.fn(),
  reduced: vi.fn(),
  create: vi.fn(),
  cleanup: vi.fn(),
  stateIndex: 0,
}));
vi.mock('react', () => ({
  useEffect: (effect: typeof state.effect, dependencies: unknown[]) => {
    state.effect = effect;
    state.dependencies = dependencies;
  },
  useState: () => [
    false,
    state.stateIndex++ % 2 === 0 ? state.ready : state.reduced,
  ],
}));
vi.mock(
  '../src/features/story-player/animations/create-player-animation',
  () => ({ createPlayerAnimation: state.create }),
);

import { useStoryMotion } from '../src/features/story-player/hooks/use-story-motion';
import { demoStory } from '../src/features/story-player/data/demo-story';

let preference: EventTarget & { matches: boolean };
const root = {} as HTMLElement;
const ref = { current: root };
function mount(paused = false, story = demoStory) {
  useStoryMotion(ref, story, paused);
  return state.effect?.();
}
function change(reduced: boolean) {
  preference.matches = reduced;
  preference.dispatchEvent(new Event('change'));
}
beforeEach(() => {
  vi.clearAllMocks();
  state.stateIndex = 0;
  state.create.mockReturnValue(state.cleanup);
  preference = Object.assign(new EventTarget(), { matches: false });
  vi.stubGlobal('window', { matchMedia: () => preference });
});
afterEach(() => vi.unstubAllGlobals());

describe('story motion hook lifecycle (effect harness)', () => {
  it('starts statically with reduced motion and can later enable decoration', async () => {
    preference.matches = true;
    const dispose = mount();
    await vi.dynamicImportSettled();
    expect(state.create).not.toHaveBeenCalled();
    expect(state.ready).toHaveBeenLastCalledWith(false);
    expect(state.reduced).toHaveBeenLastCalledWith(true);
    change(false);
    await vi.dynamicImportSettled();
    expect(state.create).toHaveBeenCalledOnce();
    dispose?.();
  });
  it('reverts on unmount and removes its preference listener', async () => {
    const remove = vi.spyOn(preference, 'removeEventListener');
    const dispose = mount();
    await vi.dynamicImportSettled();
    expect(state.create).toHaveBeenCalledWith(root);
    dispose?.();
    expect(state.cleanup).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledWith('change', expect.any(Function));
    change(true);
    expect(state.reduced).toHaveBeenLastCalledWith(false);
  });

  it('discards imports resolving after unmount or a reduced-motion change', async () => {
    const dispose = mount();
    change(true);
    dispose?.();
    await vi.dynamicImportSettled();
    expect(state.create).not.toHaveBeenCalled();
    expect(state.reduced).toHaveBeenLastCalledWith(true);
  });

  it('creates only the latest generation after rapid preference changes', async () => {
    const dispose = mount();
    change(true);
    change(false);
    change(true);
    change(false);
    // Concurrent mocked imports can settle their continuations on separate turns.
    await vi.waitFor(() => expect(state.create).toHaveBeenCalledOnce());
    dispose?.();
  });

  it('preserves manual pause across preference changes and resumes only explicitly', async () => {
    let dispose = mount(true);
    change(true);
    expect(state.reduced).toHaveBeenLastCalledWith(true);
    change(false);
    await vi.dynamicImportSettled();
    expect(state.reduced).toHaveBeenLastCalledWith(false);
    expect(state.ready).toHaveBeenLastCalledWith(true);
    expect(state.create).not.toHaveBeenCalled();
    dispose?.();
    dispose = mount(false);
    await vi.dynamicImportSettled();
    expect(state.create).toHaveBeenCalledOnce();
    dispose?.();
  });

  it('reverts existing movement when reduced motion or manual pause applies', async () => {
    let dispose = mount();
    await vi.dynamicImportSettled();
    change(true);
    expect(state.cleanup).toHaveBeenCalledOnce();
    dispose?.();
    dispose = mount(true);
    await vi.dynamicImportSettled();
    expect(state.create).toHaveBeenCalledOnce();
    dispose?.();
  });

  it('depends on the document reference, even when its id stays the same', async () => {
    let dispose = mount();
    await vi.dynamicImportSettled();
    dispose?.();
    const changed = { ...demoStory, title: 'Otra lectura del mismo camino' };
    dispose = mount(false, changed);
    expect(state.dependencies).toEqual([ref, changed, false]);
    await vi.dynamicImportSettled();
    expect(state.create).toHaveBeenCalledTimes(2);
    expect(state.cleanup).toHaveBeenCalledOnce();
    dispose?.();
  });

  it('keeps the pause control available while toggling decoration', async () => {
    let dispose = mount();
    await vi.dynamicImportSettled();
    dispose?.();
    dispose = mount(true);
    dispose?.();
    dispose = mount(false);
    await vi.dynamicImportSettled();
    expect(state.ready).not.toHaveBeenCalledWith(false);
    expect(state.ready).toHaveBeenLastCalledWith(true);
    dispose?.();
  });

  it('keeps static content usable if animation initialization fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    state.create.mockImplementationOnce(() => {
      throw new Error('GSAP unavailable');
    });
    const dispose = mount();
    await vi.dynamicImportSettled();
    expect(state.ready).toHaveBeenLastCalledWith(false);
    expect(warn).toHaveBeenCalledOnce();
    dispose?.();
    warn.mockRestore();
  });

  it('does not accumulate resources across ten mount/unmount cycles', async () => {
    const remove = vi.spyOn(preference, 'removeEventListener');
    for (let cycle = 0; cycle < 10; cycle++) {
      const dispose = mount();
      await vi.dynamicImportSettled();
      dispose?.();
    }
    expect(state.create).toHaveBeenCalledTimes(10);
    expect(state.cleanup).toHaveBeenCalledTimes(10);
    expect(remove).toHaveBeenCalledTimes(10);
  });
});
