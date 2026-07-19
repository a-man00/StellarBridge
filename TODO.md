# TODO

## Level 1 MVP — done

- [x] Scaffold Next.js + Tailwind + TS + ESLint (App Router, src dir)
- [x] Stellar testnet constants + utilities
- [x] Freighter connect / disconnect / network detection
- [x] Balance fetch + unfunded detection + Friendbot funding
- [x] Send XLM: build → sign → submit, pending/success/error
- [x] Transaction hash + explorer link
- [x] Validation (address, amount, memo, self-send, balance)
- [x] Simulated remittance corridor + quote panel (UI only)
- [x] Light/dark mode, persisted
- [x] Responsive, flat, accessible UI (aria-live status)
- [x] README, PLAN, roadmap, .env.example
- [x] `npm run build`, `npm run lint`, `tsc --noEmit` all pass

## Before submitting

- [ ] Add real screenshots to `docs/` and link them in the README
- [ ] Deploy to Vercel and paste the live URL into the README
- [ ] Manually run the full testing checklist in the README
- [ ] Create the public GitHub repo and push

## Nice-to-have (not required for Level 1)

- [ ] Toast notifications instead of inline alerts
- [ ] Recent-transactions list from Horizon `/payments`
- [ ] Optional real FX rate via a public API (non-blocking)
- [ ] Unit tests for `validation.ts` and `format.ts`

## Future levels

See `docs/future-remittance.md`.
