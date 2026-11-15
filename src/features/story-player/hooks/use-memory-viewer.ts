import { useLayoutEffect, useRef, useState, type MouseEvent } from 'react';
import type { Story } from '../schemas/story';

type PhotoModule = typeof import('../animations/create-photo-animation');

// Functional motion owns its own lifetime; decorative pause never closes a photo.
export function connectMemoryViewer(
  element: HTMLDialogElement,
  opener: HTMLAnchorElement,
  finished: () => void,
  load: () => Promise<PhotoModule> = () =>
    import('../animations/create-photo-animation'),
) {
  const doc = element.ownerDocument;
  const view = doc.defaultView;
  const preference = view?.matchMedia('(prefers-reduced-motion: reduce)');
  const image = element.querySelector<HTMLImageElement>(
    '.story-player__photo img',
  );
  const close = element.querySelector<HTMLButtonElement>('button');
  const content = element.querySelector<HTMLElement>('[data-viewer-content]');
  const previousOverflow = doc.documentElement.style.overflow;
  const position = {
    left: view?.scrollX ?? 0,
    top: view?.scrollY ?? 0,
    behavior: 'instant' as const,
  };
  let disposed = false;
  let wantedOpen = true;
  let generation = 0;
  let frame: number | undefined;
  let animation: ReturnType<PhotoModule['createPhotoAnimation']> | undefined;
  let module: Promise<PhotoModule> | undefined;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    generation++;
    animation?.revert();
    preference?.removeEventListener('change', syncMotion);
    view?.removeEventListener('resize', resize);
    view?.visualViewport?.removeEventListener('resize', resize);
    element.removeEventListener('scroll', resize);
    element.removeEventListener('cancel', cancel);
    element.removeEventListener('close', nativeClose);
    close?.removeEventListener('click', closePhoto);
    observer?.disconnect();
    if (frame !== undefined) view?.cancelAnimationFrame(frame);
    if (element.open) element.close();
    delete element.dataset.viewerState;
    if (content) content.inert = false;
    doc.documentElement.style.overflow = previousOverflow;
    if (opener.isConnected) opener.focus({ preventScroll: true });
    view?.scrollTo(position);
  };
  const settled = (open: boolean) => {
    if (disposed || open !== wantedOpen) return;
    element.dataset.viewerState = open ? 'open' : 'closed';
    if (content) content.inert = false;
    if (!open) {
      dispose();
      finished();
    }
  };
  const request = (open: boolean) => {
    if (disposed || open === wantedOpen) return;
    wantedOpen = open;
    if (animation) {
      element.dataset.viewerState = open ? 'opening' : 'closing';
      try {
        animation.move(open);
      } catch {
        animation.revert();
        animation = undefined;
        settled(open);
      }
    } else settled(open);
  };
  const closePhoto = () => request(false);
  const cancel = (event: Event) => {
    event.preventDefault();
    request(false);
  };
  const nativeClose = () => {
    if (!disposed && !element.open) {
      dispose();
      finished();
    }
  };
  const resize = () => {
    if (disposed || !animation || !view || frame !== undefined) return;
    frame = view.requestAnimationFrame(() => {
      frame = undefined;
      if (!disposed) {
        try {
          animation?.refresh(wantedOpen);
        } catch {
          animation?.revert();
          animation = undefined;
          settled(wantedOpen);
        }
      }
    });
  };
  const observer = view?.ResizeObserver
    ? new view.ResizeObserver(resize)
    : undefined;
  async function syncMotion() {
    const current = ++generation;
    animation?.revert();
    animation = undefined;
    if (preference?.matches || !image) {
      settled(wantedOpen);
      return;
    }
    // Never replay an entrance when preferences change with the viewer already open.
    if (element.dataset.viewerState !== 'preparing') {
      settled(wantedOpen);
      return;
    }
    try {
      module ??= load();
      const [{ createPhotoAnimation }] = await Promise.all([
        module,
        image.decode?.(),
      ]);
      if (disposed || current !== generation) return;
      animation = createPhotoAnimation(element, opener, image, settled);
      element.dataset.viewerState = wantedOpen ? 'opening' : 'closing';
      if (content) content.inert = false;
      animation.move(wantedOpen);
    } catch (error: unknown) {
      if (!disposed && current === generation) {
        animation?.revert();
        animation = undefined;
        settled(wantedOpen);
        console.warn('La fotografía conserva su visor sin animación.', error);
      }
    }
  }

  element.dataset.viewerState = preference?.matches ? 'open' : 'preparing';
  if (content) content.inert = !preference?.matches;
  // Lock before measuring either endpoint. The stable gutter prevents a width shift.
  doc.documentElement.style.overflow = 'hidden';
  try {
    element.showModal();
  } catch (error) {
    dispose();
    throw error;
  }
  close?.focus({ preventScroll: true });
  preference?.addEventListener('change', syncMotion);
  view?.addEventListener('resize', resize);
  view?.visualViewport?.addEventListener('resize', resize);
  element.addEventListener('scroll', resize);
  element.addEventListener('cancel', cancel);
  element.addEventListener('close', nativeClose);
  close?.addEventListener('click', closePhoto);
  if (image) observer?.observe(image);
  void doc.fonts?.ready.then(resize);
  void syncMotion();
  return { request, dispose };
}

export function useMemoryViewer(memories: Story['memories']) {
  const dialog = useRef<HTMLDialogElement>(null);
  const session = useRef<ReturnType<typeof connectMemoryViewer> | undefined>(
    undefined,
  );
  const [selection, setSelection] = useState<{
    memory: Story['memories'][number];
    opener: HTMLAnchorElement;
  }>();
  const memory =
    selection && memories.includes(selection.memory)
      ? selection.memory
      : undefined;

  useLayoutEffect(() => {
    const element = dialog.current;
    if (!element || !memory || !selection) return;
    session.current = connectMemoryViewer(element, selection.opener, () =>
      setSelection(undefined),
    );
    return () => {
      session.current?.dispose();
      session.current = undefined;
    };
  }, [memory, selection]);

  const openPhoto = (
    event: MouseEvent<HTMLAnchorElement>,
    memory: Story['memories'][number],
  ) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      typeof dialog.current?.showModal !== 'function'
    )
      return;
    event.preventDefault();
    if (session.current) session.current.request(true);
    else setSelection({ memory, opener: event.currentTarget });
  };
  return {
    dialog,
    memory,
    openPhoto,
    closePhoto: () => session.current?.request(false),
  };
}
