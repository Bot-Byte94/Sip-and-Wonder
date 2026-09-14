# Cloudflare trial hosting

Sip & Wonder also supports a standalone Cloudflare Workers deployment, independent of Sites. The trial uses the Workers Free plan and a D1 database. R2 is omitted, so photo upload controls are hidden and the API rejects photo attachments. Coffee logs, reflections, and creature progression continue to use D1.

Build with `npm run build`, then run:

```sh
node scripts/prepare-cloudflare.mjs ACCOUNT_ID DATABASE_ID
npx wrangler d1 migrations apply sip-and-wonder --remote --config dist/server/wrangler.cloudflare.json
npx wrangler secret put SIGNUP_INVITE --config dist/server/wrangler.cloudflare.json
npx wrangler deploy --config dist/server/wrangler.cloudflare.json
```

Use the actual account and database IDs returned by Cloudflare. The preparation command writes an ignored configuration under `dist/server` and leaves the Sites configuration intact. Repeat it after each build. Use an existing database for subsequent deployments.

New trial accounts require the invitation code stored in the SIGNUP_INVITE Worker secret. Share it privately with invited testers. Do not commit the code. Existing accounts sign in with their own password. The invitation protects registration; the landing and login pages and creature assets remain accessible at the web address. Personal journal and game APIs require a session.

This deployment uses a fresh database: accounts and progress from the Sites-hosted app are not copied. The Sites deployment retains its existing photo support and access controls. Workers Free quotas apply; do not enable a paid Workers plan or R2 subscription for this trial.

To restore photo uploads later, enable R2 explicitly and provide its bucket name as the preparation command's third argument. The UI detects the storage capability from the server.
