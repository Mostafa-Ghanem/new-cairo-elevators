import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// One JSON file per product page: src/content/products/<slug>.json → /<slug>
const image = z.object({
  src: z.string(),
  width: z.number().int(),
  height: z.number().int(),
  alt: z.string()
});
const numbered = z.object({ no: z.string(), title: z.string(), text: z.string() });
const card = z.object({ title: z.string(), text: z.string() });

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    breadcrumb: z.string(),
    hero: z.object({
      kicker: z.string(),
      /** May contain a <span> for the gold highlight. */
      h1: z.string(),
      lead: z.string(),
      points: z.array(z.string()),
      image,
      labelStrong: z.string()
    }),
    /** Label of the first in-page nav link (#about). */
    navAboutLabel: z.string(),
    about: z.object({
      kicker: z.string(),
      h2: z.string(),
      lead: z.string(),
      image,
      items: z.array(numbered)
    }),
    /** Omit for pages without project footage. */
    video: z.object({
      h2: z.string(),
      videos: z.array(z.object({
        poster: z.string(),
        src: z.string(),
        width: z.number().int(),
        height: z.number().int(),
        label: z.string(),
        caption: z.string()
      }))
    }).optional(),
    features: z.object({
      kicker: z.string(),
      h2: z.string(),
      p: z.string(),
      items: z.array(card.extend({ icon: z.array(z.string()) })),
      cta: z.object({ h3: z.string(), p: z.string() })
    }),
    suitable: z.object({
      kicker: z.string(),
      h2: z.string(),
      p: z.string(),
      items: z.array(card.extend({ tag: z.string() }))
    }),
    decision: z.object({
      kicker: z.string(),
      h2: z.string(),
      p: z.string(),
      items: z.array(numbered)
    }),
    faq: z.object({
      h2: z.string(),
      items: z.array(z.object({ q: z.string(), a: z.string() }))
    }),
    form: z.object({
      h3: z.string(),
      /** Sent with the lead as the product name. */
      product: z.string()
    })
  })
});

export const collections = { products };
