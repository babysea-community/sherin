import {
  ExternalLink,
  GitBranch,
  Github,
  HeartHandshake,
  KeyRound,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

const repositoryUrl = 'https://github.com/babysea-community/sherin';

const communityLinks = [
  {
    href: repositoryUrl,
    label: 'Source code',
    description: 'Apache-2.0 project code, issues, releases, and docs.',
    Icon: Github,
  },
  {
    href: `${repositoryUrl}/blob/main/CODE_OF_CONDUCT.md`,
    label: 'Code of Conduct',
    description: 'Community standards for issues, pull requests, and support.',
    Icon: HeartHandshake,
  },
  {
    href: `${repositoryUrl}/blob/main/LICENSE`,
    label: 'License',
    description: 'OSI-approved Apache License 2.0 for reuse and forks.',
    Icon: Scale,
  },
] as const;

const projectBoundaries = [
  'Apache-2.0 open-source starter for self-hosted generative media workspaces.',
  'Community contributions happen through GitHub issues and pull requests.',
  'No hosted SaaS, paid support package, billing layer, or managed Sherin service is included.',
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 sm:px-8 lg:px-10">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.22),transparent_38rem),radial-gradient(circle_at_top_right,rgba(45,212,191,0.16),transparent_32rem)]"
        />

        <nav className="flex items-center justify-between gap-4 text-sm">
          <a
            href={repositoryUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-semibold uppercase tracking-[0.32em] text-fuchsia-100 transition hover:text-white"
          >
            Sherin
            <ExternalLink className="size-3.5" aria-hidden="true" />
          </a>
          <div className="flex items-center gap-2">
            <a
              href={`${repositoryUrl}/blob/main/CODE_OF_CONDUCT.md`}
              target="_blank"
              rel="noreferrer"
              className="hidden rounded-full border border-white/10 px-4 py-2 font-medium text-slate-300 transition hover:border-white/30 hover:text-white sm:inline-flex"
            >
              Conduct
            </a>
            <Link
              href="/access"
              className="rounded-full border border-white/10 px-4 py-2 font-medium text-slate-300 transition hover:border-white/30 hover:text-white"
            >
              Owner access
            </Link>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,0.92fr)] lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-teal-100">
              <ShieldCheck className="size-4" aria-hidden="true" />
              Apache-2.0 OSS starter
            </p>

            <h1 className="mt-7 max-w-3xl text-4xl font-semibold tracking-tight text-white sm:text-6xl">
              Community-owned source for private generative media workspaces.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Sherin is open-source software for builders who want to fork,
              inspect, self-host, and improve a single-owner creative workspace
              with their own keys, domain, and storage.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href={repositoryUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-fuchsia-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-950/40 transition hover:bg-fuchsia-200"
              >
                <Github className="size-4" aria-hidden="true" />
                View source
              </a>
              <Link
                href="/access"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                <KeyRound className="size-4" aria-hidden="true" />
                Owner access
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-black/40 ring-1 ring-white/10">
            <div className="rounded-[1.4rem] border border-white/10 bg-slate-950/80 p-5">
              <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Project surface
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Source, conduct, license, and community links
                  </p>
                </div>
                <GitBranch
                  className="size-5 text-teal-200"
                  aria-hidden="true"
                />
              </div>

              <div className="mt-5 grid gap-3">
                {communityLinks.map((item) => {
                  const Icon = item.Icon;

                  return (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-fuchsia-200/40 hover:bg-white/[0.06]"
                    >
                      <div className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-fuchsia-300/10 text-fuchsia-100 ring-1 ring-fuchsia-200/15 transition group-hover:bg-fuchsia-200/20">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="min-w-0">
                          <span className="flex items-center gap-2 text-sm font-semibold text-white">
                            {item.label}
                            <ExternalLink
                              className="size-3.5 text-slate-500 transition group-hover:text-fuchsia-100"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="mt-1 block text-sm leading-6 text-slate-400">
                            {item.description}
                          </span>
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <section className="border-t border-white/10 py-8">
          <div className="grid gap-4 md:grid-cols-3">
            {projectBoundaries.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="https://www.netlify.com/"
            className="font-medium text-teal-100 underline decoration-teal-200/40 underline-offset-4 transition hover:text-white hover:decoration-white"
          >
            This site is powered by Netlify
          </a>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <a
              href={`${repositoryUrl}/blob/main/LICENSE`}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              Apache-2.0 license
            </a>
            <a
              href={`${repositoryUrl}/blob/main/CODE_OF_CONDUCT.md`}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              Code of Conduct
            </a>
          </div>
        </footer>
      </section>
    </main>
  );
}
