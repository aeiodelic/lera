# Lera Protocol - Collective Event Funding

Lera is a transparent funding protocol for community-built events. Tickets power every decision: they finance the
budget, unlock lineups, and settle profits back to participants.

## Protocol Highlights
- **Tickets and Thresholds** - Each ticket equals 5 EUR (or a stablecoin pair) and one vote. Events set an entrance threshold that wallets must meet to attend.
- **Round-Based Funding** - Funding advances through Base -> Confirmation -> Expansion -> Settlement rounds. Rounds restart when quorum slips, unlocking refunds automatically.
- **Budget Meters** - Artists, infrastructure, and extras expose targets with live progress. Once an item reaches its target, it locks in for the next round.
- **Continuous Transparency** - Vote counts, budget hashes, and payout ledgers stay public so anyone can audit how the pool evolves.
- **Fair Settlements** - Profits distribute proportionally to ticket holders only after the on-site crew verifies delivery (no-shows lose their allocation).

## Repository Tour
- `app/events/page.tsx` - Interactive protocol snapshot with budget meters, round states, ticket wallet simulator, and transparent ledger highlights.
- `app/about/page.tsx` - Narrative overview of the Lera philosophy and user journey.
- `components/` - Shared UI primitives (`Button`, `Badge`, `Progress`) and the global header.
- `lib/supabase.ts` - Lazy client factory for wiring the UI to a Supabase backend when credentials are supplied.

## Domain Concepts
| Concept | Description |
| --- | --- |
| Ticket | Fixed-price 5 EUR credit that unlocks one vote. Refundable on failed quorum or before settlement. |
| Entrance Threshold | Minimum tickets required per attendee wallet (for example 3 tickets = 15 EUR). |
| Funding Item | Artist, infrastructure cost, or optional extra with a target and vote count. |
| Round | State change for the event treasury (Base, Confirmation, Expansion, Settlement). |
| Quorum | Minimum percentage of the aggregate goal that must be reached to advance a round. |
| Surplus | Remaining treasury funds after confirmed costs; distributed to ticket holders. |

## Development
```bash
pnpm install
cp .env.local.example .env.local
# Populate NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY if you want live data.
pnpm dev
```

Visit `http://localhost:3000` - the app redirects to the About page and links to the Events simulator. The UI runs fully
client-side by default; connecting Supabase will let you swap the sample data for real tables.

## Next Steps
1. Connect a Supabase instance and map `events`, `funding_rounds`, `funding_items`, and `votes` tables to replace the simulated state.
2. Gate round transitions with role-based actions (core crew) and automate ledger snapshots per round.
3. Extend the settlement view to show signed performance confirmations before triggering payouts.
