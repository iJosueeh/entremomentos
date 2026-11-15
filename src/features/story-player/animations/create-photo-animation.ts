import { gsap } from 'gsap';
import { photoGeometry } from './photo-geometry';
import { playerMotion } from './motion';

export function createPhotoAnimation(
  dialog: HTMLDialogElement,
  opener: HTMLAnchorElement,
  image: HTMLImageElement,
  settled: (open: boolean) => void,
) {
  const source = opener.querySelector<HTMLImageElement>('img');
  const window = opener.querySelector<HTMLElement>(
    '.story-player__photo-window',
  );
  if (!source || !window)
    throw new Error('No existe una fotografía de origen.');
  const proxy = image.cloneNode() as HTMLImageElement;
  proxy.className = 'story-player__viewer-proxy';
  proxy.alt = '';
  proxy.setAttribute('aria-hidden', 'true');
  proxy.loading = 'eager';
  const chrome = dialog.querySelectorAll('[data-viewer-chrome]');
  const base = image.getBoundingClientRect();
  const width = base.width;
  proxy.style.width = `${width}px`;
  proxy.style.height = `${base.height}px`;
  const shade = dialog.querySelector('[data-viewer-shade]');
  const context = gsap.context(() => {}, dialog);
  let timeline: gsap.core.Timeline | undefined;
  let settledOpen = false;
  const origin = () => ({
    ...photoGeometry(
      source.getBoundingClientRect(),
      window.getBoundingClientRect(),
      width,
    ),
    opacity: Number(
      dialog.ownerDocument.defaultView?.getComputedStyle(
        opener.closest('[data-memory-reveal]') ?? opener,
      ).opacity ?? 1,
    ),
  });
  const destination = () => {
    const rect = image.getBoundingClientRect();
    return photoGeometry(rect, rect, width);
  };
  try {
    const first = origin();
    dialog.append(proxy);
    context.add(() => {
      gsap.set(proxy, { ...first, transformOrigin: '0 0' });
      gsap.set([window, image], { visibility: 'hidden' });
      gsap.set(chrome, { opacity: 0 });
      gsap.set(shade, { opacity: 0 });
    });
  } catch (error) {
    context.revert();
    proxy.remove();
    throw error;
  }
  return {
    move(open: boolean) {
      // Retarget from the rendered position, including interruptions and resize.
      const target = open ? { ...destination(), opacity: 1 } : origin();
      timeline?.kill();
      context.add(() => {
        if (settledOpen) {
          gsap.set(proxy, { ...destination(), visibility: 'visible' });
          gsap.set(image, { visibility: 'hidden' });
        }
        settledOpen = false;
        timeline = gsap.timeline({
          defaults: {
            duration: playerMotion.photo.duration,
            ease: playerMotion.photo.ease,
          },
          onComplete: () => {
            settledOpen = open;
            if (open)
              context.add(() => {
                gsap.set(image, { visibility: 'visible' });
                gsap.set(proxy, { visibility: 'hidden' });
              });
            settled(open);
          },
        });
        timeline
          .to(proxy, target, 0)
          .to(shade, { opacity: open ? 1 : 0 }, 0)
          .to(chrome, { opacity: open ? 1 : 0 }, 0);
      });
    },
    refresh(open: boolean) {
      if (!settledOpen) this.move(open);
    },
    revert() {
      context.revert();
      proxy.remove();
    },
  };
}
