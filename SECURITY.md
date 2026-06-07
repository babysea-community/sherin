# Security policy

## Reporting vulnerabilities

Please report vulnerabilities privately through GitHub's **Report a vulnerability** flow on the public `babysea-community/sherin` repository. If that flow is unavailable, contact the maintainers at `dev@babysea.ai`.

Do not open public issues for suspected vulnerabilities, exposed secrets, private generated media, or account access problems that include sensitive details.

## Supported versions

Sherin is versioned from the public `main` branch. Security fixes target the latest public source and the latest tagged release when tags are available.

## Runtime security model

Sherin is an owner-only starter. The dashboard is protected by Supabase Auth and the configured owner allowlist from [`.env.example`](.env.example), while the home page and access page remain public.

Generation records, stored input references, and dashboard access are private to the configured owner. Supabase Postgres stores durable generation records, and Supabase Storage remains the private signed-URL fallback save path even when Vercel Blob, Cloudflare R2, or AWS S3 is selected as primary storage. External object URL visibility follows the selected provider, bucket, and custom-domain policy, so treat storage URLs as sensitive deployment data.

The worker route `/api/generations/process` is method-specific. External cron callers should use `GET /api/generations/process` with the worker bearer secret configured from [`.env.example`](.env.example). The app can use same-origin `POST /api/generations/process`; POST accepts a valid bearer token, or the signed-in owner session when the request origin matches the host. Keep cron callers private, rotate the worker secret when the caller changes, and avoid exposing worker responses that include operational metadata.

## Security ownership matrix

| Surface         | Boundary in Sherin                                                                                                        | Operator responsibility                                                            |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------- |
| Owner access    | Supabase Google OAuth and the configured owner allowlist gate dashboard routes.                                           | Keep OAuth ownership current and rotate Google OAuth secrets on ownership change.  |
| Database        | Supabase Postgres stores prompts, status, metadata, storage paths, and profile state.                                     | Enable backups, restrict service-role key access, and review RLS before changes.   |
| Generated media | Active storage provider persists completed images and input reference assets; Supabase fallback uses private signed URLs. | Configure external bucket/domain visibility intentionally and test fallback saves. |
| Inference       | Inference provider and BabySea credentials are read only on the server.                                                   | Monitor provider usage and rotate keys after access or billing anomalies.          |
| Worker endpoint | Cron GET requires the configured worker bearer secret; owner POST requires same-origin owner session or bearer token.     | Keep cron headers out of logs and honor rate-limit responses.                      |
| Observability   | Sentry is optional; source-map upload uses build/CI-only secrets.                                                         | Treat Sentry auth tokens as sensitive and keep event links out of public issues.   |
| Supply chain    | CI includes package checks, production audit, CodeQL, and gitleaks.                                                       | Keep checks green and review dependency updates before production deployment.      |

## Sentry and code guard

Sherin includes optional runtime Sentry error capture for server and browser paths. Sentry initializes only when `NEXT_PUBLIC_SENTRY_DSN` is set, so local development and forked deployments can run without telemetry configured.

The public starter also ships `scripts/sentry-project-check.mjs` and a scheduled `Sentry Project Check` workflow that verifies the configured Sentry project wiring and ownership rules. The workflow uses GitHub Actions secrets. Local runs may read ignored `.sentryclirc` defaults for org/project/url, but the Sentry auth token named in [`.env.example`](.env.example) must stay in an environment variable or secret store.

Build-time sourcemap upload uses the Sentry auth token named in [`.env.example`](.env.example). Treat that token as a secret even though the public Sentry browser DSN is safe to expose to the browser.

## Secret handling

- Never commit `.env`, `.env.local`, `.env.production`, `.vercel`, `.sentryclirc`, exported dashboard secrets, or provider keys.
- Use [`.env.example`](.env.example) as the source of truth for every runtime, build, CI, provider, storage, worker, and monitoring variable.
- Keep every secret described in [`.env.example`](.env.example) server-side unless that template explicitly marks the value as public.
- Only intentionally public values should use the public environment prefix. Never expose service-role keys, provider keys, storage write keys, or worker secrets with that prefix.
- Rotate any secret that appears in logs, screenshots, chat, issues, pull requests, or generated media metadata.
- Use separate keys for local, preview, and production deployments when the provider supports it.

## Operational guardrails

Before production deployment, run:

```bash
pnpm run doctor
pnpm format
pnpm lint
pnpm typecheck
pnpm test:run
pnpm build
```

When changing storage credentials or adapters, run the opt-in storage probe against safe test buckets:

```bash
STORAGE_SMOKE_TEST=1 pnpm run doctor
```

The public package checks include formatting, linting, type checking, tests, build, production dependency audit, CodeQL, and a gitleaks secret scan. Keep those checks green before releasing or deploying a fork.

## Incident response

For suspected key exposure, account misuse, public media leakage, or abnormal provider usage:

1. Revoke or rotate the exposed secret at the provider first.
2. Update the hosting or CI secret store, then redeploy Sherin.
3. Run `pnpm run doctor`; if storage changed, also run `STORAGE_SMOKE_TEST=1 pnpm run doctor` against safe buckets.
4. Review Supabase Auth logs, generation records, provider usage, storage access logs, and Sentry events.
5. Use any `x-request-id` from worker responses to correlate cron or owner-triggered processing with Sentry events.
6. Open a private vulnerability report if the issue affects the public starter, not only one private deployment.

## Data handling

- Treat prompts, image prompts, input reference images, generated media, storage URLs, and provider metadata as private owner data, even when an external storage adapter returns a public object URL.
- Do not share signed storage URLs in public issues or pull requests.
- Prefer synthetic prompts and generated test fixtures when demonstrating bugs.
- Remove or redact `x-request-id`, Sentry event links, provider request ids, bucket names, and account ids when they could identify a private deployment.
