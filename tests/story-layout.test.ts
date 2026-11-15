import { describe, expect, it, vi } from 'vitest';
import { observePlayerLayout } from '../src/features/story-player/animations/observe-player-layout';

function fixture(fontsReady?: Promise<unknown>) {
  const frames = new Map<number, FrameRequestCallback>();
  const listeners = new Map<string, (event: Event) => void>();
  const disconnect = vi.fn();
  const observe = vi.fn();
  let resize: (() => void) | undefined;
  let nextFrame = 0;
  const view = {
    requestAnimationFrame: vi.fn((callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    }),
    cancelAnimationFrame: vi.fn((id: number) => frames.delete(id)),
    ResizeObserver: class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe = observe;
      disconnect = disconnect;
    },
  };
  const root = {
    ownerDocument: {
      defaultView: view,
      fonts: fontsReady ? { ready: fontsReady } : undefined,
    },
    addEventListener: vi.fn((type: string, callback: (event: Event) => void) =>
      listeners.set(type, callback),
    ),
    removeEventListener: vi.fn((type: string) => listeners.delete(type)),
  } as unknown as HTMLElement;
  return {
    root,
    view,
    disconnect,
    observe,
    resize: () => resize?.(),
    image: (type: 'load' | 'error', tagName = 'IMG') =>
      listeners.get(type)?.({ target: { tagName } } as unknown as Event),
    flush: () => {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(0));
    },
  };
}

describe('player layout refresh ownership', () => {
  it('batches image loads, errors, font readiness and resize into one frame', async () => {
    const f = fixture(Promise.resolve());
    const refresh = vi.fn();
    const cleanup = observePlayerLayout(f.root, refresh);
    f.image('load');
    f.image('error');
    f.resize();
    await Promise.resolve();
    expect(f.view.requestAnimationFrame).toHaveBeenCalledOnce();
    expect(refresh).not.toHaveBeenCalled();
    f.flush();
    expect(refresh).toHaveBeenCalledOnce();
    f.resize();
    f.flush();
    expect(refresh).toHaveBeenCalledTimes(2);
    expect(f.observe).toHaveBeenCalledWith(f.root);
    cleanup();
  });

  it('ignores non-image events and cancels pending and late callbacks on disposal', async () => {
    let finishFonts: (() => void) | undefined;
    const ready = new Promise<void>((resolve) => {
      finishFonts = resolve;
    });
    const f = fixture(ready);
    const refresh = vi.fn();
    const cleanup = observePlayerLayout(f.root, refresh);
    f.image('load', 'SCRIPT');
    expect(f.view.requestAnimationFrame).not.toHaveBeenCalled();
    f.image('error');
    cleanup();
    finishFonts?.();
    await ready;
    f.resize();
    f.image('load');
    f.flush();
    expect(refresh).not.toHaveBeenCalled();
    expect(f.view.cancelAnimationFrame).toHaveBeenCalledOnce();
    expect(f.disconnect).toHaveBeenCalledOnce();
    expect(f.root.removeEventListener).toHaveBeenCalledTimes(2);
  });
});
