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
