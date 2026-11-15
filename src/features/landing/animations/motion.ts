export const universeMotion = {
  entrance: { duration: 1.15, distance: 22, ease: 'power3.out', stagger: 0.13 },
  reveal: { duration: 1, distance: 28, ease: 'power3.out' },
  float: { distance: 9, duration: 6.5, stagger: 1.7 },
  atmosphere: { distance: 16, duration: 24 },
  pointer: { duration: 0.9, ease: 'power2.out' },
} as const;

export const storyMotion = {
  desktop: '(min-width: 1024px) and (min-height: 720px)',
  pinViewport: 0.65,
  scrub: 0.5,
} as const;
