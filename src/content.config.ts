import { glob } from "astro/loaders"
import { defineCollection } from "astro:content"
import { z } from "astro/zod"

import { categorySlugs } from "./lib/categories"

/**
 * Projects are written by hand or by the panel's "Projetos do site" form
 * (painel.orma.arq.br, its src/lib/projects.ts), which commits straight to
 * master. A change to these fields or to the categories needs the same change
 * there, or the form starts writing projects this schema refuses.
 */
const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.md" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Newest first on the home page. */
      date: z.date(),
      categories: z
        .array(z.enum(categorySlugs as [string, ...string[]]))
        .nonempty(),
      location: z.string(),
      year: z.number(),
      /** In square metres; the label on the page supplies the unit. */
      area: z.number().optional(),
      /** Two sentences, shown at the top of the project page. */
      summary: z.string(),
      cover: image(),
      coverAlt: z.string(),
      /**
       * The photographs below the opening one. Nothing is ever written over
       * these, so there is no caption field to fill in. Only `alt`, which is
       * never seen — it is what a blind visitor hears.
       */
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
          }),
        )
        .default([]),
    }),
})

export const collections = { projects }
