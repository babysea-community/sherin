import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.4em] text-fuchsia-200">
        Sherin
      </p>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
        Own key. Own domain. Own storage.
      </h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
        Self-hosted private workspace for generative media. Built for creators,
        artists, designers, and developers who want their own key, domain, and
        storage.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/access"
          className="rounded-full bg-fuchsia-300 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-950/40 transition hover:bg-fuchsia-200"
        >
          Owner access
        </Link>
        <a
          href="https://github.com/babysea-community/sherin"
          className="rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
        >
          View source
        </a>
      </div>
    </main>
  );
}
