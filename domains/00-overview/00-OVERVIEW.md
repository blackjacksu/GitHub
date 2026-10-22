# AgentBureau — Trusted Agent Layer
## Master Plan & Index (v0.1 — 2026-10-21)

**Owner / Architect:** Willy (product), Claude (sole designer & architect)
**Working name:** AgentBureau · Protocol name: **ATP — Agent Trust Protocol**

---

## 1. One-paragraph thesis

Every purchase in the agent economy will soon be executed by two agents — a buyer's agent and a merchant's agent — that have never met and cannot verify each other. Payment rails (x402, AP2, Visa TAP, Mastercard Agent Pay) now exist, but **none of them answer the question "should I trust this counterparty?"** AgentBureau is the credit bureau for agents: it issues identities, runs Know-Your-Agent (KYA) checks, records every settled transaction as an on-chain attestation, and computes a **Trust Score** that grows with verified tenure and clean transaction history. Buyers' agents and merchants' agents query the score before they transact; escrow and disputes write results back into it.

## 2. Key architectural decision (read this first)

> **Do not build a new blockchain. Build the bureau on top of existing, deployed agent-trust primitives on an Ethereum L2.**

| Need | Existing primitive we adopt | Status (Oct 2026) |
|---|---|---|
| Agent identity | **ERC-8004 Identity Registry** (agent = ERC-721 "passport") | Draft standard; deployed on Ethereum, Base, BNB |
| Reputation feedback | **ERC-8004 Reputation Registry** | Deployed, shallow adoption (our opportunity) |
| Independent validation | **ERC-8004 Validation Registry** | Mainnet deployment pending → we run a validator |
| Escrowed purchase | **ERC-8183 job escrow + evaluator** | Draft; reference impls on Base/Arbitrum/Arc |
| Verifiable claims (KYA result, credit score, dispute outcome) | **EAS — Ethereum Attestation Service** | Live, free, predeployed on Base at `0x4200…0021` |
| Money movement | **x402** (stablecoin over HTTP) + AP2 mandates for fiat | x402 live, 160M+ payments; AP2 v0.2 |

**Recommended chain: Base (Base Sepolia for demo → Base mainnet).** Full comparison and reasoning in `01-BLOCKCHAIN-SURVEY.md`.

What AgentBureau *adds* (our product, our moat):
1. **KYA** — binding an agent passport to a real operator (merchant KYB / consumer KYC), model/software version, wallet authority, and spending policy.
2. **Trust Score** — a composable, auditable score (tenure × verified volume × dispute record × stake) published as revocable EAS attestations.
3. **Transaction verification** — acting as the ERC-8183 *evaluator* and ERC-8004 *validator* for purchases, so every order outcome becomes a reputation event.
4. **Dispute bureau** — the chargeback layer agent-to-agent commerce currently lacks.
5. **SDK/tooling** — one `npm install` for buyer agents and merchant agents.

## 3. Document map

| File | Domain | Audience / who implements |
|---|---|---|
| `00-OVERVIEW.md` | This index + thesis | Everyone |
| `01-BLOCKCHAIN-SURVEY.md` | 5-network comparison & recommendation | Architect (done by Claude) |
| `02-ARCHITECTURE-SPEC.md` | High-level system architecture, components, data model, flows | Tech lead / all implementers |
| `03-TRUST-MECHANISM.md` | Trust Score design, KYA, sybil resistance, decay, disputes | Trust/risk engineer, smart-contract dev |
| `04-IDENTITY-AND-KYA.md` | Identity model, passport schema, KYA tiers, operator binding | Identity engineer, compliance |
| `05-COMMUNICATION-PROTOCOL.md` | ATP wire protocol: handshake, trust query, purchase flow, receipts | Protocol/backend engineer |
| `06-NETWORK-SECURITY.md` | Threat model, key management, contract security, infra security | Security engineer |
| `07-AGENT-TOOLING.md` | SDKs, MCP server, CLI, indexer, dashboard | Developer-experience engineer |
| `08-VALIDATION-AND-TEST-SCOPE.md` | Validator role, test scope per domain, acceptance gates | QA / validator model |
| `09-BUSINESS-PROPOSAL.md` | Market, model, go-to-market, pitch to merchants/agent builders | Willy / BD |
| `10-WORKSTREAMS-AND-DELEGATION.md` | Phases, task breakdown per domain, goals, dependencies | Project manager / delegating model |
| `AgentBureau-BigPicture.html` | Visual one-pager of the recommended design | Willy (view in browser) |

## 4. Phase summary

| Phase | Weeks | Outcome |
|---|---|---|
| **P0 — Local demo** | 1–2 | Anvil (local EVM) + ERC-8004/EAS contracts + 2 scripted agents complete an escrowed purchase and a Trust Score updates. |
| **P1 — Testnet demo** | 3–5 | Same flow on **Base Sepolia** with x402 test-USDC, public explorer links, demo dashboard. |
| **P2 — Pilot** | 6–12 | 3–5 real merchant agents + buyer-agent SDK; bureau runs KYA; first disputes resolved. |
| **P3 — Mainnet** | 13+ | Base mainnet, staking, validator decentralization path, pricing live. |

## 5. Guiding principles for implementers

1. **Pointers on chain, payloads off chain.** Hashes/URIs on Base; KYA documents, receipts, evidence in encrypted storage (IPFS/S3).
2. **Standards first, extensions second.** If ERC-8004/8183/EAS can express it, use them. Our schemas are EAS schemas, not new contracts, wherever possible.
3. **Score is an opinion, history is a fact.** Raw events are immutable and public; the Trust Score is a signed, versioned, revocable bureau attestation. Anyone can recompute from history.
4. **Longevity alone must not equal trust.** Tenure counts only when paired with verified volume and stake (see sybil analysis in `03`).
5. **Human-in-the-loop for disputes above a threshold.** Automated evaluator for ≤ $X; human bureau analyst above.
6. **Demo over perfection.** Every phase ends with a runnable, visible flow.
