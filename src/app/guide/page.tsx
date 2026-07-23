import Link from "next/link";
import { Reveal } from "@/components/ui/Reveal";
import { Card } from "@/components/ui/Card";

const STEPS = [
  {
    n: "01",
    title: "Install a Stellar wallet",
    body: (
      <>
        Install a supported wallet such as{" "}
        <a
          href="https://www.freighter.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2"
        >
          Freighter
        </a>
        , xBull, or Lobstr and create or import an account. Your wallet holds
        your keys — StellarBridge never sees them.
      </>
    ),
  },
  {
    n: "02",
    title: "Switch your wallet to Testnet",
    body: (
      <>
        Open your wallet settings, choose the network selector, and select{" "}
        <span className="font-medium">Testnet</span>. StellarBridge only works
        on Stellar testnet.
      </>
    ),
  },
  {
    n: "03",
    title: "Launch the app and connect",
    body: (
      <>
        Open the{" "}
        <Link href="/app" className="text-accent underline underline-offset-2">
          dashboard
        </Link>{" "}
        and click <span className="font-medium">Connect Wallet</span>. Choose a
        detected wallet from the list and approve the connection request.
      </>
    ),
  },
  {
    n: "04",
    title: "Fund your wallet with Friendbot",
    body: (
      <>
        If your account is unfunded, click{" "}
        <span className="font-medium">Fund Testnet Wallet</span>. Friendbot
        deposits ~10,000 test XLM. It may rate-limit repeat requests, so wait a
        moment if it fails.
      </>
    ),
  },
  {
    n: "05",
    title: "Send your first XLM payment",
    body: (
      <>
        Enter a valid recipient address (starts with <code>G</code>), an amount
        (use <span className="font-medium">Max</span> to fill balance minus a fee
        buffer), and an optional memo. Click{" "}
        <span className="font-medium">Send XLM</span> and approve in your
        wallet.
      </>
    ),
  },
  {
    n: "06",
    title: "Verify on the explorer",
    body: (
      <>
        After success, copy the transaction hash or click{" "}
        <span className="font-medium">View on Stellar Expert</span> to confirm
        the payment on-chain. It also appears on the{" "}
        <Link href="/history" className="text-accent underline underline-offset-2">
          history
        </Link>{" "}
        page.
      </>
    ),
  },
];

const TROUBLESHOOTING = [
  {
    q: "Wallet not detected",
    a: "Make sure the extension or app is installed and enabled, then reload the page. Some browsers require you to pin the extension after install. StellarBridge shows an install link for each supported wallet when it is not detected.",
  },
  {
    q: "Wrong network",
    a: "StellarBridge shows a warning if your wallet is not on Testnet. Switch the network in your wallet settings and reconnect.",
  },
  {
    q: "User rejected signature",
    a: "If you decline the connection or transaction signing prompt, StellarBridge shows a clear 'rejected' message. No transaction is submitted unless you explicitly approve it in your wallet.",
  },
  {
    q: "Insufficient balance",
    a: "The send form prevents amounts that exceed your balance. If a transaction still fails, Horizon returns an 'insufficient balance' error — leave enough XLM for the network fee and minimum reserve.",
  },
  {
    q: "Friendbot rate limited",
    a: "Friendbot limits repeat funding requests. Wait a minute and try again, or use an already-funded testnet account.",
  },
  {
    q: "Transaction failed",
    a: "Common causes: the destination account doesn’t exist yet (it must be funded first), insufficient balance including the reserve, or a rejected signature. The error panel shows a friendly message plus collapsible technical details.",
  },
];

export default function GuidePage() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-10">
        <p className="font-mono text-xs uppercase tracking-widest text-accent">
          Guide
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Set up and send your first payment
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          A six-step walkthrough from installing a wallet to verifying a
          transaction on the explorer.
        </p>
      </header>

      {/* Steps with connecting line */}
      <div className="relative">
        <div className="absolute bottom-2 left-[1.15rem] top-2 w-px bg-border" />
        <ol className="space-y-8">
          {STEPS.map((step, i) => (
            <Reveal as="li" key={step.n} delay={i * 50} className="relative flex gap-5">
              <span className="relative z-10 flex h-10 w-10 flex-none items-center justify-center rounded-full border border-border bg-background font-mono text-xs font-medium text-foreground">
                {step.n}
              </span>
              <div className="pt-1.5">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  {step.title}
                </h2>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      {/* Troubleshooting */}
      <section className="mt-16 border-t border-border pt-10">
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
          Troubleshooting
        </h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TROUBLESHOOTING.map((t) => (
            <Card key={t.q}>
              <h3 className="font-display text-sm font-semibold text-foreground">
                {t.q}
              </h3>
              <p className="mt-1.5 text-sm text-muted">{t.a}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-12 flex justify-center">
        <Link
          href="/app"
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Open the App →
        </Link>
      </div>
    </main>
  );
}
