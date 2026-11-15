import { z } from 'zod';

const httpsUrl = z.url({ protocol: /^https$/ });

export const imageSchema = z.object({
  src: z
    .string()
    .refine(
      (value) =>
        (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) ||
        httpsUrl.safeParse(value).success,
      'La imagen debe usar una ruta local absoluta o HTTPS',
    ),
  alt: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  credit: z
    .object({
      author: z.string().trim().min(1),
      sourceUrl: httpsUrl,
      license: z.string().trim().min(1),
      licenseUrl: httpsUrl,
    })
    .optional(),
});

export type StoryImage = z.infer<typeof imageSchema>;
