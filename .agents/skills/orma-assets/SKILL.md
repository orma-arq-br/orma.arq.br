---
name: orma-assets
description: The asset library for the Orma website — where every image, logo, photo, and file lives and how it gets there. Use whenever she mentions photos, pictures, a logo, drawings, plans, files she has, or wants to add/change any image on the site; also when creating any component that displays images.
---

# Orma — Asset Library

One library, one structure, no strays. Every file she gives us gets imported into the library, renamed, and referenced from there — never used from wherever it happened to land.

## The library

```
src/assets/
  brand/                  logo.svg, logo-mark.svg — identity files
  projects/<slug>/        photos of one project: 01-facade.jpg, 02-living-room.jpg…
  pages/                  photos the site's own pages use: Sobre, Contato, the
                          default preview card (bedroom.webp, closet-window.webp)
  studio/                 team portraits, office, process photos
public/                   ONLY files that must keep an exact URL:
                          favicon.svg, favicon.ico, og.jpg, robots.txt
```

**`projects/` belongs to the panel.** Projects are edited from the ORMA Painel, which adds, renames and deletes the photos in `projects/<slug>/` on every save. Code never imports from there (lint refuses it): a page photo or a preview image that comes from a project is copied into `pages/` and imported from there, so a project edit can never break the build or change a fixed image.

- File names: lowercase kebab-case, **no accents, no spaces**, and in **English** (photos numbered in display order with a short English word for what they show: `01-facade.jpg`, `02-living-room.jpg`).
- The one Portuguese exception: **project folder slugs**, because they match the project's visitor-facing URL slug (accent-free pt-BR: `projects/casa-do-lago/` ↔ `/projetos/casa-do-lago`).

## Getting files from her (she is not technical)

When she mentions having photos, a logo, or any file:

1. Ask her to **drag the files straight into this chat window** — that hands them to you. This is the preferred path; describe it exactly like that.
2. If dragging is awkward (a whole shoot of 40 photos), tell her: "create a folder called **para-o-site** on your Desktop and put everything in it", then import it yourself and tell her when it's safe to delete. Find the folder for the OS you're on: `~/Desktop/para-o-site/` on macOS/Linux, `%USERPROFILE%\Desktop\para-o-site\` on Windows (also check the OneDrive-synced Desktop, `%USERPROFILE%\OneDrive\Desktop\`, which is often the real one).
3. Copy into the library with proper names, then use them. Never reference her Desktop or Downloads folders from code, and never leave the library disorganized because importing felt like extra work.

### Ask for the right format

- **Logo and marks: always ask for SVG.** Ask her directly for the `.svg` version; she knows her file formats. If she only has a PNG, ask once whether the original vector file exists somewhere; accept the PNG only as a last resort (and at the largest size she has).
- **Photos: the biggest original.** Ask for "the largest version, straight from the photographer or your camera — not a WhatsApp forward" (WhatsApp compresses brutally). If an image is under ~1600px wide, warn her it may look soft on big screens and ask if a larger one exists — but use what she has, never block on it.
- Plans/drawings she wants displayed: PDF or image is fine; export/convert to an image in the library yourself.

## Using assets in code (Astro practices)

- **Photos always go through `astro:assets`** — `<Image />` or `<Picture />` imported from the library, never a bare `<img src="/...">` to `public/`. Astro then generates responsive sizes and modern formats automatically. Set `widths`/`sizes` for big imagery; everything is lazy by default except the first screen's image, which gets `loading="eager"` and `fetchpriority="high"`.
- Every image gets pt-BR `alt` text describing what's in it (see `orma-copy`). Purely decorative images get `alt=""`.
- **The logo is inlined as a component** (`src/components/Logo.astro` wrapping the SVG with `fill="currentColor"`), so it recolors with the theme instead of shipping one file per color.
- Icons: inline SVG with `currentColor`, sized in `em`/`rem`. No icon font, no icon package.
- When a project has 3+ images with captions, keep the image list + captions in the project's content collection entry, not hardcoded in a page.

## After every import

Tell her, in her language, what you did: "I saved your 12 photos into the site's library under the project *Casa do Lago* and put them in the order you sent them — say the word and I'll reorder."
