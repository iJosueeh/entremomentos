type Rect = Pick<DOMRect, 'left' | 'top' | 'width' | 'height'>;

// One uniform scale preserves the image ratio; clipping accounts for drift and hover.
export function photoGeometry(
  image: Rect,
  window: Rect,
  intrinsicWidth: number,
) {
  if (image.width <= 0 || image.height <= 0 || intrinsicWidth <= 0)
    throw new Error('La fotografía todavía no tiene geometría.');
  const inset = [
    (window.top - image.top) / image.height,
    (image.left + image.width - window.left - window.width) / image.width,
    (image.top + image.height - window.top - window.height) / image.height,
    (window.left - image.left) / image.width,
  ].map((value) => Math.min(1, Math.max(0, value)) * 100);
  return {
    x: image.left,
    y: image.top,
    scale: image.width / intrinsicWidth,
    clipPath: `inset(${inset.map((value) => `${value}%`).join(' ')})`,
  };
}
