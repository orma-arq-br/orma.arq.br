import { getCollection } from "astro:content"
import type { APIRoute } from "astro"

import { categories, categoryLabel, type CategorySlug } from "../lib/categories"
import { partnerNames, studio, whatsappUrl } from "../config"
import { absolute, DESCRIPTIONS, findable, LLMS_SUMMARY } from "../seo"

/**
 * `/llms.txt` — the site in Markdown, for an assistant answering a question
 * about architects rather than a person browsing photographs.
 *
 * A portfolio is the worst possible shape for a machine to read: the pages are
 * almost entirely full-bleed images, and what a project actually *is* lives in
 * a caption and a paragraph. This flattens the same facts into plain text, in
 * the order a person would want them, with every claim carrying the location
 * and year that make it checkable.
 *
 * Written in Portuguese like everything else: the questions this exists to
 * answer are asked in Portuguese.
 */
export const GET: APIRoute = async () => {
  const projects = (await getCollection("projects", findable)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  )

  const lines = [
    `# ${studio.name}`,
    "",
    `> ${LLMS_SUMMARY}`,
    "",
    "## O estúdio",
    "",
    `- Nome: ${studio.name}`,
    `- Arquitetas: ${partnerNames.join(" e ")}`,
    `- Onde fica: ${studio.city}, ${studio.state}, ${studio.country}`,
    `- Onde atende: ${studio.regions.join(", ")}`,
    `- E-mail: ${studio.email}`,
    `- WhatsApp: ${whatsappUrl}`,
    `- Instagram: ${studio.instagram} (${studio.instagramHandle})`,
    "",
    "## O que projetamos",
    "",
    ...categories.map(
      (category) =>
        `- [${category.label}](${absolute(`/${category.slug}`)}): ${category.intro}`,
    ),
    "",
    "## Projetos",
    "",
    ...projects.flatMap((project) => {
      const d = project.data
      const facts = [
        d.location,
        d.area ? `${d.area.toLocaleString("pt-BR")} m²` : undefined,
        String(d.year),
        (d.categories as CategorySlug[]).map(categoryLabel).join(", "),
      ].filter(Boolean)

      return [
        `- [${d.title}](${absolute(`/projetos/${project.id}`)}) — ${facts.join(" · ")}`,
        `  ${d.summary}`,
      ]
    }),
    "",
    "## Páginas",
    "",
    `- [Sobre nós](${absolute("/sobre")}): ${DESCRIPTIONS.sobre}`,
    `- [Contato](${absolute("/contato")}): ${DESCRIPTIONS.contato}`,
    "",
  ]

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
