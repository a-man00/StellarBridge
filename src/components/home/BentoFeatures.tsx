import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";

export function BentoFeatures() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Wide hero card */}
      <Reveal className="sm:col-span-2">
        <Card interactive className="h-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Near-instant settlement
          </p>
          <h3 className="mt-3 font-display text-2xl font-bold tracking-tight text-foreground">
            Value crosses borders in about five seconds
          </h3>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Stellar closes ledgers every few seconds, so a payment sent here
            confirms almost immediately — no multi-day correspondent banking
            delays.
          </p>
        </Card>
      </Reveal>

      <Reveal delay={60}>
        <Card interactive className="h-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Tiny fees
          </p>
          <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
            ~0.00001 XLM per transfer
          </h3>
          <p className="mt-2 text-sm text-muted">
            Fees are a rounding error, making micro-remittances viable.
          </p>
        </Card>
      </Reveal>

      <Reveal delay={90}>
        <Card interactive className="h-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Transparent
          </p>
          <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
            On-chain tracking
          </h3>
          <p className="mt-2 text-sm text-muted">
            Every payment has a public hash you can verify on the explorer.
          </p>
        </Card>
      </Reveal>

      <Reveal delay={120} className="sm:col-span-2">
        <Card interactive className="h-full">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
            Testnet-safe by design
          </p>
          <h3 className="mt-3 font-display text-lg font-semibold text-foreground">
            Explore the full flow with zero risk
          </h3>
          <p className="mt-2 max-w-lg text-sm text-muted">
            StellarBridge runs entirely on Stellar testnet. There is no real
            money, no KYC, and no secret-key handling — your selected wallet
            signs every transaction locally.
          </p>
        </Card>
      </Reveal>
    </div>
  );
}
