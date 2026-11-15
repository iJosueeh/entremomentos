export function observePlayerLayout(root: HTMLElement, refresh: () => void) {
  const view = root.ownerDocument.defaultView;
  let active = true;
  let frame: number | undefined;
  const schedule = () => {
    if (!active || frame !== undefined || !view) return;
    frame = view.requestAnimationFrame(() => {
      frame = undefined;
      if (active) refresh();
    });
  };
  const onImage = (event: Event) => {
    if ((event.target as Element | null)?.tagName === 'IMG') schedule();
  };
  const observer = view?.ResizeObserver
    ? new view.ResizeObserver(schedule)
    : undefined;
  observer?.observe(root);
  root.addEventListener('load', onImage, true);
  root.addEventListener('error', onImage, true);
  void root.ownerDocument.fonts?.ready.then(schedule);
  return () => {
    active = false;
    observer?.disconnect();
    root.removeEventListener('load', onImage, true);
    root.removeEventListener('error', onImage, true);
    if (frame !== undefined) view?.cancelAnimationFrame(frame);
  };
}
