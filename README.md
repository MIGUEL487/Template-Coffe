# Light Roast Café

faz um site como esse por exemplo mas com cores claras, animaçao com scrolling, e identidade visual dessa cafeteria. (continuando usando a 1 imagem de exemplo

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e3e02910-fa80-446b-9b31-6e619b7d4479).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Cloudflare development and validation

Validated with Node.js 24.22.1 and npm 11.9.0. Use the existing checkout.

```sh
npm ci
npm run dev -- --host 0.0.0.0 --port 3000
npm run build
npm run preview
```

`preview` runs the built Worker with Wrangler on port 4173. `cf:preview` uses
Wrangler's default port 8787. Build first: the adapter generates
`.output/server/wrangler.json`. Plain `vite preview` expects a different server
output in this stack and returns HTTP 500; it is not the Cloudflare preview path.
The wrapper preserves a writable user configuration and falls back to ignored
`.wrangler/config` when the cloud home directory is read-only.

```sh
npm run lint
npm run typecheck
npm test
npm run test:browser
npm run deploy:wrangler -- --dry-run
```

The browser check uses Chromium at `/usr/bin/chromium`. Set `CHROMIUM_PATH`,
`QA_BASE_URL` and `QA_OUTPUT` to override the browser, application and evidence
directory. For example, validate the built Worker with
`QA_BASE_URL=http://127.0.0.1:4173 npm run test:browser`.

The pickup bag is explicitly a **demo**. It persists product choices locally,
validates restored items and quantities, and never sends an order or generates
an order confirmation. Contact fields and submission remain disabled until a
real order service, confirmed prices, availability, and pickup policies exist.
No payment information is collected.

The existing Neon integration tests require an authorized `DATABASE_URL` or
`NEON_DATABASE_URL` binding, seeded tenant/product data and reachable Neon Auth.
They are not mocked or skipped by the default test command. Configure secrets
through the project's managed secret settings; never copy credentials into the
repository. In a proxy-based cloud environment, use `NODE_USE_ENV_PROXY=1 npm test`.
Self-hosted fonts and local images let the storefront render without font CDNs.

Publish only after all required checks pass and Cloudflare authentication is
available. `--dry-run` validates packaging; it does not publish.

For interactive Cloudflare authentication on a machine that supports the OAuth
flow, use `node scripts/cloudflare.mjs login` so login and preview share the same
configuration directory. Alternatively, bind `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` securely through environment settings. Do not add their
values to files or chat.

### Cloudflare dependency installation

Cloudflare detects `bun.lock` and installs with `bun install --frozen-lockfile`.
Both `bun.lock` and `package-lock.json` must stay synchronized with `package.json`.
The frozen install and production build were verified with Bun 1.2.15, matching
Cloudflare's reported build environment. Keep the frozen-lockfile check enabled.
After npm dependency changes, regenerate the Bun lockfile from the npm lockfile in
an isolated directory and validate a clean frozen install before committing it.

### Product cutouts and motion audit

The counter contains six illustrative selections, all using existing transparent
PNG assets. The hero uses the restored two-cup coffee splash composition. The official
logo is used in the header and footer; real rectangular café/storefront photos
are reserved for contextual atmosphere and visit sections.

```sh
QA_BASE_URL=http://127.0.0.1:4173 node scripts/qa-cutouts.mjs
```

This browser audit reads the actual PNG alpha pixels and verifies that the counter
floats with motion enabled and stops when reduced motion is selected. The main
browser suite also checks wheel interpolation, mobile touch scrolling, selection
of all six favorites, and adding the food selections to the demo bag.
