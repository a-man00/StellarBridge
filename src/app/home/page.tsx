import Link from "next/link";
import { CorridorCard } from "@/components/home/CorridorCard";
import { StatsStrip } from "@/components/home/StatsStrip";
import { StepsSection } from "@/components/home/StepsSection";
import { BentoFeatures } from "@/components/home/BentoFeatures";
import { CorridorMarquee } from "@/components/home/CorridorMarquee";
import { CtaBand } from "@/components/home/CtaBand";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4">
      {/* ── Asymmetric hero ─────────────────────────────────────── */}
      <section className="grid grid-cols-1 items-center gap-10 py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Stellar Testnet · Level 1 MVP
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Send value across borders in seconds
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">
            StellarBridge is a cross-border remittance hub built on Stellar
            rails. Connect your preferred wallet (Freighter, xBull, Lobstr,
            Albedo, etc.), fund a testnet account, and send XLM payments with a
            simulated FX and corridor experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              Launch App →
            </Link>
            <Link
              href="/guide"
              className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
            >
              Read the Guide
            </Link>
          </div>
        </div>

        <div className="lg:pl-6">
          <CorridorCard />
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────── */}
      <Reveal className="pb-14">
        <StatsStrip />
      </Reveal>

      {/* ── How it works ────────────────────────────────────────── */}
      <section className="border-t border-border py-16">
        <StepsSection />
      </section>

      {/* ── Why StellarBridge (bento) ───────────────────────────── */}
      <section className="border-t border-border py-16">
        <Reveal>
          <SectionHeading
            eyebrow="Why StellarBridge"
            title="Built for fast, transparent, low-cost transfers"
            description="A focused Level 1 foundation for a cross-border remittance app."
            className="mb-10"
          />
        </Reveal>
        <BentoFeatures />
      </section>

      {/* ── Corridors marquee ───────────────────────────────────── */}
      <section className="border-t border-border py-16">
        <Reveal>
          <p className="mb-6 text-center font-mono text-xs uppercase tracking-widest text-muted">
            Popular remittance corridors (simulated)
          </p>
          <CorridorMarquee />
        </Reveal>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="border-t border-border py-16">
        <Reveal>
          <CtaBand />
        </Reveal>
      </section>
    </main>
  );
}
