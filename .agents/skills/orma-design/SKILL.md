---
name: orma-design
description: Design direction and build conventions for the Orma architecture website. Consult BEFORE building or changing anything visual — pages, sections, components, colors, fonts, layout, spacing, images. Also defines where design tokens live and the quality bar every change must pass.
---

# Orma — Design Direction

Orma is the website of an architecture studio. The bar is a site that could win an Awwwards "Site of the Day": the confidence of high-end editorial print (think El Croquis, or the sites of studios like Herzog & de Meuron or Norm Architects) — not a template, not a SaaS page.

## The aesthetic in one paragraph

Architecture websites earn "insanely high quality" through **restraint**: enormous, confident typography; photography treated as the main material; a near-monochrome palette with at most one accent; a strict grid that occasionally, deliberately breaks; and lots of empty space. Every screen should feel composed, like a spread in a monograph. When in doubt, remove something.

## Non-negotiables

- **Typography does the heavy lifting.** One display face with real character + one quiet text face. Display sizes should be brave — heroes can be `clamp(3rem, 10vw, 9rem)`. Tight letter-spacing on large sizes (−0.02em to −0.04em), generous line-height only on body text.
- **Near-monochrome palette.** An off-black, an off-white (paper/plaster, never pure `#fff`), two greys between them, and at most one accent used sparingly (a rust, ochre, or deep green reads "material"; never SaaS blue/purple).
- **Photography is full-bleed or grid-locked, never in "cards".** Consistent aspect ratios (`aspect-ratio` + `object-fit: cover`). Every image gets meaningful `alt` text.
- **Whitespace is a feature.** Section padding measured in `clamp(4rem, 12vh, 10rem)`, not `2rem`. Let single elements own the screen.
- **Grid with intent.** A 12-column fluid grid; content usually sits asymmetrically on it (text spanning columns 2–6, an image spanning 7–13). Symmetric centered-everything is the template look — avoid it.

### Banned (the "template look")

Card grids with border-radius + drop shadows everywhere · purple/blue gradients · glassmorphism · emoji as icons · centered-hero-with-two-buttons · stock icon packs · carousels · `#000` on `#fff` (use the token palette) · lorem ipsum (write plausible architecture copy and tell her which words are placeholders).

## Anatomy of the site — build these without being asked

She doesn't know the words "hero", "footer", "nav", or "scroll animation", and she won't request them. **A page is not done until it has all its parts, at full quality, unprompted.** What the best architecture sites (BIG, Gensler, Minale + Mann, Shape Studio…) consistently have:

- **A full-screen opening on every page** — one enormous image or an animated background (`orma-shaders`) with big confident type. Never start a page with a plain heading on white. Home gets the strongest treatment.
- **Minimal navigation, always visible**: logo + at most three or four items (Projetos, Estúdio, Contato). No mega-menus, no hamburger on desktop. On the phone, a full-screen menu that's designed as carefully as any page.
- **Portfolio front and center**: home shows a *curated* set of 3–6 featured projects, not the whole archive; the Projetos page holds everything (add type filters only once there are 8+ projects).
- **Project pages tell a story**: opening image → the brief in two sentences → a sequence of large images, no words on them (see her rule below) → facts (local, ano, área) → quiet next/previous project links at the bottom. This template is the heart of the site; build it once, superbly.
- **A real footer on every page**: not an afterthought strip — a composed final section with the studio name, contact, WhatsApp CTA, social links, CAU registration. This is a prime spot for a calm animated background (`orma-shaders`).
- **Motion everywhere, restrained**: reveals as you scroll, hover responses, one hero moment per page — via `orma-motion`, without her asking.

When she says "a page about my projects", she means all of this. Build the whole anatomy, then tell her what each part is in plain language so she can react.

## Foundations — single source of truth

Two files hold every constant; nothing is ever hardcoded twice:

- **`src/config.ts`** — the facts: studio name, tagline, city, WhatsApp number, e-mail, Instagram, CAU registration. Components import from here; the phone number must never appear in two places.
- **`src/styles/global.css`** — the look: all design tokens, imported once in `src/layouts/Layout.astro`. Every component uses tokens (`var(--…)`) — never hardcoded colors, font sizes, or magic spacing.

Structure `global.css` with cascade layers so specificity stays predictable:

```css
@layer reset, tokens, base, motion;
```

