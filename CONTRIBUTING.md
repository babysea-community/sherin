# Contributing

Thanks for improving Sherin.

Sherin is a self-hosted private workspace for generative media, built for creators, artists, designers, and developers who want their own key, domain, and storage. Good contributions keep the first-run path simple for creators and artists, while keeping the developer surface predictable and auditable.

## Development flow

1. Install dependencies:

   ```bash
   pnpm install --frozen-lockfile
   ```

2. Copy the environment template:

   ```bash
   cp .env.example .env.local
   ```

3. Configure Supabase, Google sign-in, one inference provider, and storage using [`.env.example`](.env.example) and the README.

   Start with Supabase Storage and Black Forest Labs unless your change specifically needs another adapter.

4. Apply the database migration with either Supabase SQL Editor or the CLI flow from the README.

5. Validate local service wiring:

   ```bash
   pnpm run doctor
   ```

6. Run the starter:

   ```bash
   pnpm dev
   ```

## Before opening a pull request

Run these checks:

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test:coverage
pnpm run doctor
pnpm build
```

When changing storage behavior, also run the opt-in storage probe against safe test buckets:

```bash
STORAGE_SMOKE_TEST=1 pnpm run doctor
```

## Contribution guidelines

- Keep the starter public-repo friendly: no secrets, private project ids, local-only URLs, personal generated media, or storage object URLs.
- Keep Sherin owner-only unless a change explicitly updates the product boundary, database policy, UI, README, and tests together.
- Keep every secret described in [`.env.example`](.env.example) server-side unless that template explicitly marks the value as public.
- Keep the creators and artists path approachable: defaults should work before optional infrastructure is introduced.
- Keep the developers path explicit: schema, worker, inference, storage, and monitoring changes should be traceable from code to docs.
- Keep Supabase Storage as the fallback save path when adding or changing primary storage adapters.
- Keep model additions registry-driven: update `lib/app-config.ts`, the provider model config, and registry tests instead of adding one-off Studio branches.
- Keep the Black Forest Labs and BabySea managed inference paths honest in docs and implementation. The Black Forest Labs path uses the configured provider API host; BabySea uses BabySea execution with regional routing and provider orchestration.
- Update README, `.env.example`, tests, and the doctor script when changing required configuration.
- Prefer focused changes. Avoid unrelated refactors in starter docs, migrations, worker code, or provider adapters.

## Documentation standard

Sherin docs are part of the release contract. Keep them factual, operator-ready, and tied to behavior that exists in the repository.

- Start from the README contract: what the starter is, what it is not, how to deploy it, how to validate it, and how to recover it.
- Use [`.env.example`](.env.example) as the source of truth for environment variable names; use exact commands, route paths, provider names, and file paths elsewhere.
- Document validation steps beside operational claims. If a feature says it is production-ready, include the check or workflow that proves it.
- Keep security guidance concrete: where secrets live, which values are browser-visible, how to rotate keys, and what should never be posted publicly.
- Update `CHANGELOG.md` for user-visible docs, configuration, security, or operations changes.
- Avoid roadmap language in the public contract. New features stay out of README claims until implemented, documented, and validated.

When a change touches these areas, update the matching docs before opening a PR:

| Change area                       | Required docs to review                                                            |
| :-------------------------------- | :--------------------------------------------------------------------------------- |
| Required or optional env values   | `.env.example`, README, `scripts/doctor.mjs` messaging                             |
| Auth, owner access, or callbacks  | README quick start, README production readiness, SECURITY.md                       |
| Inference behavior or model list  | README core capabilities, README customization guide, `test/sherin-models.test.ts` |
| Storage behavior or fallback path | README storage sections, References behavior, SECURITY.md, doctor smoke test docs  |
| Worker, cron, or rate limits      | README production readiness, SECURITY.md                                           |
| Monitoring or CI checks           | README production readiness, SECURITY.md, this guide                               |

## Issue triage

- `bug` - reproducible defect, with logs, a failing test, or a minimal reproduction.
- `proposal` - scoped design idea with the user problem, implementation sketch, and validation path.
- `good first issue` - small, well-scoped change that can be validated without production credentials.

## Conduct

See [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Be respectful, assume good faith, and keep discussion focused on the work and the people using it.

## Security-sensitive changes

Open security fixes privately through the process in [SECURITY.md](SECURITY.md). Do not include secrets described in [`.env.example`](.env.example), real user data, private generated media, live production URLs, prompts, reference images, deployment details, or storage object URLs in public issues, pull requests, test fixtures, logs, or screenshots.
