import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { interpolateStory, type StoryPoint } from './story-geometry';
import { storyMotion } from './motion';

export function createStoryAnimation(root: HTMLElement) {
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: storyMotion.desktop,
    },
    (context) => {
      if (!context.conditions?.motion) return;
      const anchors = Array.from(
        root.querySelectorAll<HTMLElement>('[data-forest-anchor]'),
      );
      const traveler = root.querySelector<HTMLElement>('[data-traveler]');
      const panel = root.querySelector<HTMLElement>('[data-pin-panel]');
      if (anchors.length !== 4 || !traveler || !panel) return;
      // One pin only; no transformed or clipped ancestor surrounds this panel.
      const pin = context.conditions.desktop
        ? ScrollTrigger.create({
            trigger: panel,
            pin: panel,
            start: 'top top',
            end: () => `+=${window.innerHeight * storyMotion.pinViewport}`,
            invalidateOnRefresh: true,
          })
        : undefined;
      let points: StoryPoint[] = [];
      let focused = false;
      const originals = anchors.map((anchor) => anchor.style.opacity);
      const restore = () =>
        anchors.forEach((anchor, i) => {
          anchor.style.opacity = originals[i] ?? '';
        });
      const paint = () => {
        if (!points.length || focused) return;
        const scroll = window.scrollY;
        const point = interpolateStory(points, scroll);
        gsap.set(traveler, {
          x: point.x - 100,
          y: point.y - scroll - 200 / 0.83 / 2,
          scale: point.width / 200,
          rotation: point.angle,
        });
      };
      const measure = () => {
        const scroll = window.scrollY;
        const correction = pin
          ? gsap.utils.clamp(0, pin.end - pin.start, scroll - pin.start)
          : 0;
        const positions = anchors.map((anchor, i) => {
          const rect = anchor.getBoundingClientRect();
          return {
            scroll: 0,
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2 + scroll - (i === 1 ? correction : 0),
            width: anchor.offsetWidth,
            angle: Number(anchor.dataset.angle ?? 0),
          };
        });
        const [hero, memory, constellation, letter] = positions;
        if (!hero || !memory || !constellation || !letter) return;
        const focusStart =
          pin?.start ?? Math.max(1, memory.y - window.innerHeight * 0.5);
        const hold = pin ? pin.end - pin.start : 0;
        points = [
          { ...hero, scroll: 0 },
          { ...memory, scroll: focusStart },
          ...(hold
            ? [{ ...memory, y: memory.y + hold, scroll: focusStart + hold }]
            : []),
          {
            ...constellation,
            scroll: Math.max(
              focusStart + hold + 1,
              constellation.y - window.innerHeight * 0.5,
            ),
          },
          {
            ...letter,
            scroll: Math.max(
              focusStart + hold + 2,
              letter.y - window.innerHeight * 0.5,
            ),
          },
        ];
        paint();
      };
      // Only the proxy is visible in enhanced mode; originals retain semantics.
      gsap.set(anchors, { opacity: 0 });
      gsap.set(traveler, { display: 'block' });
      ScrollTrigger.create({
        trigger: root,
        start: 0,
        end: 'max',
        onUpdate: paint,
        onRefresh: measure,
      });
      const connection =
        root.querySelector<SVGPathElement>('[data-connection]');
      if (connection) {
        const length = connection.getTotalLength();
        gsap.fromTo(
          connection,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: root.querySelector('[data-act="constellation"]'),
              start: 'top 75%',
              end: 'bottom 75%',
              scrub: storyMotion.scrub,
            },
          },
        );
      }
      root.querySelectorAll<HTMLElement>('[data-node]').forEach((node, i) => {
        gsap.fromTo(
          node,
          { y: 18 + i * 4, opacity: 0.25 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: node,
              start: 'top 95%',
              end: 'top 65%',
              scrub: storyMotion.scrub,
            },
          },
        );
      });
      const letter = root.querySelector('.story-letter-copy');
      if (letter)
        gsap.fromTo(
          letter,
          { y: 24 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: letter,
              start: 'top bottom',
              end: 'top 35%',
              scrub: storyMotion.scrub,
            },
          },
        );
      const focusIn = () => {
        focused = true;
        restore();
        gsap.set(traveler, { display: 'none' });
      };
      const focusOut = () => {
        focused = false;
        gsap.set(anchors, { opacity: 0 });
        gsap.set(traveler, { display: 'block' });
        paint();
      };
      root.addEventListener('focusin', focusIn);
      root.addEventListener('focusout', focusOut);
      ScrollTrigger.refresh();
      measure();
      return () => {
        root.removeEventListener('focusin', focusIn);
        root.removeEventListener('focusout', focusOut);
        restore();
      };
    },
    root,
  );
  return () => media.revert();
}