(`reset` — minimal modern reset; `tokens` — the `:root` custom properties; `base` — element defaults, typography, focus styles; `motion` — the `data-reveal` classes from `orma-motion`. Astro's scoped component styles are unlayered, so they always win over these — which is exactly the mental model: global defaults in layers, component specifics in the component.)

The `tokens` layer defines, as CSS custom properties on `:root`:

- `--color-ink`, `--color-paper`, `--color-grey-1`, `--color-grey-2`, `--color-accent`
- Type scale via `clamp()`: `--text-hero`, `--text-title`, `--text-large`, `--text-body`, `--text-small`
- Spacing: `--space-1` … `--space-8` (0.25rem → 10rem-ish), `--section-pad`, `--container-max` (~1440px), `--gutter`
- Fonts: `--font-display`, `--font-text`

Fonts are self-hosted via `@fontsource-variable/*` or `@fontsource/*` packages (`pnpm add`), imported in `global.css`. Never load fonts from Google's CDN. Preload nothing else; keep the page weight lean.

**If `global.css` doesn't exist yet, the visual identity hasn't been chosen.** Propose 2–3 directions to her in plain visual language (e.g., "Gallery: bone-white pages, huge thin headlines, black-and-white photos" vs. "Atelier: warm dark charcoal, ivory text, one rust accent, moody images"), recommend one, then create the tokens. After she picks, record it under **Decisions** below by editing this file.

## Build conventions

- One `.astro` component per section in `src/components/` (e.g., `Hero.astro`, `ProjectGrid.astro`, `Footer.astro`); pages in `src/pages/` just compose them. Scoped `<style>` in each component; `global.css` only for the layered globals described above.
- **Reuse before rewrite.** Before building anything, check whether a component, token, or pattern already exists and extend it. Two sections that look alike must be one component with props — never a near-duplicate copy. If the same value appears twice, it becomes a token or a `config.ts` entry.
- **Modern CSS, no preprocessors needed**: cascade layers, custom properties, `clamp()`, `aspect-ratio`, `object-fit`, grid + subgrid, logical properties (`margin-block`, `padding-inline`), `:has()`/`:is()` where they simplify, container queries for components that live in varying widths, `100svh` (never `100vh`) for full-screen sections.
- **Mobile is a first-class citizen, not a breakpoint.** Write styles mobile-first (base styles = phone, `@media (min-width: …)` adds the desktop richness). Design the phone layout *deliberately* — most of her visitors will arrive from Instagram or WhatsApp on a phone. Touch targets ≥ 44px; anything revealed on hover must also be visible or reachable on touch; no horizontal scroll, ever; check ~390px width before showing her anything.
- Semantic HTML (`header`, `nav`, `main`, `section`, `figure`, `footer`); real text, never text baked into images; visible focus styles; contrast ≥ 4.5:1 for body text.
- All images through the asset library and `astro:assets` — see `orma-assets`. Logos and icons are SVG.
- Project/portfolio content that repeats (projects, studio info) goes in Astro content collections once there are 3+ entries — until then, keep it inline and simple.

## Quality gate (every visual change)

1. Dev server running (`astro dev --background`), page opened.
2. Screenshot at phone (~390px) **and** desktop (~1440px) width; actually look at both — the phone one first.
3. Browser console clean.
4. Reduced motion respected on anything that moves (see `orma-motion` — this is non-negotiable).
5. For bigger milestones, run the `web-design-guidelines` skill as an audit, and `frontend-design` when starting a new page's direction.

## Related skills

- `orma-copy` — every visitor-facing word is Brazilian Portuguese; writing rules live there.
- `orma-assets` — where images/logos live and how to get files from her.
- `orma-motion` — how anything on this site moves.
- `orma-shaders` — the animated backgrounds for the page openings and footer.

## Decisions

_Record every visual-identity decision she confirms here (date + one line), so future sessions never re-ask._

**2026-09-09 (later) — she designed the home page in Figma and we built to it**

The file: `https://www.figma.com/design/Wn2k92jj8SicjRMy2g7PuF` (she is on a View
seat, so read the design with `get_design_context`, never write to it). Three
artboards at 1920x982 = the home page and its scroll states. Measurements below
are quoted at that size and live as tokens in `global.css`.

- **A page margin of 40px on every side** (`--edge`), equal all round. Inside it,
  the **menu rectangle** spans the full width between those margins, 114px tall,
  fixed. Photographs scroll *under* it, so the band is painted from the very top
  of the viewport even though the words sit in the lower part of it. Total top
  band = `--header-height` (154px).
- **The page is two columns, and the menu belongs to the right one.** Her words
  (2026-09-16, said twice): the fixed left rail carries the wordmark and the
  location; the right column scrolls and carries the photographs and everything
  written. The menu words are centred on that right column alone — the rail is
  padded out of the reckoning, so the middle of the menu and the middle of the
  photographs are the same pixel at every width. The white band itself still
  runs the full width, so photographs disappear behind it rather than into the
  margin. Do not centre the words on the window again.
- **Every page has the same structure, so every page centres alike.** She asked
  for this explicitly (2026-09-16). `Layout.astro` has **one** mode, not two:
  `main` always starts at the rail, always begins under the menu band, always
  ends at `--edge`. There is no `flush` prop and no page-by-page margin. A page
  that wants a narrower measure for reading text centres that text *inside* the
  column (`--measure`) rather than moving the column. The footer takes the same
  column. When adding a page, add nothing: use `Layout` as is.
- **Reading text is exactly as wide as the menu.** Her decision, drawn with two
  red lines down the ends of the menu row (2026-09-16): every block of reading
  text in the content column starts under the A of Arquitetura and ends under
  the last letter of Contato. `--measure` is that width, and the menu `ul` is
  pinned to it with `justify-content: space-between`, so the two can never
  drift apart. The clamp — `clamp(30rem, 42.1vw, 50.5rem)` — is the menu's own
  natural width at every screen size, so pinning it changed nothing visually
  (gaps land within a pixel of what they were). If a menu item is ever renamed,
  the words simply respace inside the measure; nothing breaks, but check that
  the spacing still looks right and adjust the clamp, never the alignment.
  **Two deliberate exceptions**: the footer (she excluded it) and the Contato
  page, whose text is one half of a photo-and-text pair sized to a paired
  photograph — widening it there would break her composition.
- **Reading text fills its measure.** The base layer caps paragraphs at 62ch for
  readability, which quietly shrinks a story inside its column and presses it
  against the left edge. Any block already sized to `--measure` opts out with
  `max-inline-size: none`. A text screen is `min-block-size` a screenful, never
  exactly one, so a long description grows its screen instead of sliding up
  under the menu band.
- **The wordmark is turned on its side down the left margin**, reading upwards
  (O at the bottom), top-aligned with the first photograph, centred in the
  `--rail-width` (272px) column. Where the studio works sits at the foot of the
  same column. Both are fixed; on the phone the whole thing becomes one stacked
  header and the location line hides (the footer already says it).
- **The logo is black** (`--color-ink`). She asked for burgundy earlier, saw it,
  and changed her mind. The burgundy `#4f0013` now survives only in the favicon.
  There is no colour anywhere in the interface.
- **A project's name stays off its photograph until you point at it.** The name
  and its shading fade in on hover, at the quick hover timing. Guarded twice:
  only where a real mouse exists (`(hover: hover) and (pointer: fine)`), so touch
  screens keep the name permanently visible, and keyboard focus reveals it too.
  She tried this on a branch and adopted it.
- **One type size for the whole interface** (`--text-ui`, 20px at 1920): menu,
  project captions, studio location. Captions are the project name in bold and
  the city in regular, white, centred at the foot of each photograph, 53px up.
- **Rows: 1, then 3, then 2**, repeating three-up and two-up after that. Every
  row is one screen tall. **One spacing value for everything**: the gap between
  projects, horizontal and vertical, is the same as the page margin
  (`--edge`). She asked for this twice; there is no separate grid-gap token.
- **The opening photograph owns the first screen**: it keeps the 40px page
  margin below it and pushes the next row past the fold, so nothing but the big
  image shows until you scroll.
- Every other page wears the same chrome. Project and studio pages open with a
  photograph exactly one row tall, so all pages open alike.
- **Every row is the same height, including the last one.** Her Figma shows the
  last two photographs cropped short, but that was only her way of drawing what
  the footer looks like once you have scrolled to the bottom. The footer simply
  follows the grid, after a generous gap. It holds the
  studio and its two architects on the left, e-mail and Instagram on the right,
  and the year centred underneath in `--color-mute` (#8e8e93), at four fifths of
  the interface size and in Medium. That grey is her exact value and sits below
  the usual contrast bar; she picked it deliberately after seeing a lighter one. Her footer has
  no WhatsApp button and no CAU; WhatsApp still lives on Contato and Sobre.

**2026-09-09 — first build of the site, decided with her directly**

- **Reference**: mir.no. She wants the work to speak first, so the home page **opens straight into the projects** (no separate opening screen, no intro). Confirmed explicitly over the alternatives.
- **Navigation**: superseded by the Figma design above.
- **Colour**: superseded above. Off-white paper (`#f7f6f4`) and off-black ink (`#141414`) plus two greys, and nothing else. **Do not add an accent colour without asking her.**
- **Typeface**: Montserrat everywhere (her choice), self-hosted. The logo's typeface was drawn for the logo only and exists nowhere else, so the wordmark is always the SVG at `src/assets/brand/logo.svg`, never live text. The lockup on the site is the **wordmark alone**, without the "arquitetura" line, because that line would have to be faked in Montserrat.
- **Portfolio grid**: newest project first; the rhythm is set in `src/lib/grid.ts`. Superseded in its details by the Figma design above.
- **The category pages are photographs only.** No heading, no intro sentence:
  they open straight into the grid under the menu band, like the home page. The
  page name lives in a visually hidden `h1` and in the `<title>`, and the intro
  in `categories.ts` survives only as the meta description. The underlined menu
  item is what tells a visitor where they are.
- **Categories**: a project can belong to **more than one** (a house where they did both the architecture and the interiors shows up in both sections). Defined once in `src/lib/categories.ts`.
- **Studio facts**: two partners, Liliane Basso and Letícia Bierhals Ignacio. Based in Porto Alegre, RS; they take work in Porto Alegre and the Serra Gaúcha. Mostly residential, some commercial.
- **Favicon**: the "m." mark alone, no background, and it follows the browser's theme (ink on light, paper on dark). `public/favicon.svg` is the mark rebuilt as geometry, measured off `src/assets/brand/mark.png` and matched to it within a fraction of a pixel; swap in the studio's own vector if one ever turns up. `favicon-180.png` is the exception and keeps paper behind it, because iOS composites transparency onto black.
- **Credentials**: Liliane Basso is CAU A307604-0. Letícia's registration is still pending and `partners[].cau` is `null` until it arrives, which hides her from the footer line automatically.

**Project page** (her design): opening photograph one row tall, project name
bottom left in Bold 36px, facts bottom right (Projeto, Local, m², Ano); then the
description alone on a screen, justified in the shared `--measure` column (the
menu's width), centred in the right-hand column; then the
photographs a screenful at a time, centred, grouped by `src/lib/sequence.ts`.
No summary line and no previous/next links: her design has neither.

**2026-09-23 — photographs inside a project are never cropped.** Each one is
shown in the exact proportions of the file she uploads. Her Figma shapes are
the layout, read off each photograph's own ratio in the order listed: 1:1, 4:3
and **16:9 (added now, same alignment)** take a screen alone; 3:4 pairs; 9:16
goes three across. An upright with no same-shape neighbour stands alone,
centred. Rows are one grid row tall with the `--edge` gap between photographs
and around them (the margins agreed on the home page); a row that would be
wider than the column shrinks whole instead of cropping. On the phone each
photograph is full width in its own proportions. This overrides the
"consistent aspect ratios + cover" rule above for the project sequence only —
the opening photograph and the portfolio tiles still crop to their boxes.

**Her standing rule (2026-09-16): never write anything over the photographs
below the opening one.** Not a caption, not a title, not a line of prose — on
any project page, now or in future. This is enforced, not remembered: the
`caption` field is gone from the project schema in `src/content.config.ts`, and
the sequence figures render an image and nothing else. Do not add it back, and
do not offer captions under the photographs either unless she asks — she asked
for the words removed, not moved. The **opening** photograph is the single
exception and keeps the project name and facts over it, exactly as she drew it
in Figma; ask her before touching that one.

**Sobre nós** (her design): "Forma / Reforma / Transforma" spread across the
text column, the studio story below it justified with both names in bold, then
one full-width photograph on a second screen. The story is **her own writing**, lightly corrected for grammar at her request
(regência, a run-on sentence, "há dez anos"); do not change what it says. It is also the source of two real facts: they met
on the first day of university ten years ago and both trained at UFRGS.

**Contato** (her design, revised): one photograph and the contact details side by
side, each the width of a paired photograph elsewhere, centred together. No
form: she removed it. The e-mail, Instagram and WhatsApp are links.

**Photographs.** `Apartamento BR` is real: her four renders, imported from her
Desktop into `src/assets/projects/apartamento-br/`. The other five projects
borrow those same four images on purpose ("só para ficar mais bonito") — each
`cover:` carries a `# TEMPORARY:` comment, and their own folders were deleted.
Swap each one out as its real photographs arrive.

**WhatsApp is real:** +55 51 9329-7649 (given in that exact 8-digit form; wa.me resolves it). **Instagram is real:** `@orma.arquitetura`. **Still placeholder, by her explicit decision — do not chase this again:** `contato@orma.arq.br`. **Still genuinely missing:** every project photograph, Letícia's CAU, and all six project entries in `src/content/projects/`.
