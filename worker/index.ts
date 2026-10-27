import { studio } from "../src/config"

/**
 * The only code that runs in front of the site. Every request passes through
 * here first: one for www, or over plain http, is sent, path and query
 * intact, to the same page on https://orma.arq.br; everything else is handed straight to the static files
 * Astro built, exactly as if this weren't here.
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

    const isWww = url.hostname === `www.${host}`
    // How the visitor actually connected, as Cloudflare's edge reports it. A
    // local preview has no such header (and pretends to be plain http), so it
    // is never sent off to the live site.
    const isPlainHttp = request.headers.get("cf-visitor")?.includes('"http"')

    if (isWww || isPlainHttp) {
      url.hostname = host
      url.protocol = "https:"
      return Response.redirect(url.toString(), 301)
    }

    return env.ASSETS.fetch(request)
  },
}
