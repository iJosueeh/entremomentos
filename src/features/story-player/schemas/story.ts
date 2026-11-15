import { z } from 'zod';
import { imageSchema } from './media';

const title = z.string().trim().min(1).max(120);
const paragraph = z.string().trim().min(1).max(4000);
const paragraphs = z.array(paragraph).min(1);
const sceneCopy = z.object({ title, paragraphs });
const memorySchema = z.object({
  id: z.string().trim().min(1),
  date: z.iso.date(),
  title,
  message: paragraph,
  image: imageSchema.optional(),
});

export const storySchema = z
  .object({
    schemaVersion: z.literal(2),
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    title,
    theme: z.literal('celestial-nostalgia'),
    memories: z.array(memorySchema).max(100),
    scenes: z.object({
      intro: z.object({ paragraphs }),
      connection: sceneCopy,
      memories: z.object({ title, introduction: paragraph }),
      discovery: sceneCopy,
      letter: sceneCopy.extend({ signature: title }),
      epilogue: sceneCopy,
    }),
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
