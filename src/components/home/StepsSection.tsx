import { Reveal } from "@/components/ui/Reveal";

const STEPS = [
  {
    n: "01",
    title: "Connect",
    desc: "Link your Freighter wallet on Stellar testnet. No secret keys ever leave the extension.",
  },
  {
    n: "02",
    title: "Fund",
    desc: "Top up your testnet account instantly with Friendbot — no purchase, no real money.",
  },
  {
    n: "03",
    title: "Send",
    desc: "Enter a recipient and amount, pick a simulated corridor, and submit an XLM payment.",
  },
  {
    n: "04",
    title: "Track",
    desc: "Watch pending → success in real time, then verify the transaction on the explorer.",
  },
];

export function StepsSection() {
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
      {/* Sticky heading on the left */}
      <div className="lg:col-span-1">
        <div className="lg:sticky lg:top-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-accent">
            How it works
          </p>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground">
            Four steps from zero to your first cross-border payment
          </h2>
          <p className="mt-3 text-muted">
            Everything runs on Stellar testnet, so you can explore the full flow
            safely.
          </p>
        </div>
      </div>

      {/* Steps with a connecting vertical line on the right */}
      <div className="relative lg:col-span-2">
        <div className="absolute bottom-2 left-[1.15rem] top-2 w-px bg-border" />
        <ol className="space-y-8">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 60} className="relative flex gap-5">
              <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-medium text-foreground">
                {step.n}
              </span>
              <div className="pt-1.5">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  );
}
