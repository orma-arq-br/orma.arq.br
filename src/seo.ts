/**
 * Everything search engines and answer engines are told about this site.
 *
 * The constants at the top are the knobs: change them here and every page,
 * every preview card, the sitemap, `robots.txt` and `llms.txt` follow. The
 * functions below only assemble those constants into the shapes each consumer
 * expects, so there is never a second place where a title pattern or a
 * description is written out by hand.
 *
 * Everything a machine reads here is Brazilian Portuguese, exactly like the
 * pages: the people asking an assistant for an architect in Porto Alegre are
 * asking in Portuguese.
 */
import type { CollectionEntry } from "astro:content"

import brandMark from "./assets/brand/mark.png"
import fallbackCard from "./assets/pages/bedroom.webp"
import {
  categories,
  categoryLabel,
  categoryPhrase,
  type CategorySlug,
} from "./lib/categories"
import { partnerNames, studio, whatsappUrl } from "./config"

/* ------------------------------------------------------------------ knobs */

/** Where the site lives. Every absolute URL in the markup is built from this. */
export const SITE_URL = studio.url

/** The language of every page, in the form each standard wants it. */
export const LANGUAGE = { tag: "pt-BR", open_graph: "pt_BR" } as const

/** `<title>` for a page that names itself, and for the home page. */
export const TITLE = {
  pattern: (page: string) => `${page} — ${studio.name}`,
  home: `${studio.name} — ${studio.tagline}`,
} as const

/**
 * A search result cuts the description around here. Everything below is
 * written to fit rather than to be cut off mid-word.
 */
export const DESCRIPTION_MAX = 160

/**
 * Trims to a whole sentence that fits, and only falls back to a word boundary
 * when even the first sentence is too long — a description that ends on a full
 * stop reads like it was written, not truncated.
 */
function fit(text: string, max: number) {
  if (text.length <= max) return text

  const sentences = text.match(/[^.!?]+[.!?]+\s*/g) ?? [text]
  let kept = ""
  for (const sentence of sentences) {
    if ((kept + sentence).trimEnd().length > max) break
    kept += sentence
  }
  if (kept) return kept.trimEnd()

  const cut = text.slice(0, max - 1)
  return cut.slice(0, cut.lastIndexOf(" ")).trimEnd() + "…"
}

/**
 * The pt-BR sentences search engines show under the link, and that an assistant
 * quotes when it summarises a page. Written around the words clients actually
 * type: "arquiteto em Porto Alegre", "projeto de casa", "reforma de
 * apartamento". The studio name is left to the `<title>` rather than repeated
 * here, which buys back characters for something a reader does not know yet.
 */
export const DESCRIPTIONS = {
  home: `Estúdio de arquitetura e interiores em ${studio.city}. Projetos de casas, reformas de apartamentos e espaços comerciais em ${studio.regions.join(" e ")}.`,
  sobre: `${partnerNames[0]} e ${partnerNames[1]}, arquitetas formadas pela UFRGS. Conheça o estúdio por trás dos projetos de arquitetura e interiores da ${studio.shortName}.`,
  contato: `Fale com a ${studio.name} pelo WhatsApp ou por e-mail. Projetos de arquitetura e interiores em ${studio.regions.join(" e ")}.`,
  category: (slug: CategorySlug, intro: string) => {
    const phrase = categoryPhrase(slug)
    return `${intro} ${phrase[0].toUpperCase()}${phrase.slice(1)} da ${studio.name} em ${studio.regions.join(" e ")}.`
  },
  /** A project describes itself; the place and year are what earn the trust. */
  project: (summary: string, location: string, year: number) => {
    const facts = `Projeto em ${location}, ${year}.`
    return `${fit(summary, DESCRIPTION_MAX - facts.length - 1)} ${facts}`
  },
} as const

/** The preview card a link turns into on WhatsApp, Instagram or a search page. */
export const SOCIAL_CARD = {
  /** Cropped to this from whichever photograph represents the page. */
  width: 1200,
  height: 630,
  type: "image/jpeg",
  /** Used by any page that has no photograph of its own to show. */
  fallback: fallbackCard,
  fallbackAlt:
    "Quarto de casal com painel de madeira escura, cabeceira estofada azul e luminária de papel sobre a cama",
} as const

/**
 * The square mark a search engine shows beside the studio's name. Square and
 * raster on purpose: that is the shape and format the rich-result guidelines
 * ask for, which the site's own vector wordmark is neither.
 */
export const LOGO = { src: brandMark, size: 512 } as const

/** What crawlers are told in `robots.txt`. */
export const ROBOTS = {
  /** Paths no crawler should spend its budget on. Astro emits none today. */
  disallow: [] as string[],
  /** Advertised alongside the sitemap so assistants can find the summary. */
  extra: [`# ${studio.name} — ${studio.tagline}`],
} as const

/** The opening of `llms.txt`: what this site is, in two lines. */
export const LLMS_SUMMARY = `Estúdio de arquitetura e interiores em ${studio.city}, ${studio.state}, ${studio.country}, formado por ${partnerNames[0]} e ${partnerNames[1]}, arquitetas formadas pela UFRGS. Projetamos casas, reformas de apartamentos e espaços comerciais em ${studio.regions.join(" e ")}. O primeiro contato acontece pelo WhatsApp.`

