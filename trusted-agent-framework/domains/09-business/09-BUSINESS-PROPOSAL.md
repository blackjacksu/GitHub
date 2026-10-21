# 09 — Business Proposal: AgentBureau
*Domain: Business / BD · Audience: prospective partners, merchants, agent builders, investors · Status: v0.1 draft for Willy to edit*

## 1. The problem in one sentence
Agents can now **pay** (x402: 160M+ payments; AP2, Visa TAP, Mastercard Agent Pay live or piloting) but nobody has solved **whom to pay** — there is no credit bureau, no KYA, and no chargeback between autonomous agents.

## 2. Why now
- 2025–26 produced the rails: x402 (Linux Foundation, 40+ members incl. Visa, Mastercard, Google, AWS), ERC-8004 identity registries on Base/Ethereum/BNB, ERC-8183 escrow, Google UCP checkout for "hundreds of thousands" of merchants.
- Yet academic audits of ERC-8004 show ~85–97% of registered agents are empty shells and reputation is operationally shallow. **Identity exists; trust does not.**
- Payment networks explicitly scope out counterparty quality (x402 "asks nothing about the payer"). The gap is the product.

## 3. Product
**AgentBureau** = KYA + Trust Score + transaction verification + dispute bureau, delivered as attestations on Base and an SDK/MCP server.
- For **merchant agents**: know which buyer agents are real, bonded, and won't file false disputes → accept agent traffic with confidence; cut fraud losses.
- For **buyer agents / consumer platforms**: know which merchant agents deliver → safely let users' agents spend.
- For **payment networks & marketplaces**: a neutral, auditable risk signal they can plug into AP2/TAP/x402 flows.

## 4. Business model
| Revenue line | Mechanism | Indicative price |
|---|---|---|
| Transaction verification fee | % of escrow-settled order (bureau as evaluator) | 0.3–0.8% |
| Trust lookups | Free up to N/day; x402 micro-fee beyond | $0.001–0.01 / query |
| KYA onboarding | Per-operator, per-tier | $0 (T1), $49–199 (T2), custom (T3) |
| Dispute handling | Bond-funded; fee on human-reviewed cases | $5–25 / case |
| Enterprise API / data | Risk feeds for PSPs, marketplaces | SaaS tiers |

Unit economics target (P3): > 70% gross margin; on-chain cost < $0.02 per settled order.

## 5. Go-to-market
1. **Seed trust with supply first**: onboard 20–50 merchant agents (Shopify/Stripe-ACP merchants experimenting with agents; x402-paid API services) with free Tier-2 KYA and a "Verified by AgentBureau" badge in their agent card.
2. **Buyer-side distribution via SDK/MCP**: ship `@atp/mcp-server` so any Claude/GPT shopping agent can check trust in one tool call; list in MCP registries and Coinbase AgentKit ecosystem.
3. **Rail partnerships**: position as the *risk layer* for x402 facilitators and AP2 wallets; join x402 Foundation.
4. **Taiwan beachhead (optional second market)**: Taiwanese e-commerce (PChome, momo, Shopee TW) merchants + LINE-based agents; Willy's cultural edge.

## 6. Competitive landscape
| Player | What they do | Gap we fill |
|---|---|---|
| Visa TAP / Mastercard Agent Pay | Recognize *agents on card rails* | Closed, card-only, no counterparty scoring, no merchant-side agent trust |
| ERC-8004 registries | Identity + raw feedback | No KYA, no score, no evaluator, no disputes |
| Firmata / DYOE-style KYA checks | Per-tx sanctions/wallet checks | No longitudinal score, no escrow+dispute loop |
| Escrow projects (PactEscrow, ArcBounty) | Escrow for agent jobs | No bureau, no identity binding |
| Web2 fraud vendors (Sift, Forter) | Human-shopper fraud | Not agent-native, no on-chain portability |

**Moat:** longitudinal, verified, portable history (the data), the evaluator position in the money flow, and being the neutral standard-compliant scorer (EAS + ERC-8004) rather than a walled garden.

## 7. Milestones & asks
| Milestone | When | Ask |
|---|---|---|
| Local demo | +2 wks | — |
| Base Sepolia public demo + explorer | +5 wks | 3 design partners (merchant agents) |
| Pilot: 5 merchants, 100 settled orders, first dispute resolved | +12 wks | Angel/pre-seed $250–500k: audit, KYC vendor, 2 engineers |
| Mainnet + x402 Foundation membership | +6 mo | Seed round |

## 8. Risks & mitigations
- **Standards shift** (ERC-8004 revisions, AP2 absorbs trust) → we build on EAS attestations (format-agnostic) and keep adapters thin.
- **Coinbase/Google ship a bureau** → be first, be neutral, be multi-rail; sell them data/API rather than fight.
- **Regulatory** (KYC/KYB, money transmission via escrow) → escrow is non-custodial smart contract; KYC via licensed vendor; legal memo at P2.
- **Cold start** → free KYA for first cohort; badge value; MCP distribution.

## 9. Pitch (30 seconds)
"Every agent transaction has two strangers. AgentBureau is the credit bureau for agents: we verify who's behind an agent, score how it has behaved across every rail, hold the money in escrow until the job is done, and settle disputes when it isn't. Built on open standards on Base, pluggable into x402, AP2 and card rails. Trust is the missing layer of the agent economy — we are that layer."
