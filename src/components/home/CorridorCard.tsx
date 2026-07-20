"use client";

import { useMemo, useState } from "react";
import { CORRIDORS, findCountry, MOCK_FX_PER_USD } from "@/lib/corridors";
import { RouteAnimation } from "./RouteAnimation";

// A live-feeling mock remittance quote card for the home hero.
export function CorridorCard() {
  const [index, setIndex] = useState(0);
  const corridor = CORRIDORS[index];
  const from = findCountry(corridor.from);
  const to = findCountry(corridor.to);

  const [amount] = useState(200);

  const { rate, received, fee } = useMemo(() => {
    const r = MOCK_FX_PER_USD[to.currency] ?? 1;
    return {
      rate: r,
      received: (amount * r).toLocaleString(undefined, {
        maximumFractionDigits: 2,
      }),
      fee: "~0.00001 XLM",
    };
  }, [to.currency, amount]);

  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent">
          Live corridor
        </p>
        <div className="flex gap-1">
          {CORRIDORS.map((c, i) => (
            <button
              key={`${c.from}-${c.to}`}
              onClick={() => setIndex(i)}
              aria-label={`Select corridor ${c.from} to ${c.to}`}
              className={`h-1.5 w-1.5 rounded-full transition-colors ${
                i === index ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Corridor selector row */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-2xl font-bold text-foreground">
            {from.flag} {from.code}
          </p>
          <p className="font-mono text-xs text-muted">{from.currency}</p>
        </div>
        <span className="font-mono text-muted">→</span>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-foreground">
            {to.flag} {to.code}
          </p>
          <p className="font-mono text-xs text-muted">{to.currency}</p>
        </div>
      </div>

      {/* Quote rows */}
      <div className="mt-5 divide-y divide-border rounded-lg border border-border">
        <Row label="You send" value={`$${amount} ${from.currency}`} />
        <Row
          label="Mock FX rate"
          value={`1 ${from.currency} ≈ ${rate} ${to.currency}`}
        />
        <Row label="Recipient gets" value={`${received} ${to.currency}`} />
        <Row label="Network fee" value={fee} />
        <Row label="ETA" value="~5 seconds" />
      </div>

      <RouteAnimation />

      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted">
        Simulated quote — Level 1 testnet demo
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-mono tabular-nums text-foreground">{value}</span>
    </div>
  );
}
