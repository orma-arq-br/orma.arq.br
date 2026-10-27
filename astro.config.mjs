// @ts-check
import sitemap from "@astrojs/sitemap"
import { defineConfig } from "astro/config"

import { studio } from "./src/config"

// https://astro.build/config
export default defineConfig({
  // The address the site is served from. Canonical links, the preview cards
  // links turn into, the sitemap and robots.txt are all built from it, so it
  // is read from the studio facts rather than written out a second time.
  site: studio.url,

  // The floating dev toolbar sits over the bottom of the page, which is exactly
  // where the project captions are. Off, so screenshots show the real design.
  devToolbar: { enabled: false },

  integrations: [
    sitemap({
      // The internal panel's privacy policy and terms exist for Google's
      // sign-in review, not for visitors: never offered to a search engine.
      filter: (page) => !new URL(page).pathname.startsWith("/painel/"),
      // Every page here is equally worth finding and changes at the same pace:
      // when a project is added. Per-page priorities would be noise.
      changefreq: "monthly",
      lastmod: new Date(),
    }),
  ],

  image: {
    // Quality is set per format because the numbers don't mean the same thing
    // in each: AVIF at 60 already looks slightly better than WebP at 80 on
    // these photographs, and weighs about a quarter less. WebP stays where it
    // was, so the browsers that fall back to it lose nothing.
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        avif: { quality: 60 },
        webp: { quality: 80 },
      },
    },
  },

  build: {
    // The reveal script starts every photograph invisible, so it has to run.
    // Inlined scripts are the ones an embedded viewer or a strict content
    // policy quietly drops; served as its own file it behaves like any other
    // asset. Cheap insurance for a portfolio made of photographs.
    inlineStylesheets: "auto",
  },

  vite: {
    build: {
      // 0 = never inline an asset into the HTML (see the note above).
      assetsInlineLimit: 0,
    },
  },
})
