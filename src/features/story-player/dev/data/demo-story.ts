import { storySchema } from '../schemas/story';

export const demoStory = storySchema.parse({
  schemaVersion: 1,
  id: 'una-luz-compartida',
  title: 'Una luz compartida',
  theme: 'celestial-nostalgia',
  memories: [
    {
      id: 'primer-instante',
      date: '2026-01-18',
      title: 'Ese primer instante',
      message: 'Hay momentos pequeños que se quedan con nosotros.',
    },
  ],
});
