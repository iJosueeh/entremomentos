import { describe, expect, it, vi } from 'vitest';
import { connectLetter } from '../src/features/story-player/hooks/use-letter';

type LetterModule =
  typeof import('../src/features/story-player/animations/create-letter-animation');

function fixture(reduced = false) {
  const preference = Object.assign(new EventTarget(), { matches: reduced });
  const node = () =>
    Object.assign(new EventTarget(), {
      hidden: false,
      inert: false,
      textContent: '',
      attributes: new Map<string, string>(),
      setAttribute(name: string, value: string) {
        this.attributes.set(name, value);
      },
      focus: vi.fn(),
    });
  const toggle = node();
  const close = node();
  const paper = node();
  const label = node();
  const body = { scrollTop: 180 };
  const dialog = Object.assign(node(), {
    open: true,
    showModal: vi.fn(function (this: { open: boolean }) {
      this.open = true;
    }),
    close: vi.fn(function (this: { open: boolean }) {
      this.open = false;
    }),
    removeAttribute(name: string) {
      if (name === 'open') this.open = false;
    },
  });
  const style = { overflow: 'auto', scrollbarGutter: '' };
  const view = Object.assign(new EventTarget(), {
    matchMedia: () => preference,
    scrollX: 12,
    scrollY: 1200,
    scrollTo: vi.fn(),
    visualViewport: new EventTarget(),
  });
  let complete: (open: boolean) => void = () => {};
  const move = vi.fn();
  const revert = vi.fn();
  const createLetterAnimation = vi.fn((_root, settled) => {
    complete = settled;
    return { move, revert, refresh: vi.fn() };
  });
  const module = { createLetterAnimation } as unknown as LetterModule;
  const load = vi.fn(async () => module);
  const root = Object.assign(new EventTarget(), {
    dataset: {} as Record<string, string>,
    ownerDocument: { defaultView: view, documentElement: { style } },
    querySelector: (selector: string) =>
      ({
        '[data-letter-toggle]': toggle,
        '[data-letter-close]': close,
        '[data-letter-paper]': paper,
        '[data-letter-label]': label,
        '[data-letter-dialog]': dialog,
        '[data-letter-body]': body,
      })[selector],
  });
  return {
    root,
    toggle,
    close,
    paper,
    label,
    dialog,
    body,
    style,
    view,
    preference,
    load,
    module,
    move,
    revert,
    createLetterAnimation,
    mount: (loader = load) =>
      connectLetter(root as unknown as HTMLElement, loader)!,
    click: (target = toggle) => target.dispatchEvent(new Event('click')),
    complete: (open: boolean) => complete(open),
    escape: () => {
      const event = Object.assign(new Event('keydown', { cancelable: true }), {
        key: 'Escape',
      });
      root.dispatchEvent(event);
      return event;
    },
    reduce: (matches: boolean) => {
      preference.matches = matches;
      preference.dispatchEvent(new Event('change'));
    },
  };
}
const flush = async () => {
  await Promise.resolve();
  await Promise.resolve();
};

