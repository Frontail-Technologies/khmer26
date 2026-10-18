# Khmer26 web

Next.js 16 storefront and admin panel for the Khmer26 marketplace. See `../../docs/ARCHITECTURE.md` for how it fits together.

```bash
pnpm install
pnpm dev          # http://localhost:3000 (expects the API on NEXT_PUBLIC_API_URL)
pnpm typecheck
pnpm lint
pnpm test
pnpm build
```

Copy `.env.example` to `.env.local` and set the API URL. Pages are English or Khmer depending on the `NEXT_LOCALE` cookie; UI text is in `messages/en.json` and `messages/km.json`.

## Admin hostname

The marketplace and admin portal use the same Next.js deployment with host-based
routing. Set `NEXT_PUBLIC_ADMIN_URL=https://admin.khmer26.com`, add that origin to
the API `CORS_ORIGIN` list, and route the subdomain to this web deployment in DNS
with TLS enabled.

For local development, use `http://admin.localhost:3000/login`. Customer sign-in
remains at `http://localhost:3000/login`.
