# Review notes — 09 Business proposal
- Problem statement and "identity exists, trust does not" framing are strong.
- Cold start (C7): the score carries no signal for ~90 days; lead the pilot with binary KYA verification and the escrow/dispute loop, and position the score as the P2 product.
- Fee on settlement competes for the same basis points as payment rails; fine, but model it against x402 facilitator fees and card interchange.
- Competitive table is missing: Coinbase Verifications, Cloudflare Web Bot Auth, Stripe ACP, Google UCP, Virtuals ACP (which has evaluator agents), Olas. Research report will fill this in.
- Taiwan beachhead: card and LINE Pay dominated; stablecoin escrow adoption near zero; VASP regulation applies. Treat as a P3+ question.
- Milestones are aggressive but acceptable if the P0 scope is cut per C10.
- Claims under fact-check: F2, F4, F7, F12.

## From the landscape research
- R1: no one occupies the neutral bureau seat, but the "score" slot on Base is crowded with thin oracles and the KYA slot is taken by rail-affiliated vendors (Skyfire → Mastercard/Forter, Trulioo → AP2, Sumsub, Concordium, Catena with an OCC charter). The honest "why us" is escrow-grounded outcomes + operator KYA + disputes in one place, rail-neutral.
- Card networks are shipping their own agent scores (Mastercard agent-probability score in US testing, Visa/Mastercard/Ant cross-network KYA framework); those are detection-only and not merchant-portable today. Entry threat ranking from the research: Coinbase/x402 Foundation adding identity, network scores, Catena.
- Fix F4, F7, F12 in the proposal before it is shown externally. Market-size forecasts for agentic commerce span ~35× across analysts; cite a range, not a point.
- Taiwan: VASA (2026-06-30) and EPI Act capital requirements make a stablecoin escrow beachhead a licensing project; treat as P3+.
