import { describe, expect, it } from 'vitest';
import { storySchema } from '../src/features/story-player/schemas/story';
import { demoStory } from '../src/features/story-player/data/demo-story';

describe('story V2 contract', () => {
  it('accepts the Alma and Nico fixture', () => {
    expect(storySchema.safeParse(demoStory).success).toBe(true);
  });
  it.each(['2026-02-30', 'ayer', '2026-13-01'])(
    'rejects invalid calendar date %s',
    (date) => {
      expect(
        storySchema.safeParse({
          ...demoStory,
          memories: [{ ...demoStory.memories[0], date }],
        }).success,
      ).toBe(false);
    },
  );
  it('rejects duplicate memory identifiers', () => {
    expect(
      storySchema.safeParse({
        ...demoStory,
        memories: [demoStory.memories[0], demoStory.memories[0]],
      }).success,
    ).toBe(false);
  });
  it('accepts dedications without memories and rejects unsupported themes', () => {
    expect(storySchema.safeParse({ ...demoStory, memories: [] }).success).toBe(
      true,
    );
    expect(
      storySchema.safeParse({ ...demoStory, theme: 'unknown' }).success,
    ).toBe(false);
  });

  it.each([undefined, 1, 3])(
    'rejects unsupported schema version %s',
    (schemaVersion) => {
      expect(
        storySchema.safeParse({ ...demoStory, schemaVersion }).success,
      ).toBe(false);
    },
  );

  it.each([
    'intro',
    'connection',
    'memories',
    'discovery',
    'letter',
    'epilogue',
  ] as const)('requires the %s scene', (scene) => {
    const scenes: Partial<typeof demoStory.scenes> = { ...demoStory.scenes };
    delete scenes[scene];
    expect(storySchema.safeParse({ ...demoStory, scenes }).success).toBe(false);
  });

  it.each([1, 3, 12, 100])(
    'accepts %i distinct text-only memories',
    (count) => {
      const memories = Array.from({ length: count }, (_, i) => ({
        ...demoStory.memories[0],
        id: `memory-${i}`,
        image: undefined,
      }));
      expect(storySchema.safeParse({ ...demoStory, memories }).success).toBe(
        true,
      );
    },
  );

  it('rejects more than 100 memories and empty or oversized copy', () => {
    const memories = Array.from({ length: 101 }, (_, i) => ({
      ...demoStory.memories[0],
      id: `memory-${i}`,
    }));
    expect(storySchema.safeParse({ ...demoStory, memories }).success).toBe(
      false,
    );
    for (const paragraphs of [[], ['  '], ['x'.repeat(4001)]]) {
      expect(
        storySchema.safeParse({
          ...demoStory,
          scenes: { ...demoStory.scenes, intro: { paragraphs } },
        }).success,
      ).toBe(false);
    }
    expect(
      storySchema.safeParse({ ...demoStory, title: 'x'.repeat(121) }).success,
    ).toBe(false);
  });

  it.each([
    'Una amistad',
    'Nuestra familia',
    'Una vida en pareja',
    'Mi barrio',
  ])('requires no relationship roles for %s', (title) => {
    expect(storySchema.safeParse({ ...demoStory, title }).success).toBe(true);
  });
});
