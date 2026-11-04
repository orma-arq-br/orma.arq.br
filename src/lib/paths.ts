/**
 * The address a page is reached at, as a visitor and every link see it.
 *
 * Pages are built as files (`sobre.html`), so during the build Astro reports
 * their path with the extension. Cloudflare serves them without it, and that
 * extensionless form is the only one the site ever names: links, canonical,
 * sitemap, structured data. "/index.html" and "/sobre.html" become "/" and
 * "/sobre".
 */
export function pagePath(url: URL) {
  const path = url.pathname.replace(/(\/index)?\.html$/, "").replace(/\/+$/, "")
  return path || "/"
}
