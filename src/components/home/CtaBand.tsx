import Link from "next/link";

// Flat solid band: black in light mode, white in dark mode.
export function CtaBand() {
  return (
    <div className="rounded-lg bg-slate-900 px-6 py-12 text-center dark:bg-slate-100">
      <h2 className="font-display text-3xl font-bold tracking-tight text-white dark:text-slate-900">
        Start sending on Stellar testnet
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-slate-300 dark:text-slate-600">
        Connect Freighter, fund with Friendbot, and send your first XLM payment
        in under a minute.
      </p>
      <div className="mt-6">
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-200 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
        >
          Launch App →
        </Link>
      </div>
    </div>
  );
}