/* -------------------------------------------------------------- structured */

/** Stable identities, so every node in the graph points at the same studio. */
const ID = {
  studio: `${SITE_URL}/#studio`,
  website: `${SITE_URL}/#website`,
} as const

export const absolute = (path: string) => new URL(path, SITE_URL).href

/**
 * Whether a project may be told to machines. Placeholders stay on the pages
 * for visitors but out of every list a search engine or an assistant reads:
 * their photographs are borrowed and their facts invented. The sitemap applies
 * the same rule in `astro.config.mjs`, reading the same `placeholder` field.
 */
export const findable = (project: CollectionEntry<"projects">) =>
  !project.data.placeholder

/**
 * The studio itself: one node answering both "who are they" and "where do they
 * work".
 *
 * schema.org has no type for an architecture practice. `ProfessionalService`
 * would be the obvious guess and is explicitly deprecated in the vocabulary;
 * `ArchitecturalService` is not a schema.org type at all, however often it is
 * copied around. `HomeAndConstructionBusiness` is the real, current type whose
 * definition ("a local business that provides services around homes and
 * buildings") covers this trade, so the type is left honest and `additionalType`
 * carries the precise meaning as the Wikidata entity for an architectural firm.
 */
export function studioSchema(assets: { logo: string; image: string }) {
  return {
    "@type": "HomeAndConstructionBusiness",
    additionalType: "https://www.wikidata.org/wiki/Q4387609",
    "@id": ID.studio,
    name: studio.name,
    alternateName: studio.shortName,
    url: absolute("/"),
    description: DESCRIPTIONS.home,
    logo: assets.logo,
    image: assets.image,
    email: studio.email,
    telephone: `+${studio.whatsapp}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: studio.city,
      addressRegion: studio.state,
      addressCountry: "BR",
    },
    areaServed: studio.regions.map((region) => ({
      "@type": "Place",
      name: region,
    })),
    knowsLanguage: LANGUAGE.tag,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: studio.hours.days,
      opens: studio.hours.opens,
      closes: studio.hours.closes,
    },
    founder: studio.partners.map((partner) => ({
      "@type": "Person",
      name: partner.name,
      jobTitle: "Arquiteta",
      ...(partner.cau ? { identifier: `CAU ${partner.cau}` } : {}),
    })),
    sameAs: [studio.instagram, whatsappUrl],
    makesOffer: categories.map((category) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: `${category.phrase[0].toUpperCase()}${category.phrase.slice(1)}`,
        description: category.intro,
      },
    })),
  }
}

/** The site as a whole, so an assistant knows the pages belong together. */
export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": ID.website,
    url: absolute("/"),
    name: studio.name,
    description: DESCRIPTIONS.home,
    inLanguage: LANGUAGE.tag,
    publisher: { "@id": ID.studio },
  }
}

/** The trail from the home page down to where the visitor is standing. */
export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Início", path: "/" }, ...trail].map(
      (step, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: step.name,
        item: absolute(step.path),
      }),
    ),
  }
}

/** A page that is mostly a list of projects: the home page and each category. */
export function collectionSchema(options: {
  name: string
  description: string
  path: string
  projects: { title: string; path: string }[]
}) {
  return {
    "@type": "CollectionPage",
    "@id": absolute(options.path),
    url: absolute(options.path),
    name: options.name,
    description: options.description,
    inLanguage: LANGUAGE.tag,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.studio },
    // A category whose projects are all placeholders still names a real
    // service; it just has nothing to list yet, and an empty list says nothing.
    ...(options.projects.length
      ? {
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: options.projects.length,
            itemListElement: options.projects.map((project, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: project.title,
              url: absolute(project.path),
            })),
          },
        }
      : {}),
  }
}

/** One built project, with the facts a client judges it by. */
export function projectSchema(options: {
  title: string
  summary: string
  path: string
  location: string
  year: number
  area?: number
  categories: CategorySlug[]
  images: string[]
}) {
  return {
    "@type": "CreativeWork",
    "@id": absolute(options.path),
    url: absolute(options.path),
    name: options.title,
    description: options.summary,
    inLanguage: LANGUAGE.tag,
    isPartOf: { "@id": ID.website },
    creator: { "@id": ID.studio },
    dateCreated: String(options.year),
    locationCreated: { "@type": "Place", name: options.location },
    genre: options.categories.map(categoryLabel),
    image: options.images,
    ...(options.area
      ? {
          size: {
            "@type": "QuantitativeValue",
            value: options.area,
            unitCode: "MTK",
          },
        }
      : {}),
  }
}

/** A page that is neither a list nor a project: the studio and contact pages. */
export function pageSchema(options: {
  type: "AboutPage" | "ContactPage"
  name: string
  description: string
  path: string
}) {
  return {
    "@type": options.type,
    "@id": absolute(options.path),
    url: absolute(options.path),
    name: options.name,
    description: options.description,
    inLanguage: LANGUAGE.tag,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.studio },
  }
}
