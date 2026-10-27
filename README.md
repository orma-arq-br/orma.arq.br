# Orma

Website for Orma, an architecture studio. The site itself is written entirely in Brazilian Portuguese.

> [!WARNING]
> Work in progress. Nothing here is final: structure, content, and design are all still changing.

## Stack

- [Astro](https://astro.build) with plain components and scoped CSS (no UI frameworks)
- [pnpm](https://pnpm.io) as the package manager

## Running locally

```sh
pnpm install
pnpm dev
```

The dev server runs at `http://localhost:4321`.

## Deploying

Cloudflare builds and publishes every push to `master` at https://orma.arq.br (Workers Builds, connected to this repository; configured in `wrangler.jsonc`). Build command `pnpm build`, deploy command `npx wrangler deploy`. `www.orma.arq.br` redirects to `orma.arq.br` in `worker/index.ts`, the only code that runs in front of the static files.

## Working on this repo

This project is built primarily through Claude Code. Read `AGENTS.md` before doing anything: it defines who the site is built with, the quality bar, and the project skills in `.agents/skills/` that cover design, motion, copy, and assets.

> [!NOTE]
> Decisions made by the person prompting always override the skills. When a decision changes, update the corresponding skill so it stays the source of truth.

## Credits

Built with love by Liliane Basso, [Rafael Audibert](https://github.com/rafaeelaudibert), our little cat Aura 🐈 and, of course, Claude 🤖

Made in cold Porto Alegre 🇧🇷, during the winter, fueled by a lot of chimarrão 🧉❄️
