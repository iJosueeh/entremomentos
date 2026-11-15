import type { MouseEvent } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { demoStory } from '../src/features/story-player/data/demo-story';

const state = vi.hoisted(() => ({
  effect: undefined as (() => (() => void) | undefined) | undefined,
  selection: undefined as unknown,
  setSelection: vi.fn(),
  cursor: 0,
  refs: [{ current: undefined as unknown }, { current: undefined as unknown }],
}));
vi.mock('react', () => ({
  useRef: () => state.refs[state.cursor++],
  useState: () => [state.selection, state.setSelection],
  useLayoutEffect: (effect: typeof state.effect) => {
    state.effect = effect;
  },
}));
import {
  connectMemoryViewer,
  useMemoryViewer,
} from '../src/features/story-player/hooks/use-memory-viewer';
type PhotoModule =
  typeof import('../src/features/story-player/animations/create-photo-animation');

function fixture(reduced = false) {
  const preference = Object.assign(new EventTarget(), { matches: reduced });
  const style = { overflow: 'clip' };
  const observe = vi.fn();
  const disconnect = vi.fn();
  let frame: (() => void) | undefined;
  const view = Object.assign(new EventTarget(), {
    scrollX: 0,
    scrollY: 1650,
    scrollTo: vi.fn(),
    matchMedia: () => preference,
    requestAnimationFrame: vi.fn((callback: () => void) => {
      frame = callback;
      return 1;
    }),
    cancelAnimationFrame: vi.fn(() => {
      frame = undefined;
    }),
    visualViewport: new EventTarget(),
    ResizeObserver: class {
      observe = observe;
      disconnect = disconnect;
    },
  });
  const close = Object.assign(new EventTarget(), { focus: vi.fn() });
  const content = { inert: false };
  const image = { decode: vi.fn(async () => {}) };
  const element = Object.assign(new EventTarget(), {
    dataset: {} as Record<string, string>,
    open: false,
    ownerDocument: { documentElement: { style }, defaultView: view },
    querySelector: (selector: string) =>
      selector === 'button'
        ? close
        : selector === '[data-viewer-content]'
          ? content
          : image,
    showModal: vi.fn(() => {
      element.open = true;
    }),
    close: vi.fn(() => {
      element.open = false;
      element.dispatchEvent(new Event('close'));
    }),
  });
  state.refs[0]!.current = element;
  const opener = { isConnected: true, focus: vi.fn() };
  const event = {
    currentTarget: opener,
    button: 0,
    preventDefault: vi.fn(),
  } as unknown as MouseEvent<HTMLAnchorElement>;
  let complete: (open: boolean) => void = () => {};
  const move = vi.fn();
  const revert = vi.fn();
  const refresh = vi.fn();
  const createPhotoAnimation = vi.fn((_dialog, _opener, _image, settled) => {
    complete = settled;
    return { move, revert, refresh };
  });
  const module = { createPhotoAnimation } as unknown as PhotoModule;
  const load = vi.fn(async () => module);
  const finished = vi.fn();
  return {
    style,
    view,
    element,
    opener,
    event,
    preference,
    close,
    content,
    image,
    module,
    load,
    finished,
    move,
    revert,
    refresh,
    createPhotoAnimation,
    observe,
    disconnect,
    mount: (loader = load) =>
      connectMemoryViewer(
        element as unknown as HTMLDialogElement,
        opener as unknown as HTMLAnchorElement,
        finished,
        loader,
      ),
    complete: (open: boolean) => complete(open),
    flushFrame: () => {
      const callback = frame;
      frame = undefined;
      callback?.();
    },
    reduce: (matches: boolean) => {
      preference.matches = matches;
      preference.dispatchEvent(new Event('change'));
    },
  };
}
function render(memories = demoStory.memories) {
  state.cursor = 0;
  return useMemoryViewer(memories);
}
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
  await Promise.resolve();
};
beforeEach(() => {
  vi.clearAllMocks();
  state.selection = undefined;
  state.refs[1]!.current = undefined;
  state.setSelection.mockImplementation((value: unknown) => {
    state.selection = value;
  });
});

