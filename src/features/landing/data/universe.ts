export const memories = [
  {
    id: 'mountain',
    src: '/images/demo-mountain.webp',
    alt: 'Una montaña entre nubes blancas',
    note: 'Hasta donde nos lleve el día.',
    depth: 12,
  },
  {
    id: 'forest',
    src: '/images/demo-forest.webp',
    alt: 'Un camino que atraviesa un bosque de otoño',
    note: 'Volvería a ese camino.',
    depth: 20,
  },
  {
    id: 'winter',
    src: '/images/demo-winter.webp',
    alt: 'Un sendero silencioso entre árboles nevados',
    note: 'Y el mundo se quedó en silencio.',
    depth: 8,
  },
] as const;

// Stable positions keep the server and first client render identical.
export const stars = Array.from({ length: 54 }, (_, i) => ({
  x: ((i * 73 + 13) % 997) / 10,
  y: ((i * 137 + 41) % 991) / 10,
  size: i % 11 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
  opacity: 0.22 + (i % 5) * 0.12,
  layer: i % 3,
}));
