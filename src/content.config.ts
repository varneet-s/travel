import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const journal = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/journal' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    images: z.array(z.string()).min(3),
    location: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const collections = { journal };
