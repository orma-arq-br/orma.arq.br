import type { ImageMetadata, ImageOutputFormat } from "astro"

/**
 * Working out the `sizes` attribute for photographs cropped with
 * `object-fit: cover`.
 *
 * The browser picks a file from the box's *width*, but a cover crop scales the
 * photo until it covers both sides. In a box taller than the photo's own
 * proportions the photo is painted much wider than the box, so the file the
 * browser picked gets stretched and goes soft. These helpers ask for the width
 * the photo is really painted at: `max(box width, box height x its ratio)`.
 *
 * The measurements below mirror the layout in `global.css`; `sizes` cannot read
 * custom properties, so they are rounded generously on purpose. Asking for a
 * slightly larger file costs bandwidth, asking for a smaller one costs sharpness.
 */

/** Content column, i.e. the viewport minus the left rail and the right margin. */
const COLUMN = "83.75vw"
/** A grid row: the screen minus the menu band and the bottom margin. */
const ROW = "85vh"
/** The home page's opening tile on the phone, the only photograph there that
    still fills the screen; the header sits in the page rather than over it. */
const ROW_PHONE = "82vh"
/** Every other photograph on the phone: a 4:3 box the width of the screen. */
const BOX_PHONE = "75vw"

const covered = (image: ImageMetadata, width: string, height: string) =>
  `max(${width}, calc(${height} * ${(image.width / image.height).toFixed(3)}))`

/** A photograph cropped to a fixed `ratio` box one row tall (Contato). */
export function sequenceSizes(image: ImageMetadata, ratio: number) {
  const widest = Math.max(ratio, image.width / image.height).toFixed(3)
  return `(min-width: 60rem) calc(${ROW} * ${widest}), ${covered(image, "100vw", BOX_PHONE)}`
}

/**
 * A photograph in a project's sequence, which is never cropped: its box has the
 * photograph's own proportions, so the painted width is simply the box width.
 * A row is a grid row tall unless the column is too narrow for the whole row,
 * in which case the row shrinks to fit (hence the `min()`). `sum` is the row's
 * total width as a share of its height. On the phone it is the screen's width.
 */
export function wholeSizes(image: ImageMetadata, sum: number) {
  const ratio = image.width / image.height
  const byHeight = `calc(${ROW} * ${ratio.toFixed(3)})`
  const byWidth = `calc(${COLUMN} * ${(ratio / sum).toFixed(3)})`
  return `(min-width: 60rem) min(${byHeight}, ${byWidth}), 100vw`
}

/** A tile in the portfolio grid, spanning `span` of the 12 columns. */
export function tileSizes(image: ImageMetadata, span: number, lead: boolean) {
  const desktop = covered(image, `calc(${COLUMN} * ${span} / 12)`, ROW)
  const phone = covered(image, "100vw", lead ? ROW_PHONE : BOX_PHONE)
  return `(min-width: 60rem) ${desktop}, ${phone}`
}

/**
 * The photograph a project or studio page opens with: one row, full column on
 * a wide screen, and — like every other photograph on the phone — a 4:3 box
 * the width of the screen there. It only fills the phone's screen on the home
 * page, which is `tileSizes`' job, not this one.
 *
 * `zoom` is the largest scale a slow zoom on it reaches, so we ask for a file
 * big enough for the end of the movement rather than the start.
 */
export function openingSizes(image: ImageMetadata, zoom = 1) {
  const grow = (size: string) => (zoom === 1 ? size : `calc(${size} * ${zoom})`)
  const desktop = covered(image, grow(COLUMN), grow(ROW))
  const phone = covered(image, grow("100vw"), grow(BOX_PHONE))
  return `(min-width: 60rem) ${desktop}, ${phone}`
}

/**
 * How every photograph on the site is delivered. Spread onto `<Picture>`, so
 * the decision is made once here rather than five times across the pages.
 *
 * `formats` is what the browser is offered first and `fallbackFormat` is what
 * it gets if it can't read any of them. AVIF leads because, measured on these
 * photographs against the untouched originals, it holds the same fidelity as
 * the WebP the site used to ship for about a third fewer bytes — worth having
 * when most visitors arrive on a phone, on mobile data. The few browsers
 * without AVIF fall back to exactly the WebP they were getting before.
 *
 * The widths are the files actually generated; `sizes` (below) tells the
 * browser which one to take. Astro skips any width larger than the original,
 * so a smaller photograph simply offers fewer files.
 */
export const PHOTO: {
  widths: number[]
  formats: ImageOutputFormat[]
  fallbackFormat: ImageOutputFormat
} = {
  widths: [640, 960, 1280, 1600, 2000, 2400],
  formats: ["avif"],
  fallbackFormat: "webp",
}

/**
 * The one photograph a page opens on, which is almost always the largest thing
 * a visitor waits for. Fetched immediately, ahead of everything else on the
 * page, and decoded in step with the rest of the first paint so the screen
 * doesn't assemble itself in two goes.
 */
export const OPENING_PHOTO = {
  loading: "eager",
  fetchpriority: "high",
  decoding: "sync",
} as const

/**
 * Every other photograph: not fetched until the visitor is scrolling towards
 * it, and never allowed to compete with the opening one for bandwidth.
 */
export const LATER_PHOTO = {
  loading: "lazy",
  fetchpriority: "auto",
  decoding: "async",
} as const
