/**
 * Studio facts, defined once and imported everywhere.
 * Never hardcode these in a component or page.
 */
export const studio = {
  name: "ORMA Arquitetura",
  shortName: "ORMA",
  /** One line, used on the studio page and in meta descriptions. */
  tagline: "Arquitetura e interiores em Porto Alegre e na Serra Gaúcha",
  city: "Porto Alegre",
  state: "RS",
  /** Where the studio takes on work, in visitor-facing wording. */
  regions: ["Porto Alegre", "Serra Gaúcha"],
  country: "Brasil",
  /** CAU registration is the credential clients look for. `null` until we have it. */
  /* Order follows the footer in the Figma design. */
  partners: [
    { name: "Letícia Bierhals Ignacio", cau: null },
    { name: "Liliane Basso", cau: "A307604-0" },
  ],
  /**
   * When the studio answers. `text` is the sentence a visitor reads on the
   * contact page; the rest is the same fact in the shape search engines read.
   * Change them together.
   */
  hours: {
    text: "de segunda a sexta-feira, das 9h às 18h",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "18:00",
  },
  email: "contato@orma.arq.br",
  /** Digits only, country code included. Used to build the wa.me link. */
  whatsapp: "555193297649",
  instagram: "https://www.instagram.com/orma.arquitetura",
  instagramHandle: "@orma.arquitetura",
  url: "https://orma.arq.br",
} as const

export const whatsappUrl = `https://wa.me/${studio.whatsapp}`

export const partnerNames = studio.partners.map((partner) => partner.name)

/** "CAU A307604-0" — only the partners whose registration we already have. */
export const cauLine = studio.partners
  .filter((partner) => partner.cau)
  .map((partner) => `CAU ${partner.cau}`)
  .join(" · ")
