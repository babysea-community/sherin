# Changelog

All notable changes will be documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added

- Added DigitalOcean App Platform Button deploy manifests, README buttons, deployment guidance, and doctor validation for the expanded one-click deploy set.

## [0.3.0] - 2026-05-29

### Added

- Added Railway and Render deployment paths, including the published Railway template button, Render deploy button, Render blueprint, README guidance, and doctor checks for the expanded deploy-button set.
- Added `LICENSES.md` and a README security/compliance section documenting public GitLab and GitHub trust signals.

### Changed

- Bumped the starter release metadata to `0.3.0` for the deploy-host expansion.
- Expanded the homepage gallery to 36 mosaic images plus a full-width final image, keeping visible rendition-size suffixes in the bundled demo asset URLs.
- Swapped the gallery creator/social shortcut buttons to Simple Icons SVG paths for more accurate brand icons while keeping existing fallback icons for LinkedIn and Website.
- Standardized GitLab application security coverage with SAST-IaC, guarded Container Scanning, shared security variables, and license-compliance documentation.

### Notes

- Cloudflare Workers deploy support was evaluated and intentionally left out for this starter because the OpenNext Cloudflare adapter does not support the Next.js Node middleware required by the Supabase auth-refresh proxy.

## [0.2.9] - 2026-05-27

### Changed

- Updated the standalone starter catalog to `babysea@2.0.0` for the BabySea inference provider path.
- Bumped the starter release metadata to `0.2.9` for the SDK 2.0.0 compatibility update.

## [0.2.8] - 2026-05-27

### Added

- Added the refreshed Sherin homepage gallery to the public landing page, using the production gallery component instead of a detached demo.
- Added a separated "Ship your own Sherin" CTA section that explains the own-key, own-domain, own-storage deployment model and links builders to the source.

### Changed

- Added `AGENTS.md` with the shared starter guide structure and Sherin-specific owner auth, inference, storage, protected image, mobile solid-paint, and verification rules.
- Added more vertical breathing room between homepage sections and simplified gallery social shortcut buttons to solid paint with simple hover states.
- Aligned the README Sentry check badge with the shared Sentry badge color.
- Refined the public homepage branding around Sherin ownership: Sherin icon in the header, a key-marked Owner access button, fuchsia primary action styling, no duplicate hero owner action or Conduct button, and a right-weighted hero preview surface.
- Updated the separated CTA band with the `#000416` Sherin background color and a dashboard screenshot below the "Ship your own Sherin" button.
- Standardized the header, hero, gallery, CTA, and footer on the same wide `max-w-7xl` container while keeping the gallery image section slightly wider and preserving the original balanced two-stack visual rhythm.
- Rebuilt the gallery as a data-driven 24-image layout with icon-only creator/social shortcuts, restored desktop proportions, mobile square-card grids, protected plain-image rendering, and touch-safe active-card handling.
- Replaced homepage and gallery `next/image` usage with protected plain `<img>` rendering for Sherin icon, dashboard screenshot, and gallery assets.
- Removed archived gallery demo variants and the unused URL touch helper now that the gallery ships through one maintained component.

### Fixed

- Allowlisted `https://imagedelivery.net` in the starter CSP so the bundled demo gallery assets render in deployed previews.
- Removed shadow, ring, hover, transition, and translucent paint effects from the homepage Project surface link-card treatment to avoid the Android mobile rendering artifact while keeping the original card layout.

## [0.2.7] - 2026-05-25

### Added

- Added GitHub issue templates (`.github/ISSUE_TEMPLATE/bug_report.yml`, `feature_request.yml`, `config.yml`) and `.github/PULL_REQUEST_TEMPLATE.md` so contributors get a consistent intake form. The template set is identical across all BabySea OSS repos (primitives, starters, SDK) so it can be reused without project-specific adjustments.

## [0.2.6] - 2026-05-25

### Added

