import { describe, expect, it } from 'vitest';
import { storySchema } from '../src/features/story-player/dev/schemas/story';
import { demoStory } from '../src/features/story-player/dev/data/demo-story';

describe('story contract', () => {
  it('accepts the M0 fixture', () => {
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
  it('rejects empty stories and unsupported themes', () => {
    expect(storySchema.safeParse({ ...demoStory, memories: [] }).success).toBe(
      false,
    );
    expect(
      storySchema.safeParse({ ...demoStory, theme: 'unknown' }).success,
    ).toBe(false);
  });
});
