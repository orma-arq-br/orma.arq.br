import { studio } from "../src/config"

/**
 * The only code that runs in front of the site. Every request passes through
 * here first. A request for an address that isn't the page's one address is
 * sent there, path and query intact, in a single permanent redirect:
 *
 * - www, or plain http, goes to https://orma.arq.br;
 * - a trailing slash is dropped (/sobre/ goes to /sobre), because pages are
 *   built as sobre.html. Cloudflare would do this on its own, but with a
 *   temporary redirect, which tells search engines the old address may come
 *   back and keeps it in their index;
 * - /sitemap.xml, where people and tools look first, goes to the sitemap
 *   index, the file the sitemap integration writes and robots.txt names.
 *
 * Everything else is handed straight to the static files Astro built, exactly
 * as if this weren't here.
 *
 * Kept in code rather than as a Cloudflare redirect rule so the whole setup
 * lives in this repository.
 */
const host = new URL(studio.url).hostname

interface Env {
  /** The files in dist/, bound in wrangler.jsonc. */
  ASSETS: { fetch(request: Request): Promise<Response> }
}

export default {
  fetch(request: Request, env: Env) {
    const url = new URL(request.url)
    const target = new URL(url)

    // How the visitor actually connected, as Cloudflare's edge reports it. A
    // local preview has no such header (and pretends to be plain http), so it
    // is never sent off to the live site.
    const isPlainHttp = request.headers.get("cf-visitor")?.includes('"http"')
    if (url.hostname === `www.${host}` || isPlainHttp) {
      target.hostname = host
      target.protocol = "https:"
    }
    if (url.pathname === "/sitemap.xml") target.pathname = "/sitemap-index.xml"
    else if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
      target.pathname = url.pathname.replace(/\/+$/, "") || "/"
    }

    if (target.href !== url.href) return Response.redirect(target.href, 301)
    return env.ASSETS.fetch(request)
  },
}
