# TRUST AI 3.0 — Phase 1 MVP

React + Vite frontend, Cloudflare Workers API, optional Supabase PostgreSQL logging. Prototype only; **not a live reputation scanner**.

## Run

```bash
npm install
npm run worker:dev
npm run dev
npm test
npm run build
```

Run Worker and Vite in separate terminals. Create a dedicated Supabase project and run `supabase/schema.sql` in SQL Editor. Set `SUPABASE_URL` on the Worker and store `SUPABASE_SERVICE_ROLE_KEY` as a Wrangler secret. Never put credentials in frontend code.

Deploy `dist/` to Cloudflare Pages, Worker separately; route `/api/*` to Worker. Before public launch add authentication, rate limiting, strict CORS, abuse protection, security tests and external threat intelligence.

## Limits

Regex heuristics only; no live URL fetch, LLM, certification, Pi payment, accounts or report center. No raw message storage is intended. `unknown` does not mean safe.
