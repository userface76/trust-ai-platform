# D1 case archive deployment checklist

This code adds private case storage and public-case search endpoints, but **does not automatically provision a database**.

1. In Cloudflare dashboard create D1 database named `trust-ai-db` (or via Wrangler: `npx wrangler d1 create trust-ai-db`).
2. Copy the **actual** D1 database UUID into the `[[d1_databases]]` binding in `worker/wrangler.toml`. Set `binding = "DB"`, `database_name = "trust-ai-db"`, `database_id = "<actual UUID>"`.
3. Apply `d1/schema.sql` and `d1/cases.sql` to that D1 database using Cloudflare D1 console or Wrangler remote execution:
   - `npx wrangler d1 execute trust-ai-db --remote --file=./d1/schema.sql`
   - `npx wrangler d1 execute trust-ai-db --remote --file=./d1/cases.sql`
4. Redeploy from GitHub and check `/api/health` returns `storage: "d1"`.
5. Test a **redacted dummy case**; confirm POST returns an ID and one-time access key, and GET with `x-case-key` can retrieve it. Public GET returns only approved `visibility=public` cases.

Security notes:
- No authentication or admin moderation is implemented. The public list therefore stays empty unless trusted administrators later explicitly approve cases.
- Do not manually change cases to public without implementing review, authorization, takedown, and privacy checks.
- The access key is a bearer secret; store securely. The current UI does not yet have a private-case lookup form; API lookup requires the key header.
- Regex redaction is partial. Users must remove personal data before submission. Text is stored with consent only; image uploads are not persisted.
- Add identity, ownership, deletion, retention, rate limiting, Turnstile, and abuse monitoring before public launch.
