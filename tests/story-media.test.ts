import { describe, expect, it } from 'vitest';
import { imageSchema } from '../src/features/story-player/schemas/media';
import { demoStory } from '../src/features/story-player/data/demo-story';

const image = demoStory.memories[0]!.image!;

describe('story media', () => {
  it.each(['/images/photo.webp', 'https://example.org/photo.jpg'])(
    'accepts %s',
    (src) => {
      expect(imageSchema.safeParse({ ...image, src }).success).toBe(true);
    },
  );

  it.each([
    'photo.jpg',
    '//example.org/a.jpg',
    '/\\example.org/a.jpg',
    '/\n/example.org',
    'javascript:alert(1)',
    'data:image/png;base64,a',
    'http://example.org/a.jpg',
  ])('rejects unsafe or unsupported source %s', (src) => {
    expect(imageSchema.safeParse({ ...image, src }).success).toBe(false);
  });

  it('requires alt text, real dimensions and valid credit links', () => {
    for (const invalid of [
      { alt: ' ' },
      { width: 0 },
      { height: -1 },
      { width: 1.5 },
      { credit: { ...image.credit, licenseUrl: 'javascript:alert(1)' } },
    ]) {
      expect(imageSchema.safeParse({ ...image, ...invalid }).success).toBe(
        false,
      );
    }
    expect(imageSchema.safeParse({ ...image, credit: undefined }).success).toBe(
      true,
    );
  });
});
