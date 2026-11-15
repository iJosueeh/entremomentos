import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StoryPlayer } from '../src/features/story-player';
import { storySchema, demoStory } from '../src/features/story-player/document';
import { dannaStory } from '../src/features/story-player/local/danna-story';

describe('Story V2 dedications', () => {
  it('accepts zero memories while keeping existing dated documents valid', () => {
    expect(storySchema.parse(dannaStory)).toEqual(dannaStory);
    expect(dannaStory.memories).toEqual([]);
    expect(storySchema.parse(demoStory)).toEqual(demoStory);
    expect(demoStory.memories).toHaveLength(3);
    expect(demoStory.scenes.letter.signature).toBe('Alma');
  });

  it.each([undefined, null, '', 'Sin fecha', '2026-02-30'])(
    'still rejects an actual memory with date %s',
    (date) => {
      expect(
        storySchema.safeParse({
          ...dannaStory,
          memories: [{ ...demoStory.memories[0], date }],
        }).success,
      ).toBe(false);
    },
  );

  it('does not silently supply a missing memories array', () => {
    expect(
      storySchema.safeParse({ ...dannaStory, memories: undefined }).success,
    ).toBe(false);
  });

  it('renders all approved scenes and a single complete letter without fake memories or photos', () => {
    const html = renderToStaticMarkup(
      createElement(StoryPlayer, { story: dannaStory }),
    );
    expect(
      [...html.matchAll(/data-scene="([^"]+)"/g)].map((match) => match[1]),
    ).toEqual([
      'intro',
      'connection',
      'memories',
      'discovery',
      'letter',
      'epilogue',
    ]);
    expect(html).toContain(dannaStory.title);
    for (const scene of Object.values(dannaStory.scenes)) {
      if ('title' in scene) expect(html).toContain(scene.title);
      if ('paragraphs' in scene)
        for (const paragraph of scene.paragraphs)
          expect(html).toContain(paragraph);
    }
    for (const paragraph of dannaStory.scenes.memories.introduction.split(
      '\n\n',
    ))
      expect(html).toContain(`<p>${paragraph}</p>`);
    const letter = html.slice(
      html.indexOf('data-scene="letter"'),
      html.indexOf('data-scene="epilogue"'),
    );
    for (const paragraph of dannaStory.scenes.letter.paragraphs)
      expect(letter.split(paragraph)).toHaveLength(2);
    expect(letter.split('Con mucho cariño, Josue')).toHaveLength(2);
    expect(letter.match(/data-letter-paper/g)).toHaveLength(1);
    expect(letter).toContain('data-letter-toggle');
    expect(letter).toContain('data-letter-close');
    expect(html.match(/data-letter-dialog/g)).toHaveLength(1);
    expect(html).not.toMatch(/<time\b|<img\b|<details\b/);
    expect(html).not.toContain('story-player__memories');
    expect(html).not.toContain('Recuerdos que permanecen');
    expect(html).not.toMatch(/Alma|Nico|2024-|2025-/);
    const ids = new Set(
      [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
    );
    const anchors = [...html.matchAll(/href="#([^"]+)"/g)];
    expect(anchors).toHaveLength(8);
    for (const [, target] of anchors) expect(ids.has(target)).toBe(true);
  });

  it('supports other dedications with no recipient-specific renderer logic', () => {
    const story = storySchema.parse({
      ...demoStory,
      id: 'para-mi-familia',
      title: 'Para mi familia',
      memories: [],
    });
    const html = renderToStaticMarkup(createElement(StoryPlayer, { story }));
    expect(html).toContain('Para mi familia');
    expect(html).not.toContain('<time');
    expect(html).not.toContain('<details');
    expect(html).not.toContain('Danna');
    expect(html).toContain('Volver al comienzo');
  });
});
