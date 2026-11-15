import { z } from 'zod';

const memorySchema = z.object({
  id: z.string().trim().min(1),
  date: z.iso.date(),
  title: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(4000),
});

// M0 validates textual memories; media and scene contracts belong to later milestones.
export const storySchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title: z.string().trim().min(1).max(120),
    theme: z.literal('celestial-nostalgia'),
    memories: z.array(memorySchema).min(1).max(100),
  })
  .superRefine((story, context) => {
    const ids = new Set<string>();
    story.memories.forEach((memory, index) => {
      if (ids.has(memory.id)) {
        context.addIssue({
          code: 'custom',
          path: ['memories', index, 'id'],
          message: 'Identificador de recuerdo duplicado',
        });
      }
      ids.add(memory.id);
    });
  });

export type Story = z.infer<typeof storySchema>;