describe('memory viewer lifecycle (DOM event doubles)', () => {
  it('balances listeners and animations across ten complete open/close cycles', async () => {
    const f = fixture();
    const targets = [
      f.element,
      f.close,
      f.view,
      f.view.visualViewport,
      f.preference,
    ];
    const listeners = targets.map((target) => ({
      add: vi.spyOn(target, 'addEventListener'),
      remove: vi.spyOn(target, 'removeEventListener'),
    }));
    for (let cycle = 0; cycle < 10; cycle++) {
      const session = f.mount();
      await flush();
      f.complete(true);
      f.close.dispatchEvent(new Event('click'));
      f.complete(false);
      expect(f.element.open).toBe(false);
      expect(f.style.overflow).toBe('clip');
      session.dispose();
    }
    expect(f.createPhotoAnimation).toHaveBeenCalledTimes(10);
    expect(f.revert).toHaveBeenCalledTimes(10);
    expect(f.finished).toHaveBeenCalledTimes(10);
    expect(f.disconnect).toHaveBeenCalledTimes(10);
    for (const { add, remove } of listeners)
      expect(remove.mock.calls).toEqual(add.mock.calls);
    f.close.dispatchEvent(new Event('click'));
    expect(f.move).toHaveBeenCalledTimes(20);
  });

  it('waits for decoding, focuses close immediately and retains the modal until exit ends', async () => {
    const f = fixture();
    const session = f.mount();
    expect(f.element.dataset.viewerState).toBe('preparing');
    expect(f.content.inert).toBe(true);
    expect(f.element.showModal).toHaveBeenCalledOnce();
    expect(f.style.overflow).toBe('hidden');
    expect(f.close.focus).toHaveBeenCalledWith({ preventScroll: true });
    await flush();
    expect(f.image.decode).toHaveBeenCalledOnce();
    expect(f.content.inert).toBe(false);
    expect(f.move).toHaveBeenLastCalledWith(true);
    f.complete(true);
    f.close.dispatchEvent(new Event('click'));
    expect(f.element.dataset.viewerState).toBe('closing');
    expect(f.element.open).toBe(true);
    expect(f.move).toHaveBeenLastCalledWith(false);
    f.complete(false);
    expect(f.element.open).toBe(false);
    expect(f.style.overflow).toBe('clip');
    expect(f.opener.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(f.view.scrollTo).toHaveBeenCalledWith({
      left: 0,
      top: 1650,
      behavior: 'instant',
    });
    expect(f.finished).toHaveBeenCalledOnce();
    session.dispose();
    expect(f.revert).toHaveBeenCalledOnce();
  });

  it('cancels native Escape to animate the exit and tolerates repeated close requests', async () => {
    const f = fixture();
    const session = f.mount();
    await flush();
    const cancel = new Event('cancel', { cancelable: true });
    f.element.dispatchEvent(cancel);
    expect(cancel.defaultPrevented).toBe(true);
    session.request(false);
    f.element.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(f.move.mock.calls).toEqual([[true], [false]]);
    f.complete(false);
    expect(f.finished).toHaveBeenCalledOnce();
  });

  it('uses the latest intent when an opening or closing transition is interrupted', async () => {
    const f = fixture();
    const session = f.mount();
    await flush();
    session.request(false);
    session.request(true);
    f.complete(false);
    expect(f.finished).not.toHaveBeenCalled();
    expect(f.element.open).toBe(true);
    f.complete(true);
    expect(f.element.dataset.viewerState).toBe('open');
    session.request(false);
    f.complete(false);
    expect(f.finished).toHaveBeenCalledOnce();
    expect(f.move.mock.calls).toEqual([[true], [false], [true], [false]]);
  });

  it('uses no spatial animation or import with reduced motion', async () => {
    const f = fixture(true);
    const session = f.mount();
    await flush();
    expect(f.load).not.toHaveBeenCalled();
    expect(f.element.dataset.viewerState).toBe('open');
    session.request(false);
    expect(f.finished).toHaveBeenCalledOnce();
    expect(f.style.overflow).toBe('clip');
  });

  it.each([true, false])(
    'settles the current intention when reduced motion arrives (open=%s)',
    async (open) => {
      const f = fixture();
      const session = f.mount();
      await flush();
      if (!open) session.request(false);
      f.reduce(true);
      expect(f.revert).toHaveBeenCalledOnce();
      expect(f.element.open).toBe(open);
      if (open) {
        f.reduce(false);
        await flush();
        expect(f.createPhotoAnimation).toHaveBeenCalledOnce();
        expect(f.element.dataset.viewerState).toBe('open');
      }
      session.dispose();
    },
  );

  it('discards a late animation import after Escape during preparation or unmount', async () => {
    const f = fixture();
    let resolve!: (value: PhotoModule) => void;
    const load = vi.fn(
      () =>
        new Promise<PhotoModule>((done) => {
          resolve = done;
        }),
    );
    const session = f.mount(load);
    session.request(false);
    session.dispose();
    resolve(f.module);
    await flush();
    expect(f.createPhotoAnimation).not.toHaveBeenCalled();
    expect(f.element.open).toBe(false);
    expect(f.style.overflow).toBe('clip');
  });

  it('does not reveal a decoded image after the pending session has been disposed', async () => {
    const f = fixture();
    let decoded!: () => void;
    f.image.decode.mockImplementationOnce(
      () =>
        new Promise<void>((resolve) => {
          decoded = resolve;
        }),
    );
    const session = f.mount();
    await flush();
    expect(f.createPhotoAnimation).not.toHaveBeenCalled();
    session.dispose();
    decoded();
    await flush();
    expect(f.createPhotoAnimation).not.toHaveBeenCalled();
    expect(f.element.open).toBe(false);
  });

  it('restores the document if showModal fails before setup completes', () => {
    const f = fixture();
    f.element.showModal.mockImplementationOnce(() => {
      throw new Error('modal unavailable');
    });
    expect(() => f.mount()).toThrow('modal unavailable');
    expect(f.style.overflow).toBe('clip');
    expect(f.disconnect).toHaveBeenCalledOnce();
  });

  it.each(['import', 'decode', 'geometry'])(
    'keeps a usable static modal when %s fails',
    async (failure) => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const f = fixture();
      if (failure === 'import')
        f.load.mockRejectedValueOnce(new Error('offline'));
      if (failure === 'decode')
        f.image.decode.mockRejectedValueOnce(new Error('decode failed'));
      if (failure === 'geometry')
        f.createPhotoAnimation.mockImplementationOnce(() => {
          throw new Error('image removed');
        });
      const session = f.mount();
      await flush();
      expect(f.observe).toHaveBeenCalledWith(f.image);
      expect(f.element.dataset.viewerState).toBe('open');
      expect(f.content.inert).toBe(false);
      expect(f.move).not.toHaveBeenCalled();
      session.request(false);
      expect(f.finished).toHaveBeenCalledOnce();
      expect(f.style.overflow).toBe('clip');
      warn.mockRestore();
    },
  );

  it('reverts partial animation setup if the first destination measurement fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const f = fixture();
    f.move.mockImplementationOnce(() => {
      throw new Error('destination removed');
    });
    const session = f.mount();
    await flush();
    expect(f.revert).toHaveBeenCalledOnce();
    expect(f.content.inert).toBe(false);
    expect(f.element.dataset.viewerState).toBe('open');
    session.request(false);
    expect(f.element.open).toBe(false);
    warn.mockRestore();
  });

  it('coalesces resize/viewport/scroll and cancels pending work on dispose', async () => {
    const f = fixture();
    const session = f.mount();
    await flush();
    f.view.dispatchEvent(new Event('resize'));
    f.view.visualViewport.dispatchEvent(new Event('resize'));
    f.element.dispatchEvent(new Event('scroll'));
    expect(f.view.requestAnimationFrame).toHaveBeenCalledOnce();
    f.flushFrame();
    expect(f.refresh).toHaveBeenCalledWith(true);
    f.view.dispatchEvent(new Event('resize'));
    session.dispose();
    f.flushFrame();
    f.view.dispatchEvent(new Event('resize'));
    f.view.visualViewport.dispatchEvent(new Event('resize'));
    expect(f.refresh).toHaveBeenCalledOnce();
    expect(f.view.cancelAnimationFrame).toHaveBeenCalledOnce();
    expect(f.disconnect).toHaveBeenCalledOnce();
  });

  it('handles native close and cleans ten interrupted cycles with a removed opener', async () => {
    const f = fixture();
    for (let i = 0; i < 10; i++) {
      if (i === 9) f.opener.isConnected = false;
      const session = f.mount();
      await flush();
      session.request(false);
      f.element.close();
      session.dispose();
    }
    expect(f.finished).toHaveBeenCalledTimes(10);
    expect(f.revert).toHaveBeenCalledTimes(10);
    expect(f.opener.focus).toHaveBeenCalledTimes(9);
    expect(f.style.overflow).toBe('clip');
    f.element.dispatchEvent(new Event('cancel', { cancelable: true }));
    expect(f.move).toHaveBeenCalledTimes(20);
  });
});