describe('letter interaction lifecycle (DOM event doubles)', () => {
  it('keeps internal reading independent of wheel events and decorative pause', async () => {
    const f = fixture();
    const cleanup = f.mount();
    await flush();
    f.click();
    f.complete(true);
    const calls = f.move.mock.calls.length;
    for (const deltaY of [600, -600, 1200, -1200]) {
      const event = Object.assign(new Event('wheel', { cancelable: true }), {
        deltaY,
      });
      expect(f.root.dispatchEvent(event)).toBe(true);
      expect(event.defaultPrevented).toBe(false);
      f.root.dataset.motionPaused = String(deltaY > 0);
      f.root.dispatchEvent(new Event('scroll'));
      expect(f.root.dataset.letterState).toBe('open');
    }
    expect(f.move).toHaveBeenCalledTimes(calls);
    cleanup();
  });
  it('exposes four states and returns focus only on explicit close', async () => {
    const f = fixture();
    const cleanup = f.mount();
    expect(f.paper.hidden).toBe(true);
    expect(f.root.dataset.letterState).toBe('closed');
    await flush();
    f.click();
    expect(f.root.dataset.letterState).toBe('opening');
    expect(f.toggle.attributes.get('aria-expanded')).toBe('true');
    expect(f.paper.hidden).toBe(false);
    expect(f.paper.inert).toBe(false);
    expect(f.paper.focus).toHaveBeenCalledWith({ preventScroll: true });
    f.complete(true);
    expect(f.root.dataset.letterState).toBe('open');
    f.click(f.close);
    expect(f.root.dataset.letterState).toBe('closing');
    expect(f.paper.inert).toBe(false);
    expect(f.paper.hidden).toBe(false);
    expect(f.toggle.focus).not.toHaveBeenCalled();
    expect(f.dialog.open).toBe(true);
    f.complete(false);
    expect(f.toggle.focus).toHaveBeenCalledWith({ preventScroll: true });
    expect(f.dialog.open).toBe(false);
    expect(f.paper.hidden).toBe(true);
    expect(f.root.dataset.letterState).toBe('closed');
    cleanup();
  });

  it('reverses rapid requests, ignores obsolete completions, and keeps close idempotent', async () => {
    const f = fixture();
    const cleanup = f.mount();
    await flush();
    f.move.mockClear();
    f.click();
    f.click();
    f.click();
    f.complete(false);
    expect(f.paper.hidden).toBe(false);
    expect(f.root.dataset.letterState).toBe('opening');
    f.complete(true);
    f.click(f.close);
    f.click(f.close);
    f.complete(true);
    expect(f.root.dataset.letterState).toBe('closing');
    f.complete(false);
    expect(f.move.mock.calls.map(([open]) => open)).toEqual([
      true,
      false,
      true,
      false,
      false,
    ]);
    expect(f.root.dataset.letterState).toBe('closed');
    cleanup();
  });

  it('handles Escape only when open; native button activation needs no custom Enter/Space handlers', async () => {
    const f = fixture();
    const cleanup = f.mount();
    await flush();
    expect(f.escape().defaultPrevented).toBe(false);
    f.click();
    expect(f.escape().defaultPrevented).toBe(true);
    expect(f.toggle.focus).not.toHaveBeenCalled();
    expect(f.escape().defaultPrevented).toBe(false);
    f.complete(false);
    expect(f.toggle.focus).toHaveBeenCalledOnce();
    cleanup();
  });

  it('opens and closes immediately with reduced motion without loading GSAP', () => {
    const f = fixture(true);
    const cleanup = f.mount();
    f.click();
    expect(f.root.dataset.letterState).toBe('open');
    expect(f.paper.hidden).toBe(false);
    f.escape();
    expect(f.root.dataset.letterState).toBe('closed');
    expect(f.load).not.toHaveBeenCalled();
    cleanup();
  });

  it.each(['opening', 'open', 'closing'])(
    'preserves the requested state when preferences change during %s',
    async (phase) => {
      const f = fixture();
      const cleanup = f.mount();
      await flush();
      f.click();
      if (phase !== 'opening') f.complete(true);
      if (phase === 'closing') f.click(f.close);
      const expected = phase !== 'closing';
      f.reduce(true);
      expect(f.revert).toHaveBeenCalledOnce();
      expect(f.paper.hidden).toBe(!expected);
      expect(f.root.dataset.letterState).toBe(expected ? 'open' : 'closed');
      const focusCount = f.paper.focus.mock.calls.length;
      f.reduce(false);
      await flush();
      expect(f.move).toHaveBeenLastCalledWith(expected, true);
      expect(f.paper.focus).toHaveBeenCalledTimes(focusCount);
      cleanup();
    },
  );

  it('discards stale imports across rapid preferences and uses the current open state', async () => {
    const f = fixture();
    let resolve!: (module: LetterModule) => void;
    const load = vi.fn(
      () =>
        new Promise<LetterModule>((done) => {
          resolve = done;
        }),
    );
    const cleanup = f.mount(load);
    f.click();
    f.reduce(true);
    f.reduce(false);
    f.reduce(true);
    f.reduce(false);
    resolve(f.module);
    await flush();
    expect(load).toHaveBeenCalledOnce();
    expect(f.createLetterAnimation).toHaveBeenCalledOnce();
    expect(f.move).toHaveBeenLastCalledWith(true, true);
    expect(f.paper.hidden).toBe(false);
    cleanup();
  });

  it('keeps content operable if the animation import or initialization fails', async () => {
    for (const loader of [
      async () => {
        throw new Error('offline');
      },
      async () =>
        ({
          createLetterAnimation: () => {
            throw new Error('initialization');
          },
        }) as unknown as LetterModule,
    ]) {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const f = fixture();
      const cleanup = f.mount(vi.fn(loader));
      await flush();
      f.click();
      expect(f.paper.hidden).toBe(false);
      f.click(f.close);
      expect(f.paper.hidden).toBe(true);
      expect(warn).toHaveBeenCalledOnce();
      cleanup();
      warn.mockRestore();
    }
  });

  it('cleans ten interrupted mounts, listeners and styles; restores the SSR reading state', async () => {
    const f = fixture();
    for (let index = 0; index < 10; index++) {
      const cleanup = f.mount();
      await flush();
      f.click();
      cleanup();
      expect(f.paper.hidden).toBe(false);
      expect(f.paper.inert).toBe(false);
      expect(f.toggle.hidden).toBe(true);
      expect(f.close.hidden).toBe(true);
      expect(f.root.dataset.letterState).toBeUndefined();
      const calls = f.move.mock.calls.length;
      f.click();
      f.click(f.close);
      f.escape();
      f.reduce(false);
      f.complete(false);
      expect(f.move).toHaveBeenCalledTimes(calls);
      expect(f.paper.hidden).toBe(false);
    }
    expect(f.revert).toHaveBeenCalledTimes(10);
  });

  it('locks the exterior, resets reading, and restores exact styles and position after reversal', async () => {
    const f = fixture();
    const targets = [
      f.root,
      f.toggle,
      f.close,
      f.dialog,
      f.view,
      f.view.visualViewport,
      f.preference,
    ];
    const listeners = targets.map((target) => ({
      add: vi.spyOn(target, 'addEventListener'),
      remove: vi.spyOn(target, 'removeEventListener'),
    }));
    const cleanup = f.mount();
    await flush();
    for (let index = 0; index < 10; index++) {
      f.click();
      expect(f.dialog.showModal).toHaveBeenCalledTimes(index + 1);
      expect(f.style).toEqual({
        overflow: 'hidden',
        scrollbarGutter: 'stable',
      });
      expect(f.body.scrollTop).toBe(0);
      f.complete(true);
      f.click(f.close);
      expect(f.style.overflow).toBe('hidden');
      expect(f.view.scrollTo).toHaveBeenCalledTimes(index);
      f.complete(false);
      expect(f.style).toEqual({ overflow: 'auto', scrollbarGutter: '' });
      expect(f.view.scrollTo).toHaveBeenLastCalledWith({
        left: 12,
        top: 1200,
        behavior: 'instant',
      });
    }
    f.click();
    cleanup();
    expect(f.style.overflow).toBe('auto');
    expect(f.createLetterAnimation).toHaveBeenCalledOnce();
    expect(f.revert).toHaveBeenCalledOnce();
    for (const { add, remove } of listeners)
      expect(remove.mock.calls).toEqual(add.mock.calls);
  });

  it('intercepts native cancel until the reverse completes and handles external native closure', async () => {
    const f = fixture();
    const cleanup = f.mount();
    await flush();
    f.click();
    const event = new Event('cancel', { cancelable: true });
    f.dialog.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(f.dialog.open).toBe(true);
    f.complete(false);
    f.click();
    f.dialog.open = false;
    f.dialog.dispatchEvent(new Event('close'));
    expect(f.root.dataset.letterState).toBe('closed');
    expect(f.toggle.attributes.get('aria-expanded')).toBe('false');
    expect(f.style.overflow).toBe('auto');
    cleanup();
  });

  it('settles the intended endpoint on viewport resize and removes its listeners', async () => {
    const f = fixture();
    const cleanup = f.mount();
    await flush();
    f.click();
    const animation = f.createLetterAnimation.mock.results[0]!.value;
    f.view.dispatchEvent(new Event('resize'));
    expect(animation.refresh).toHaveBeenLastCalledWith(true);
    expect(f.root.dataset.letterState).toBe('open');
    f.click(f.close);
    f.view.visualViewport.dispatchEvent(new Event('resize'));
    expect(animation.refresh).toHaveBeenLastCalledWith(false);
    expect(f.dialog.open).toBe(false);
    cleanup();
    f.view.dispatchEvent(new Event('resize'));
    expect(animation.refresh).toHaveBeenCalledTimes(2);
  });

  it('leaves SSR reading untouched when native modal support is missing', () => {
    const f = fixture();
    Object.assign(f.dialog, { showModal: undefined });
    expect(f.mount()).toBeUndefined();
    expect(f.paper.hidden).toBe(false);
    expect(f.load).not.toHaveBeenCalled();
  });

  it('ignores an animation module resolved after unmount', async () => {
    const f = fixture();
    let resolve!: (module: LetterModule) => void;
    const cleanup = f.mount(
      vi.fn(
        () =>
          new Promise((done) => {
            resolve = done;
          }),
      ),
    );
    f.click();
    cleanup();
    resolve(f.module);
    await flush();
    expect(f.createLetterAnimation).not.toHaveBeenCalled();
    expect(f.paper.hidden).toBe(false);
  });
});