- Added a `.gitleaks.toml` with project-specific allowlist entries so the Gitleaks workflow ignores documentation and CI placeholder examples (mirrors BabyChain).
- Added a Vercel deploy preflight that fails the workflow if `NEXT_PUBLIC_SITE_URL`, `OWNER_EMAIL`, Supabase keys, or `BFL_API_KEY` (when `INFERENCE_PROVIDER=bfl`) are missing—and validates the email format and HTTPS site URL—so misconfiguration is caught before deploy instead of at runtime (mirrors BabyChain's deploy preflight).

### Changed

- Quoted `VERCEL_ENVIRONMENT` in `deploy.yml` via a dedicated env var rather than inline interpolation, matching BabyChain's hardened deploy pattern.

## [0.2.5] - 2026-05-24

### Added

- Added a GitLab CI pipeline that mirrors BabyChain's verification, coverage, build, dependency audit, secret scanning, Code Quality, SAST, Dependency Scanning, and scheduled/manual DAST checks.
- Added Cobertura coverage output for GitLab coverage reports.

### Fixed

- Fixed the Deploy workflow so preview dispatches do not pass production flags and `v*` tag releases still build and deploy with production flags.
- Replaced Sentry URL trailing-slash regex normalization with a bounded string scan to avoid CodeQL ReDoS noise.

## [0.2.3] - 2026-05-23

### Changed

- Expanded Dependabot version updates to check npm dependencies daily and GitHub Actions weekly.

## [0.2.2] - 2026-05-23

### Added

- Added doctor validation for the README Netlify and Vercel deploy buttons and Netlify template environment prompts.

### Fixed

- Stopped `scripts/doctor.mjs` from logging env-derived values or provider error text in clear text, resolving the CodeQL `js/clear-text-logging` alert.

## [0.2.1] - 2026-05-23

### Fixed

- Fixed CircleCI pnpm setup to install pnpm into a user-owned `$HOME/.local` prefix, avoiding `EACCES` failures from `cimg/node:24.11` when the image already has pnpm under `/usr/local/lib/node_modules`.

## [0.2.0] - 2026-05-22

### Added

- Added a CircleCI package-check workflow for Sherin package validation, production dependency audit, and trusted `main` Codecov CLI upload when `CODECOV_TOKEN` is configured in CircleCI.
- Added a Snyk Security workflow for Snyk Code SARIF upload, Open Source scanning and monitoring, high/critical dependency gating, and IaC reporting with `SNYK_TOKEN`.
- Added repository `codecov.yml` with GitHub Actions and CircleCI provider recognition, CI-gated Codecov status, and pull request comment configuration.

### Changed

- Constrained GitHub Actions Codecov uploads to the explicit Vitest LCOV report to avoid irrelevant uploader search warnings.
- Updated trusted Package Check Codecov uploads to pass `CODECOV_TOKEN` through the action environment and fail CI when coverage upload fails.

## [0.1.9] - 2026-05-22

### Changed

- Standardized contributing and code-of-conduct guidance with the shared BabySea OSS documentation standard.
- Moved Sherin repository metadata and starter distribution from the `babysea-ai` organization to `babysea-community`.
- Upgraded Package Check, Sentry Check, CodeQL, and Deploy workflow actions to Node 24-compatible majors, including `actions/checkout@v6`, `actions/setup-node@v6`, `pnpm/action-setup@v6`, `github/codeql-action@v4`, and `codecov/codecov-action@v6`.

### Fixed

- Declared `@next/eslint-plugin-next` as a direct standalone dev dependency and catalog entry so clean installs can resolve the flat ESLint config import during `pnpm lint`.
- Made the optional Sentry Project Check skip cleanly when Sentry CI secrets are absent and warn instead of failing hosted starter workflows when the configured token cannot read Sentry project or ownership endpoints.
- Replaced `gitleaks/gitleaks-action@v2` with a pinned, checksum-verified `gitleaks` CLI install and redacted full-history `gitleaks detect` run, avoiding the paid organization license requirement while keeping secret scanning enabled.

## [0.1.8] - 2026-05-21

### Security

- Updated the standalone Supabase CLI catalog to `supabase@2.78.0` so the development dependency tree resolves patched `tar@7.5.11` and clears the remaining Snyk symlink attack advisory.

## [0.1.7] - 2026-05-21

### Security

- Updated the standalone Sherin catalog to `next@16.2.6` to address Snyk-reported Next.js advisories, including the follow-up App Router proxy bypass advisory patched after `16.2.5`.
- Updated `@vercel/blob` to `2.0.1` so the production dependency tree no longer resolves vulnerable `undici@5.x` through Vercel Blob.
- Added a narrow `postcss@8.5.10` pnpm override to clear the remaining production PostCSS advisory while Next still depends on an older patched range.

## [0.1.6] - 2026-05-21

### Added

- Added Vitest V8 coverage reporting with `pnpm test:coverage`, producing text, lcov, and JSON summary reports for CI and Codecov ingestion.
- Added Codecov upload to the Package Check workflow through `codecov/codecov-action@v5`, using `CODECOV_TOKEN` and `coverage/lcov.info`.
- Added a Codecov badge to the README Checks section alongside Sentry, CodeQL, and package validation badges.

### Changed

- Package Check now runs coverage during CI instead of the plain Vitest run, keeping the release gate and coverage report generation on the same path.
- Synced the Sherin lockfile with the local catalog resolution for `babysea@1.4.6`.

## [0.1.5] - 2026-05-21

### Changed

- Update badge icon.

## [0.1.4] - 2026-05-20

### Changed

- Updated the BabySea SDK catalog dependency to `babysea@1.4.5`.

## [0.1.3] - 2026-05-20

### Added

- Added icon packs for button and hero, and provide link for buttons.

## [0.1.2] - 2026-05-20

### Changed

- Updated icon, tags, changelog header, and scripts deploy for auto topics and description.

## [0.1.1] - 2026-05-20

### Changed

- Updated icon.

## [0.1.0] - 2026-05-20

### Added

- Expanded the Sherin model registry with `bfl/flux-1.1-pro-ultra`, `bfl/flux-2-pro`, `bfl/flux-2-max`, `bfl/flux-2-flex`, `bfl/flux-2-klein-4b`, and `bfl/flux-2-klein-9b` alongside `bfl/flux-1.1-pro`.
- Added a capability-driven direct BFL model config layer covering endpoint, ratio/resolution support, input file limits, image prompt support, prompt upsampling, raw mode, guidance, steps, safety tolerances, and sizing mode.
- Added the References dashboard page for stored input images, with copyable reference URLs and generation id display.
- Added durable input image storage for uploaded files and URL inputs under `user-upload/<user_id>/<generation_id>/input-N.<ext>` before inference submission.
- Added Studio model selector icons using the inline Black Forest Labs icon for BFL models.
- Added registry and provider regression tests for BabySea model id derivation, BFL model capabilities, FLUX 1.1 Pro Ultra request shape, over-limit input rejection, unsupported safety tolerance rejection, and unsupported output format rejection.
- `app/dashboard/_components/offline-indicator.tsx` client component, mounted in the dashboard layout. Subscribes to the `online` / `offline` window events and renders a `role="status"` `aria-live="polite"` banner when `navigator.onLine` is false, so the owner gets an accessible cue before submitting work that would fail mid-flight.
- `x-request-id` correlation header on every response from `app/api/generations/process` (200, 401, 429, 500). The worker reuses an inbound `x-request-id` / `x-vercel-id` when it matches `/^[A-Za-z0-9._:-]{1,128}$/`, otherwise mints a `randomUUID()`. The same id is included in the JSON body and forwarded to `captureServerError` tags so a Sentry event can be traced back to a single cron tick or owner-triggered flush.
- Named `ProcessOutcome` discriminated union (`succeeded | failed | unavailable | retry_scheduled | skipped`) in `generation-worker.ts`. `processClaimedGeneration()` is now typed `Promise<ProcessOutcome>` so call-sites can exhaustively switch on the outcome instead of relying on inline `as const` literals.
- `STORAGE_SMOKE_TEST=1 pnpm run doctor` now writes, reads, verifies, and deletes a tiny object against the selected storage provider (Supabase Storage, Vercel Blob, Cloudflare R2, or AWS S3) and also verifies Supabase Storage fallback when a non-Supabase provider is primary.
- `lib/utils/env.ts` zod-backed helpers `requireEnvSchema()`, `getOptionalEnvSchema()`, `requireEmailEnv()`, and `getOptionalPositiveIntEnv()`. `OWNER_EMAIL` now flows through `requireEmailEnv()` so a malformed address fails fast with a clear error rather than silently locking the owner out of access.
- Pre-decode size guard on inline base64 `image_prompt` payloads in `app/dashboard/studio/_lib/server-actions.ts`. Compact-string length is checked before `Buffer.from(..., 'base64')`, and the decoded payload is rejected when it exceeds 10 MiB. Prevents a hand-crafted large `data:` URL from monopolising a server action.
- BFL provider metadata now includes `bfl_remote_url_expires_at` (ISO timestamp, ~10 minutes after generation). Sherin still downloads to durable storage immediately, but the timestamp gives gallery/storage-fallback paths the information they need to render a stale-link warning instead of a generic broken image.
- `INFERENCE_POLL_TIMEOUT_MS` env override for the per-invocation polling budget used by both BFL and BabySea providers. Defaults to 45_000 ms so it fits inside the 60 s worker `maxDuration`; raise it when you also raise `maxDuration` on a higher Vercel tier.
- `.github/workflows/deploy.yml`, tag- and manual-dispatch Vercel deploy workflow with separate `preview` and `production` environments, concurrency lock, and graceful no-op when `VERCEL_TOKEN` is absent. Uses `vercel pull → vercel build → vercel deploy --prebuilt`.
- README §8 gains _Production deployment_, _Monitoring_, _Backup and disaster recovery_, and _Secret rotation_ subsections covering the new deploy workflow, Sentry env surface and sampling, Supabase PITR / object-storage mirroring guidance, and a per-secret rotation cadence table.
- `lib/inference/errors.ts` `classifyInferenceError()`, single source of truth that maps unknown thrown errors (BFL provider errors, BabySea SDK errors `BabySeaError` / `BabySeaNetworkError` / `BabySeaTimeoutError` / `BabySeaRetryError` / `BabySeaGenerationFailedError`, `AbortError`, generic `Error`) into `{isTransient, statusCode, retryAfterSeconds, code}`. Permanent statuses (`400/401/402/403/404/409/410/413/415/422/451`) always return `retryAfterSeconds=0` even when a provider hints otherwise. `BabySeaError.rateLimit.reset` (unix seconds) is converted to a delta-from-now, capped at 600s.
- Bounded inference retry in `app/dashboard/studio/_lib/generation-worker.ts`: when an inference call throws a transient error and `attempt < MAX_GENERATION_ATTEMPTS`, the job is re-queued with `sherin_stage: 'retry_scheduled'` and `sherin_retry_not_before` so the next cron tick respects the provider's `Retry-After`. Storage / DB failures remain terminal (side-effect risk).
- Live progress stage indicator on the Studio result panel. `studio/page.tsx` reads `metadata.sherin_stage` and passes it to `StudioResultPanel`; `GeneratingPreview` renders a humanized label (e.g. "Submitting to BFL…", "Resuming after worker restart…", "Transient error, retry scheduled…") with `aria-live="polite"` so screen readers announce transitions. Combined with the existing 2.5s auto-refresh, the owner sees stage changes in near-real-time.
- Vitest 4 test harness with stub for the `server-only` package (`test/stubs/server-only.ts`, alias in `vitest.config.ts`). 19 unit tests colocated in `test/` (`test/inference-errors.test.ts`, `test/sentry-config.test.ts`, `test/rate-limit.test.ts`). Scripts: `pnpm test`, `pnpm test:run`.
- ESLint 10 flat config (`eslint.config.mjs`) with `@typescript-eslint/no-restricted-imports` enforcing server-only boundaries, direct imports of `@/lib/database/admin`, `@/lib/inference/*/server`, `@/lib/inference/errors`, `@/lib/storage{,/*}`, `@/lib/monitoring/sentry-server`, and `@/lib/security/rate-limit` from client components are blocked at lint time. Type-only imports are allowed. Server allowlist covers `app/**/route.ts`, `app/**/page.tsx`, `app/**/_lib/**`, `app/**/_actions/**`, `lib/**`, `proxy.ts`, `instrumentation.ts`, and tests. Scripts: `pnpm lint`, `pnpm lint:fix`.
- `pnpm audit --prod --audit-level=high` and `gitleaks/gitleaks-action@v2` jobs in `.github/workflows/publish-check.yml`. The starter job also now runs `lint` and `test:run` alongside `format`, `typecheck`, and `build`.
- Conditional Sentry initialization for Node.js, Edge, and browser runtimes via `instrumentation.ts`, `instrumentation-client.ts`, `lib/monitoring/sentry-config.ts`, and `lib/monitoring/sentry-server.ts`. All paths are no-ops when `NEXT_PUBLIC_SENTRY_DSN` is unset, so the starter still runs cleanly on developer machines and free deploys.
- `lib/security/rate-limit.ts` in-memory token-bucket limiter with auto-sweep, applied to the worker endpoint with separate ceilings for bearer-token callers (12/min), the owner session (30/min), and anonymous IP fingerprints. 429 responses include `Retry-After` and `X-RateLimit-*` headers.
- `onPreSubmit` hook on the inference provider contract. The BFL adapter now fires it immediately before the non-idempotent submit so the worker can persist a `bfl_submit_attempts` counter and `bfl_submit_attempted_at` timestamp, eliminating the silent crash-resume hole.
- Bounded BFL crash-resume: a single resubmit is allowed when no `bfl_request_id` was persisted, flagged with `bfl_duplicate_risk: true` and `sherin_stage: 'bfl_resubmit_after_crash'` for operator audit; further gaps fail loudly.
- `.env.example` `OBSERVABILITY` and `WORKER` sections documenting the Sentry variables (`NEXT_PUBLIC_SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_ENVIRONMENT`, `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`) and the optional `CRON_SECRET` shared secrets.
- Initial public Sherin starter release for a private, owner-only generative media workspace.
- Studio, Gallery, Usage, and Profile dashboard surfaces for image generation workflows.
- Supabase-backed authentication, persistence, storage fallback metadata, and generation queue processing.
- Black Forest Labs direct inference and BabySea managed inference adapters.
- Supabase Storage, Vercel Blob, Cloudflare R2, and AWS S3 storage adapters.
- Local `pnpm-workspace.yaml` catalog so dependency monitors can track package versions from one workspace manifest.
- Netlify and Vercel deployment configuration.
- Per-owner storage quota tracking through `generations.storage_bytes`, included in `supabase/migrations/001_sherin.sql`, and enforced before object writes. `CUSTOM_USER_STORAGE_QUOTA_GB` defaults to 10 GB and can be raised or lowered per deployment.

### Changed

- BabySea model mapping is now derived from the Sherin model id registry, so matching BabySea identifiers do not need duplicated per-model entries.
- Direct BFL request construction now reads model capabilities instead of relying on model-specific ad hoc branches. FLUX 1.1 Pro Ultra sends `aspect_ratio` and optional `raw`; dimension-based BFL models continue to send `width` and `height`.
- Studio BFL fields now hide unsupported dimensions for aspect-ratio models and show only the controls supported by the selected model.
- Prompt upsampling defaults are resolved on the server from the selected BFL model config when the form field is absent.
- Gallery and References cards now surface the Supabase generation id for easier operator support and storage tracing.
- README, security, contribution, and community docs now describe References, durable input references, the current model list, and the version deployment surface.
- Owner sign-out (`app/dashboard/_lib/server-actions.ts`) now passes `{ scope: 'local' }` to `supabase.auth.signOut()` so signing out of the dashboard does not invalidate the owner's session on other devices. Inline JSDoc documents the Next.js Server Actions CSRF posture (POST-only, `Origin` must match `Host`) so future contributors do not paper an unnecessary CSRF token over the framework guarantee.
- `app/api/generations/process/route.ts` has a top-of-file comment block explaining the GET vs POST split: GET is a bearer-only idempotent cron poke, POST accepts bearer or owner session for an owner-triggered flush. Both share the same queue and per-caller rate limit.
- BFL and BabySea provider polling budgets now read `INFERENCE_POLL_TIMEOUT_MS` from the environment, with a 45_000 ms fallback that matches the previous hardcoded value. Comments on both adapters now explicitly link the budget to the worker `maxDuration`.
- Reorganized `lib/` into topic folders. Loose modules now live under intent-revealing parents:
  - `lib/sentry/config.ts` → `lib/monitoring/sentry-config.ts`
  - `lib/sentry/server.ts` → `lib/monitoring/sentry-server.ts`
  - `lib/utils.ts` → `lib/utils/index.ts` (path `@/lib/utils` unchanged)
  - `lib/env.ts` → `lib/utils/env.ts`
  - `lib/owner.ts` → `lib/auth/owner.ts`
  - `lib/rate-limit.ts` → `lib/security/rate-limit.ts`
  - `lib/generation-display.ts` → `lib/generation/display.ts`
  - `lib/generation-descriptions.json` → `lib/generation/descriptions.json`
- Moved all unit tests out of `lib/` and into a dedicated `test/` folder (`test/inference-errors.test.ts`, `test/sentry-config.test.ts`, `test/rate-limit.test.ts`). `vitest.config.ts` `include` narrowed to `test/**/*.test.ts`.
- Hardcoded Sentry sample rates in `lib/monitoring/sentry-config.ts` (server traces 0.2) and `instrumentation-client.ts` (browser traces 0.2, replays session 0.1, replays on error 1.0). Tune by editing those files.
- Sentry env surface trimmed to the public-only variables `NEXT_PUBLIC_SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_ENVIRONMENT` plus the build-time `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` trio. Removed `SENTRY_DSN`, `SENTRY_ENVIRONMENT`, `SENTRY_TRACES_SAMPLE_RATE`, `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE`, `NEXT_PUBLIC_SENTRY_REPLAYS_SAMPLE_RATE`, and `NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE` from `.env.example` and from `instrumentation.ts`, `next.config.ts`, `lib/monitoring/sentry-config.ts`, and `lib/monitoring/sentry-server.ts`.
- `pnpm-workspace.yaml` catalog gained `@eslint/js`, `eslint`, and `eslint-config-next` entries so the lint toolchain is monitored alongside the rest of the dependency tree.
- `_components/studio-result-panel.tsx` `GeneratingPreview` now accepts an optional `stage` prop and maps known stages through a label table with a graceful underscore-to-space fallback for unknown values.
- `app/api/generations/process/route.ts` `maxDuration` reduced from 300s to 60s for compatibility with all Vercel tiers (Hobby/Pro/Enterprise). Long generations resume on the next cron tick via persisted `bfl_request_id` / `idempotencyKey`. Worker errors are now forwarded to `captureServerError`.
- BFL and BabySea provider poll budgets tightened to 45s with a 20s per-request timeout to fit inside the new function ceiling.
- Stale-running generation reclaim window shortened from 20 minutes to 90 seconds, in line with the new worker budget.
- BFL provider error handling now classifies transient (408/425/429/5xx) vs permanent failures and surfaces `Retry-After`, status code, and `isTransient` metadata on thrown errors.
- Standardized internal asset component paths under `lib/icons`.
- Named the shared object storage adapter `s3-compatible-storage.ts` for clearer Cloudflare R2 and AWS S3 ownership.
- BFL poll-budget timeouts now throw a typed timeout so long-running generations are re-queued and resumed by the next worker tick instead of being marked permanently failed.
- Retry scheduling now honors `metadata.sherin_retry_not_before` when selecting queued work, so provider `Retry-After` hints are not bypassed by browser or cron pokes.
- `STORAGE_SMOKE_TEST=1 pnpm run doctor` now performs Put/Get/Delete verification against the selected storage provider and Supabase fallback instead of only checking Supabase bucket reachability.
- Studio and Gallery queue polling now skips network work while the tab is hidden, reducing background load from inactive creator sessions.
- The cancel action and UI copy now make clear that cancellation stops Sherin tracking locally; provider-side jobs already submitted may still complete.

### Security

- Direct BFL provider submission now rejects unsupported output formats, unsupported safety tolerances, unsupported raw mode, unsupported image prompts, unsupported guidance/steps, custom dimensions on aspect-ratio models, and input files above the selected model limit before making a provider network call.
- Input URL and upload handling persists provider-facing input assets through Sherin storage first, keeping reusable references under the configured storage boundary.
- Documented and exercised the Next.js Server Actions built-in CSRF guard (POST-only, `Origin` must match `Host`) on the owner sign-out path; combined with `SameSite=Lax` Supabase cookies this removes the need for a hand-rolled CSRF token without weakening the boundary.
- Per-request correlation ids (`x-request-id`) on the worker endpoint make it possible to triage a 401/429/500 reported by a cron runner against the exact Sentry event, closing a forensic gap when investigating suspected abuse or replay.
- Inline base64 `image_prompt` payloads are now rejected before `Buffer.from(..., 'base64')` allocates, closing a server-action DoS path where a multi-hundred-megabyte `data:` URL could exhaust function memory during studio submission.
- `OWNER_EMAIL` validated as an RFC-shaped email at startup via zod, eliminating a class of misconfiguration where a typo (whitespace, missing TLD) would let no Google account through the owner-only gate.
- `STORAGE_SMOKE_TEST=1` opt-in probe gives operators a non-destructive way to confirm selected storage and Supabase fallback credentials from CI before deploys, rather than discovering bucket/permission drift at first user generation.
- Lint-time enforcement of the server-only import boundary closes the accidental-leak path where a client component could pull in `lib/database/admin` (service-role key) or a raw inference provider module. The runtime `import 'server-only'` guard remains as defense-in-depth.
- Supply-chain guardrails: `pnpm audit` fails CI on any production dependency advisory at high severity or above; gitleaks scans the full git history on every push for committed secrets.
- `next.config.ts` emits a strict `Content-Security-Policy` assembled dynamically from configured Supabase, Cloudflare R2, AWS S3, Vercel Blob, and Sentry DSN hosts. `frame-ancestors 'none'`, `object-src 'none'`, no `unsafe-eval`. Sentry wiring is wrapped so the config still loads when `@sentry/nextjs` is absent.
- Worker endpoint rate limiting closes the unbounded GET/POST DoS exposure on `app/api/generations/process`.
- Worker endpoint pre-auth rate limiting now runs before session lookup, so failed or cross-site auth attempts are throttled before they can create database/session load.
- Owner-only Google OAuth gate via `OWNER_EMAIL`.
- Environment validation through `pnpm run doctor` before runtime or deployment.
- Public release packaging excludes local secrets and build artifacts through the BabySea starter deploy workflow.
