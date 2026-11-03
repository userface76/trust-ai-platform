# TRUST AI 3.0 — Cloudflare-only MVP

**Status:** Deployment-ready source, not yet deployed. Rule-based scam warning prototype; no live URL verification, no safety guarantee.

## Architecture
React + Vite → Cloudflare Worker with static assets → optional Cloudflare D1. No Supabase dependency.

## Local setup

```bash
npm install
npm test
npm run build
npm run worker:dev
```

Worker dev serves both UI and `/api/v1/scans` after building. For hot-reload frontend run `npm run dev` in a separate terminal (API proxy to Worker on port 8787).

## Deploy (Cloudflare account required)

1. Login: `npx wrangler login`
2. Run: `npm run deploy`
3. Wrangler prints your `https://trust-ai-platform.<subdomain>.workers.dev` URL.

Alternatively connect this GitHub repo to Cloudflare Workers Builds and set build command `npm run build`, deploy command `npx wrangler deploy --config worker/wrangler.toml`. Do not put secrets in GitHub.

## Optional D1

1. `npx wrangler d1 create trust-ai-db`
2. Copy returned database_id into `worker/wrangler.toml` and uncomment `[[d1_databases]]` block.
3. `npx wrangler d1 execute trust-ai-db --remote --file=./d1/schema.sql`
4. `npm run deploy`

Only a minimal risk-result record is saved when D1 is configured; user input is not stored.

## Production requirements

Add Turnstile, rate limiting, logging/retention controls, testing, and real threat-intelligence providers before a public safety-critical launch. No current URL fetch or external verification.

## Community comment moderation policy (planned)

Community posting and comments are not implemented yet. When implementing them:
- Accept relevant experiences, questions, corrections, and dissenting opinions even if they disagree with the scan result.
- Reject obvious spam, unrelated promotions, repeated copy-paste, phishing links, and malicious solicitations.
- Hold ambiguous/off-topic comments for review rather than irreversible deletion.
- Hide personal data and threatening content pending review.
- Persist moderation reason codes, rule/model version, timestamps, and an appeal workflow; limit retention and access.
- Rate-limit submissions, require authenticated writers, and allow administrators to override automated decisions.
- Never treat popularity or community comments as verified evidence by themselves.
