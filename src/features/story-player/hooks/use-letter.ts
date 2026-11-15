import { useEffect, useRef } from 'react';
import type { Story } from '../schemas/story';

type LetterModule = typeof import('../animations/create-letter-animation');

// Functional modality is independent of decorative motion and story navigation.
export function connectLetter(
  root: HTMLElement,
  load: () => Promise<LetterModule> = () =>
    import('../animations/create-letter-animation'),
) {
  const toggle = root.querySelector<HTMLButtonElement>('[data-letter-toggle]');
  const close = root.querySelector<HTMLButtonElement>('[data-letter-close]');
  const paper = root.querySelector<HTMLElement>('[data-letter-paper]');
  const label = root.querySelector<HTMLElement>('[data-letter-label]');
  const dialog = root.querySelector<HTMLDialogElement>('[data-letter-dialog]');
  const body = root.querySelector<HTMLElement>('[data-letter-body]');
  if (!toggle || !close || !paper || !label || !dialog?.showModal) return;
  const doc = root.ownerDocument;
  const view = doc.defaultView;
  let scroll:
    { left: number; top: number; overflow: string; gutter: string } | undefined;
  const release = () => {
    if (!scroll) return;
    const saved = scroll;
    scroll = undefined;
    doc.documentElement.style.overflow = saved.overflow;
    doc.documentElement.style.scrollbarGutter = saved.gutter;
    toggle.focus({ preventScroll: true });
    view?.scrollTo({ left: saved.left, top: saved.top, behavior: 'instant' });
  };
  const preference = root.ownerDocument.defaultView?.matchMedia(
    '(prefers-reduced-motion: reduce)',
  );
  let wantedOpen = false;
  let disposed = false;
  let generation = 0;
  let module: Promise<LetterModule> | undefined;
  let animation: ReturnType<LetterModule['createLetterAnimation']> | undefined;

  const settled = (open: boolean) => {
    if (disposed || open !== wantedOpen) return;
    root.dataset.letterState = open ? 'open' : 'closed';
    paper.hidden = !open;
    if (!open) {
      if (dialog.open) dialog.close();
      release();
    }
  };
  const request = (open: boolean) => {
    wantedOpen = open;
    paper.hidden = false;
    if (open && !dialog.open) {
      scroll = {
        left: view?.scrollX ?? 0,
        top: view?.scrollY ?? 0,
        overflow: doc.documentElement.style.overflow,
        gutter: doc.documentElement.style.scrollbarGutter,
      };
      doc.documentElement.style.scrollbarGutter = 'stable';
      doc.documentElement.style.overflow = 'hidden';
      dialog.showModal();
      if (body) body.scrollTop = 0;
    }
    toggle.setAttribute('aria-expanded', String(open));
    label.textContent = open ? 'Cerrar carta' : 'Abrir carta';
    if (open) {
      paper.inert = false;
      paper.focus({ preventScroll: true });
    }
    if (animation) {
      root.dataset.letterState = open ? 'opening' : 'closing';
      animation.move(open);
    } else settled(open);
  };
  const onToggle = () => request(!wantedOpen);
  const onClose = () => request(false);
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && wantedOpen) {
      event.preventDefault();
      request(false);
    }
  };
  const onCancel = (event: Event) => {
    event.preventDefault();
    request(false);
  };
  const onNativeClose = () => {
    if (!dialog.open) {
      wantedOpen = false;
      toggle.setAttribute('aria-expanded', 'false');
      label.textContent = 'Abrir carta';
      animation?.move(false, true);
      settled(false);
    }
  };
  const onResize = () => {
    if (!dialog.open) return;
    animation?.refresh(wantedOpen);
    settled(wantedOpen);
  };
  const syncMotion = async () => {
    const current = ++generation;
    animation?.revert();
    animation = undefined;
    settled(wantedOpen);
    if (preference?.matches) return;
    try {
      module ??= load();
      const { createLetterAnimation } = await module;
      if (disposed || current !== generation) return;
      animation = createLetterAnimation(root, settled);
      animation.move(wantedOpen, true);
    } catch (error: unknown) {
      module = undefined;
      if (!disposed && current === generation)
        console.warn('La carta conserva su apertura sin animación.', error);
    }
  };

  dialog.removeAttribute('open');
  toggle.hidden = false;
  close.hidden = false;
  toggle.setAttribute('aria-expanded', 'false');
  paper.hidden = true;
  paper.inert = true;
  settled(false);
  toggle.addEventListener('click', onToggle);
  close.addEventListener('click', onClose);
  root.addEventListener('keydown', onKey);
  dialog.addEventListener('cancel', onCancel);
  dialog.addEventListener('close', onNativeClose);
  view?.addEventListener('resize', onResize);
  view?.visualViewport?.addEventListener('resize', onResize);
  preference?.addEventListener('change', syncMotion);
  void syncMotion();
  return () => {
    disposed = true;
    generation++;
    preference?.removeEventListener('change', syncMotion);
    toggle.removeEventListener('click', onToggle);
    close.removeEventListener('click', onClose);
    root.removeEventListener('keydown', onKey);
    dialog.removeEventListener('cancel', onCancel);
    dialog.removeEventListener('close', onNativeClose);
    view?.removeEventListener('resize', onResize);
    view?.visualViewport?.removeEventListener('resize', onResize);
    animation?.revert();
    if (dialog.open) dialog.close();
    release();
    dialog.setAttribute('open', '');
    delete root.dataset.letterState;
    paper.hidden = false;
    paper.inert = false;
    toggle.hidden = true;
    close.hidden = true;
    toggle.setAttribute('aria-expanded', 'true');
    label.textContent = 'Abrir carta';
  };
}

export function useLetter(content: Story['scenes']['letter']) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (root.current) return connectLetter(root.current);
  }, [content]);
  return root;
}
