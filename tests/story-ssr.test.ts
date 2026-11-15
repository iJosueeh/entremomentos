import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { StoryPlayer } from '../src/features/story-player';
import { storySchema, demoStory } from '../src/features/story-player/document';

function render(story = demoStory) {
  return renderToStaticMarkup(createElement(StoryPlayer, { story }));
}

describe('StoryPlayer SSR', () => {
  it('keeps the final atmosphere outside the composition and the return link readable in SSR', () => {
    const html = render().split('class="story-player__epilogue"')[1]!;
    const composition = html.indexOf('class="story-player__epilogue-content"');
    expect(composition).toBeGreaterThan(
      html.indexOf('story-player__atmosphere--epilogue'),
    );
    expect(html.slice(composition)).not.toContain('data-atmosphere=');
    expect(html.slice(composition)).toContain('Volver al comienzo');
    expect(html.match(/pathLength="1"/g)).toHaveLength(2);
  });
  it('keeps the gallery atmosphere and modal outside the editorial content plane', () => {
    const html = render();
    const gallery = html.match(
      /<section class="story-player__gallery"[\s\S]*?<\/section>/,
    )?.[0];
    expect(gallery).toBeDefined();
    const contentStart = gallery!.indexOf(
      'class="story-player__gallery-content"',
    );
    expect(contentStart).toBeGreaterThan(
      gallery!.indexOf('data-atmosphere="true"'),
    );
    expect(gallery).toMatch(/<\/ol><\/div><dialog\b/);
    const content = gallery!.slice(contentStart, gallery!.indexOf('<dialog'));
    for (const memory of demoStory.memories) {
      expect(content).toContain(memory.message);
      expect(content).toContain(`href="${memory.image!.src}"`);
    }
    expect(content).not.toContain('data-atmosphere=');
    expect(content).not.toContain('story-player__viewer');
  });

  it('retains the same gallery layering for text-only stories without image placeholders', () => {
    const html = render(
      storySchema.parse({
        ...demoStory,
        memories: demoStory.memories.map((memory) => ({
          ...memory,
          image: undefined,
        })),
      }),
    );
    expect(html).toContain('class="story-player__gallery-content"');
    expect(html).toMatch(/<\/ol><\/div><dialog\b/);
    expect(html).not.toContain('story-player__atmosphere-photo');
    expect(html).not.toContain('<img');
  });
  it('renders distinct, decorative atmospheres without duplicating narrative images or data', () => {
    const html = render();
    for (const kind of ['memories', 'discovery', 'letter', 'epilogue']) {
      expect(html).toContain(`story-player__atmosphere--${kind}`);
    }
    expect(html.match(/data-atmosphere="true"/g)).toHaveLength(5);
    expect(html.match(/story-player__album-leaves/g)).toHaveLength(1);
    expect(html.match(/<img\b/g)).toHaveLength(3);
    expect(html).toContain('background-image:url(');
    expect(
      html.match(/class="story-player__sky" aria-hidden="true"/g),
    ).toHaveLength(2);
  });
  it('renders all scenes in narrative order with the full story before JavaScript', () => {
    const html = render();
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
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    for (const scene of Object.values(demoStory.scenes)) {
      if ('paragraphs' in scene)
        for (const paragraph of scene.paragraphs)
          expect(html).toContain(paragraph);
    }
    for (const memory of demoStory.memories)
      expect(html).toContain(memory.message);
    expect(html).toContain(demoStory.scenes.letter.signature);
    expect(html).toContain('data-motion-paused="false"');
    expect(html).toContain('data-reduced-motion="false"');
    expect(html).toMatch(/<button[^>]*hidden=""/);
  });

  it('provides native scene anchors with focusable targets and a return link', () => {
    const html = render();
    const targets = new Set(
      [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]),
    );
    const links = [...html.matchAll(/href="#([^"]+)"/g)].map(
      (match) => match[1],
    );
    expect(links).toHaveLength(8 + demoStory.memories.length);
    for (const target of links) {
      expect(targets.has(target)).toBe(true);
      expect(html).toContain(`id="${target}" tabindex="-1"`);
    }
    expect(html).toContain('aria-label="Escenas de la historia"');
  });

  it('renders a mix of illustrated and text-only memories without losing text', () => {
    const story = storySchema.parse({
      ...demoStory,
      memories: demoStory.memories.map((memory, index) => ({
        ...memory,
        image: index === 1 ? undefined : memory.image,
      })),
    });
    const html = render(story);
    expect(html.match(/<img\b/g)).toHaveLength(2);
    expect(html).toContain(story.memories[1]!.message);
    expect(html).toContain('width="640" height="423" loading="lazy"');
    expect(html).toContain('Paula Vermeulen');
    expect(html).toContain('Unsplash License');
    expect(html.match(/class="story-player__photo-link"/g)).toHaveLength(2);
    expect(html).toContain('data-has-image="false"');
  });

  it('provides native image links and a single closed optional viewer', () => {
    const html = render();
    expect(html.match(/<dialog\b/g)).toHaveLength(2);
    expect(html).toMatch(/<dialog[^>]*class="story-player__viewer"[^>]*>/);
    expect(html.match(/<dialog[^>]*\sopen=""/g)).toHaveLength(1);
    expect(html.match(/<img\b/g)).toHaveLength(3);
    expect(html.match(/data-memory-reveal=/g)).toHaveLength(3);
    expect(html).toContain('Cerrar fotografía');
    expect(html).toContain('15 de junio de 2024');
    for (const memory of demoStory.memories) {
      expect(html).toContain(`href="${memory.image!.src}"`);
      expect(html).toContain(
        `aria-label="Ampliar fotografía: ${memory.title}"`,
      );
    }
  });

  it.each([1, 12, 100])(
    'renders %i text-only memories without placeholders',
    (count) => {
      const memories = Array.from({ length: count }, (_, index) => ({
        ...demoStory.memories[0],
        id: `memory-${index}`,
        image: undefined,
      }));
      const html = render(storySchema.parse({ ...demoStory, memories }));
      expect(html.match(/<time\b/g)).toHaveLength(count);
      expect(html).not.toContain('<img');
      expect(html).toContain(demoStory.scenes.epilogue.title);
    },
  );

  it('escapes narrative text instead of treating it as markup', () => {
    const html = render(
      storySchema.parse({
        ...demoStory,
        title: '<script>alert("story")</script>',
      }),
    );
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
  });

  it('renders a deterministic, finished celestial opening without hiding content', () => {
    const html = render();
    expect(render()).toBe(html);
    expect(html).toContain('class="story-player__sky" aria-hidden="true"');
    expect(html).toMatch(
      /data-connection-visual="(?:true)?" aria-hidden="true"/,
    );
    expect(html).toContain('data-connection-light="first"');
    expect(html).toContain('data-connection-light="second"');
    const opening = html.slice(0, html.indexOf('data-scene="memories"'));
    expect(opening.match(/pathLength="1"/g)).toHaveLength(2);
    expect(html).not.toMatch(/style="[^"]*(?:opacity|visibility|transform)/);
    expect(html).not.toContain('aria-busy');
  });

  it('keeps generic multi-paragraph opening content intact', () => {
    const paragraphs = [
      'Para nuestra familia.',
      'Un camino compartido.\nSin prisa.',
    ];
    const story = storySchema.parse({
      ...demoStory,
      title: 'Las tardes de casa',
      scenes: {
        ...demoStory.scenes,
        intro: { paragraphs },
        connection: {
          title: 'Volver a encontrarnos',
          paragraphs: [...paragraphs, 'Gracias por estar.'.repeat(200)],
        },
      },
    });
    const html = render(story);
    expect(html).toContain(story.title);
    for (const scene of [story.scenes.intro, story.scenes.connection])
      for (const paragraph of scene.paragraphs)
        expect(html).toContain(paragraph);
    const opening = html.slice(
      html.indexOf('data-scene="intro"'),
      html.indexOf('data-scene="memories"'),
    );
    expect(opening).not.toContain('Alma');
    expect(opening).not.toContain('Nico');
  });

  it('prerenders one complete letter with hidden enhancement controls and native buttons', () => {
    const html = render();
    const letter = html.slice(
      html.indexOf('data-scene="letter"'),
      html.indexOf('data-scene="epilogue"'),
    );
    expect(letter.match(/data-letter-paper/g)).toHaveLength(1);
    expect(letter).toMatch(/<article[^>]*data-letter-paper[^>]*tabindex="-1"/);
    expect(letter).not.toMatch(/<article[^>]*(?:hidden|inert|style)=/);
    expect(letter).toMatch(
      /<button[^>]*type="button"[^>]*data-letter-toggle[^>]*hidden=""/,
    );
    expect(letter).toMatch(/<button[^>]*data-letter-close[^>]*hidden=""/);
    expect(letter).toMatch(/<dialog[^>]*data-letter-dialog[^>]*open=""/);
    expect(letter).toMatch(
      /<header[^>]*>[\s\S]*data-letter-close[\s\S]*<\/header><div[^>]*data-letter-body/,
    );
    expect(letter).toContain('aria-label="Texto de la carta" tabindex="0"');
    expect(letter).not.toContain('data-letter-state');
    for (const paragraph of demoStory.scenes.letter.paragraphs)
      expect(letter.split(paragraph)).toHaveLength(2);
    expect(letter.split(demoStory.scenes.letter.signature)).toHaveLength(2);
  });

  it('keeps long generic final acts complete and links arbitrary memory ids safely', () => {
    const paragraphs = [
      'Nuestra familia, a su ritmo.',
      'Recuerdo compartido. '.repeat(180),
      'Unapalabrasinespacios'.repeat(190),
    ];
    const story = storySchema.parse({
      ...demoStory,
      memories: [{ ...demoStory.memories[0], id: 'un id #/ con espacios' }],
      scenes: {
        ...demoStory.scenes,
        discovery: { title: 'Las cosas pequeñas', paragraphs },
        letter: {
          title: 'Para casa',
          paragraphs,
          signature: 'Nuestra familia'.repeat(8),
        },
        epilogue: { title: 'Nos volvemos a encontrar', paragraphs },
      },
    });
    const html = render(story);
    const final = html.slice(html.indexOf('data-scene="discovery"'));
    for (const paragraph of story.scenes.letter.paragraphs)
      expect(final.split(paragraph)).toHaveLength(4);
    expect(final).toContain(story.scenes.letter.signature);
    expect(final).not.toContain('Alma');
    expect(final).not.toContain('Nico');
    expect(final).toContain(`href="#story-${story.id}-memories-memory-1"`);
    expect(final).not.toMatch(/<details[^>]*open/);
    expect(final).toContain('aria-label="Recuerdos que permanecen"');
    expect(final).not.toContain('<footer');
  });
});