describe('memory selection hook (effect harness)', () => {
  it.each(['ctrlKey', 'metaKey', 'shiftKey', 'altKey', 'button'])(
    'preserves native image navigation with %s',
    (key) => {
      const f = fixture();
      Object.assign(f.event, { [key]: key === 'button' ? 1 : true });
      render().openPhoto(f.event, demoStory.memories[0]!);
      expect(f.event.preventDefault).not.toHaveBeenCalled();
      expect(state.setSelection).not.toHaveBeenCalled();
    },
  );
  it('leaves the native link usable without dialog support', () => {
    const f = fixture();
    state.refs[0]!.current = {};
    render().openPhoto(f.event, demoStory.memories[0]!);
    expect(f.event.preventDefault).not.toHaveBeenCalled();
  });
  it('selects a photo, keeps repeated opens in one session and invalidates replaced data', () => {
    const f = fixture(true);
    render().openPhoto(f.event, demoStory.memories[0]!);
    expect(render().memory).toBe(demoStory.memories[0]);
    const cleanup = state.effect?.();
    render().openPhoto(f.event, demoStory.memories[0]!);
    expect(state.setSelection).toHaveBeenCalledOnce();
    expect(f.element.showModal).toHaveBeenCalledOnce();
    cleanup?.();
    const replacement = demoStory.memories.map((memory) => ({ ...memory }));
    expect(render(replacement).memory).toBeUndefined();
    expect(state.effect?.()).toBeUndefined();
    expect(f.element.open).toBe(false);
    expect(f.style.overflow).toBe('clip');
  });
});
