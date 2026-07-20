import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        Error 404
      </p>
      <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-foreground">
        Off the corridor
      </h1>
      <p className="mt-4 max-w-sm text-muted">
        The page you were looking for doesn&apos;t exist — or it never made it
        across the bridge.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/home"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Back to Home
        </Link>
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-foreground"
        >
          Open the App
        </Link>
      </div>
    </main>
  );
}
