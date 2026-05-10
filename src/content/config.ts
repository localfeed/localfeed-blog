import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('Benoit Boussuge'),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    status: z.enum(['published', 'draft']).default('draft'),
    readTime: z.string().optional(),
    targetKeyword: z.string().optional(),
    updatedDate: z.coerce.date().optional(),
  }),
});

const local = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    city: z.string(),
    venueType: z.string(),
    citySlug: z.string(),
    venueTypeSlug: z.string(),
  }),
});

export const collections = { blog, local };
