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
    // in each. AVIF at 60 scored well on paper but, looked at side by side
    // with the original, it smoothed away exactly what these renders are
    // about: the weave of an upholstered headboard, the creases in linen,
    // wood grain. At 75 those survive and the files are still lighter than
    // the WebP fallback, which moves up to 85 for the same reason.
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        avif: { quality: 75 },
        webp: { quality: 85 },
      },
    },
  },

  // One address per page, and it is the one without the slash: every link, the
  // canonical, the sitemap, the structured data and llms.txt all say /sobre.
  // Built as sobre.html so Cloudflare serves /sobre directly and sends /sobre/
  // to it; with folders it was the other way round, and every internal link
  // cost search engines a redirect to a URL no link ever named.
  trailingSlash: "never",

  build: {
    format: "file",
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
