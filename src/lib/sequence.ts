import type { ImageMetadata } from "astro"

/**
 * The photographs after a project's opening image are shown a screenful at a
 * time, centred, each the height of a grid row.
 *
 * Every photograph keeps the proportions it was shot in and is never cropped:
 * the layout of a screen is read off the photographs themselves, in the order
 * they are listed. The shapes are the ones drawn in Figma, plus 16:9:
 *
 *   1:1, 4:3, 16:9  a screen alone
 *   3:4             two side by side
 *   9:16            three side by side
 *
 * An upright without enough companions of its own shape next to it simply
 * takes the screen alone, centred.
 */

/** How many photographs of a shape share a screen, by width over height. */
const PER_SCREEN = (ratio: number) => {
  if (ratio < 0.66) return 3 // 9:16, 2:3
  if (ratio < 0.9) return 2 // 3:4, 4:5
  return 1 // 1:1, 4:3, 16:9 and anything wider
}

export type Screen<T> = {
  photos: { item: T; ratio: number }[]
  /** Total width of the row as a share of its height, gaps aside. */
  sum: number
}

export function toScreens<T extends { src: ImageMetadata }>(
  items: T[],
): Screen<T>[] {
  const queue = items.map((item) => ({
    item,
    ratio: item.src.width / item.src.height,
  }))
  const screens: Screen<T>[] = []

  while (queue.length > 0) {
    const photos = [queue.shift()!]
    const size = PER_SCREEN(photos[0].ratio)

    while (
      photos.length < size &&
      queue[0] &&
      PER_SCREEN(queue[0].ratio) === size
    ) {
      photos.push(queue.shift()!)
    }

    screens.push({
      photos,
      sum: photos.reduce((total, { ratio }) => total + ratio, 0),
    })
  }

  return screens
}
