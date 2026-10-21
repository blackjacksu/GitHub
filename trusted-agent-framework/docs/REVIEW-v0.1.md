# Architecture Review — AgentBureau spec v0.1

*Reviewer: Claude (architect role) · Date: 2026-10-21 · Scope: the eleven documents under `domains/` · Mode: review only, no implementation.*

Per-domain notes live next to each spec as `domains/<nn>-<name>/REVIEW.md`. This document holds the verdict, the ranked cross-cutting issues, the fact-check register, and the decisions needed before any workstream is delegated.

---

## 1. Verdict

The spec is coherent and unusually complete for a v0.1: a clear thesis, a defensible chain choice, a real data model, a threat model, a test scope, and a delegation plan. It is **not yet ready to delegate**. Three things must happen first:

1. **Fix the trust formula.** As written it awards 250 points for "no disputes" to an agent with zero history and lets a 90-day-old agent with ~$10k of settled volume reach the *Trusted* band. It almost certainly fails its own sybil target (§3 of `03`). Details in issue C1.
2. **Freeze the interfaces between workstreams.** EAS schema fields, ATP message schemas, contract ABIs, and the scoring input-event format are sketches today. Five implementer agents working in parallel against sketches will diverge. An interface-control pass (call it WS0.5) is the first thing to delegate.
3. **Resolve the bureau's role conflicts and liveness.** The bureau simultaneously earns a fee on settlement, decides settlement as evaluator, rules disputes, and scores both parties, and if it is down no escrow can complete. These are design choices with legal and availability consequences, not implementation details.

Everything else is refinement.

## 2. Ranked cross-cutting issues

Severity: **Blocker** (must change before delegation) · **Major** (must decide before P1) · **Minor** (fold into refinement).

### C1 · Blocker · Trust formula does not meet its own sybil target (`03`)

Worked numbers with the v1 formula `score = 1000 × (0.25T + 0.30V + 0.25D + 0.10S + 0.10K) − P`:

| Case | T | V | D | S | K | Score | Band |
|---|---|---|---|---|---|---|---|
| Fresh agent, KYA tier 1, zero tx | 0 | 0 | **1.0** | 0 | 0.4 | **290** | Provisional |
| Fresh agent, KYA tier 3, zero tx | 0 | 0 | 1.0 | 0 | 1.0 | 350 | Provisional |
| 90 active days, $10k settled, KYA 2, no stake | 0.64 | 0.67 | 1.0 | 0 | 0.8 | **691** | **Trusted** |
| Same with modest stake ($600) | 0.64 | 0.67 | 1.0 | 1.0 | 0.8 | 791 | Trusted |

- `D = 1 − upheld / max(10, settled)` is 1.0 for an agent with no transactions. A quarter of the score is granted for the absence of evidence. Use a Bayesian prior (for example `(settled − upheld + a) / (settled + a + b)` with a prior that starts near 0.5) or scale D by a confidence term in settled count.
- Tenure saturates fast: `log(1+90)/log(1+1095) = 0.64`. Ninety days buys two-thirds of the tenure component. Volume likewise: `$10k → 0.67`. Both log curves are generous exactly where sybils operate (low end).
- The band table (`03` §2) states gates ("≥ 1 year, clean disputes, staked" for Trusted) that the formula does not enforce. Make bands = numeric threshold **and** hard gates, stated in one place.
- Cost to reach Trusted in the 90-day case: bureau fees on $10k of wash volume (0.3–0.8% → $30–80), KYA tier 2 ($49–199), capital tied up 90 days. Low hundreds of dollars. The spec never states what order limit Trusted unlocks, so the "≥ 10×" property is currently untestable (see V-scope S3.1).
- Recommendations: (a) make limits a function of stake (collateralised trust: `maxOrder ≤ f(stake, band)`), (b) count only counterparty-diverse volume (unique counterparties with KYA ≥ 2, cluster-discounted via `OperatorLink`), (c) add the prior to D, (d) define per-band limits so S3.1 is testable, (e) keep the formula but version it and publish the worked examples as test fixtures.

### C2 · Blocker · Interfaces between workstreams are not frozen (`02`, `05`, `10`)

The five parallel workstreams share four boundaries, all currently sketches: EAS schema fields (`02` §3), ATP message JSON (`05` §3), contract ABIs for `ATPEscrow`/`ATPValidation`/`ATPStake`, and the scoring input-event format (`03` §3). Add a **WS0.5 "interface control"** deliverable before WS1–WS5 start: `spec/schemas/*.json`, `spec/abi/*.json`, `spec/events.md`, each with a version and an owner, and a rule that changes go through an ADR. The delegation template in `10` §3 should point at these files, not at prose sections.

### C3 · Major · Bureau role conflicts (`02`, `03`, `09`)

The bureau is fee recipient, evaluator, dispute judge, and scorer. Specific problems:
- `02` §4 step 5: "escrow releases to merchant **minus bureau fee**". If the fee is only collected on `complete()`, the evaluator is paid to complete. Charge the fee at `fund()` or on both outcomes.
- The same key that attests `TrustScore` also rules disputes that feed the score. Separate the signing keys per role (evaluator key, attester key, dispute key) from P1 so compromise and audit scopes are bounded, even if one organisation holds all three.
- "Score is an opinion, history is a fact" (`00` §5) is right. Say explicitly which inputs are **not** reproducible by third parties: KYA tier, operator clustering, fraud flags, and penalties all rest on bureau-private data. `02` §5 "any third party can recompute a score" is only true for T, V, D, S.

### C4 · Major · Evaluator liveness: bureau downtime freezes money (`02`, `05`, `06`)

If the bureau is unreachable, no job can reach `complete()`; funds sit until `expire()` refunds the buyer, so merchants who delivered do not get paid. Threat 12 in `06` only covers the sequencer. Add: buyer-confirm auto-release without the bureau, timeout auto-release to the merchant when evidence was submitted and no dispute was opened (eBay-style), and a documented degraded mode. The 99.9% availability target (`02` §5) is then a business metric rather than a funds-safety requirement.

### C5 · Major · Owner-key rotation is indistinguishable from reputation sale (`04`)

`04` §2 says key rotation must not reset trust but an NFT transfer must. On-chain both are an ERC-721 `Transfer`. Define an **authorised transfer ceremony**: the operator proves the same `operatorHash` through a fresh KYA session within a grace window and the score is preserved; any other transfer resets. Also handle the common legitimate case of migrating ownership from an EOA to a Safe.

### C6 · Major · Legal exposure arrives at P1, not P2 (`03`, `04`, `09`)

The bureau's `complete()`/`reject()` authority is *control over disposition of funds* even if the contract is non-custodial; the money-transmitter analysis (FinCEN 2019 guidance on "control") and state escrow licensing turn on exactly that. Consumer KYC (tier 1) also puts the bureau in scope of data-protection law in two jurisdictions. Move the legal memo from P2 to a P1 go/no-go on the escrow design, and consider whether tier-1 consumer verification can be delegated to wallets and platforms that already do it (see C8).

### C7 · Major · Cold start is harsher than the GTM assumes (`03`, `09`)

Tenure counts active days only, so a merchant onboarded with free tier-2 KYA sits at Provisional for about 90 days no matter what. The "Verified by AgentBureau" badge therefore carries no score signal during the pilot. Options: lead with the binary **KYA-verified** product and add score once history exists; or bootstrap tenure and volume with low-weight external evidence (domain age, Stripe/Shopify account age, Visa TAP certificate, Coinbase Verifications attestation), explicitly flagged as `source=external` in `inputsRoot`.

### C8 · Major · Reuse existing on-chain verification rather than running consumer KYC (`04`)

Coinbase Verifications already publishes EAS attestations on Base for verified accounts; wallets and AP2 payment providers already verify consumers. Accepting those as tier-1 evidence cuts PII handling, vendor cost, and the regulatory surface, and matches the "standards first" principle. Keep bureau-run KYB for merchants (tier 2/3) where the accountability actually matters.

### C9 · Minor · ATP invents messages it says it will reuse (`05`)

`05` §2 says "reuse, don't invent", then §3 defines `ATP_HELLO`, `ATP_QUOTE`, `ATP_FUNDED` and so on as bespoke messages. Define them as an **A2A extension** (agent card `extensions` entry plus A2A message parts) so any A2A framework gets ATP for free, and keep bespoke endpoints only for the bureau API.

### C10 · Minor · Scope of P0/P1 tooling is too wide for the team (`07`, `10`)

SDK, MCP server, CLI, indexer, explorer, two demo agents, and a scaffolder in five weeks is a lot even with delegated implementers. For P0 keep the SDK core, a script-driven demo, and a one-page explorer; defer CLI polish and `create-atp-agent` to P2. The scoring library should take an event list as input so it does not wait on the indexer (`10` §1 has WS2 blocked on WS5).

### Other items (Minor)

- `00` §3 lists `AgentBureau-BigPicture.html`; it was not provided. Either add it or drop the reference.
- `OperatorLink` holds `uint256[] agentIds` in one attestation; every change forces revoke-and-reissue. One attestation per (operator, agent) pair is simpler to index and revoke.
- Off-chain attestation revocation needs a defined mechanism (EAS `revokeOffchain` on-chain, or a bureau-served revocation list); `03` §3 step 4 assumes consumers can check "not revoked" but does not say how for off-chain attestations.
- Signed `GET /v1/trust` requests reveal who is checking whom. Decide whether lookups are signed (rate-limiting, paid tiers) or anonymous (privacy), per tier.
- "Software attestation (code hash or TEE quote)" at tier 3 needs a definition of *what* is hashed for a non-deterministic LLM agent (model id + prompt bundle + tool manifest + SDK version is realistic; "the code" is not).
- Upgradeable escrow (UUPS + 48h timelock) holding user funds is itself a trust assumption. Consider immutable escrow versions with migration instead; if upgradeable, the timelock must be longer than the longest job deadline.
- `jobId = keccak(buyer, merchant, buyerNonce)` must match how the ERC-8183 reference assigns ids; verify before freezing.
- Missing workstreams in `10`: legal/compliance and data-protection. Add owners even if the owner is Willy plus counsel.
- Name check: "ATP" and "AgentBureau" should be searched for collisions before external use.

## 3. Fact-check register

Claims in the spec that the landscape research is verifying. Status is updated when the research report lands (`research/reports/`).

| # | Claim (where) | Status | Note |
|---|---|---|---|
| F1 | ERC-8004 registries deployed on Ethereum, Base, BNB; Validation Registry not on mainnet (`00`, `01`) | pending | |
| F2 | 3–15% of ERC-8004 registrations expose a valid file; 85–97% empty shells; source arXiv 2606.26028 (`01`, `03`, `09`) | pending | |
| F3 | EAS predeployed at `0x4200…0021` on Base mainnet and Base Sepolia (`00`, `01`) | pending | |
| F4 | x402: 160M+ payments, ~129M on Base, $42M volume; Foundation with 40+ members incl. Visa, Mastercard, Google, AWS (`01`, `09`) | pending | |
| F5 | AP2 at v0.2 (`00`) | pending | |
| F6 | ERC-8183 draft with reference escrows on Base, Arbitrum, Arc; PactEscrow and ArcBounty exist (`00`, `01`, `09`) | pending | |
| F7 | Google UCP checkout for "hundreds of thousands" of merchants (`09`) | pending | |
| F8 | Base ≈ 62% of L2 fee revenue in 2025; < $0.01/tx (`01`) | pending | |
| F9 | ERC-8004 reputation feedback can be written by the bureau "as an authorized client" without the rated agent's consent (`02`) | pending | Matters for negative feedback |
| F10 | Hedera HCS-14 Universal Agent ID exists as described (`01`, `04`) | pending | |
| F11 | ENSIP-25 agent names (`01`, `04`) | pending | |
| F12 | Firmata / "DYOE" as KYA competitors (`09`) | pending | |

## 4. Decisions needed from Willy

1. **Product scope:** generic "trusted agent framework" with commerce as the first profile, or commerce-only AgentBureau? Affects naming, schemas (`TxReceipt` is commerce-specific), and the protocol.
2. **Consumer side:** run tier-1 consumer KYC ourselves, or accept wallet/platform/Coinbase verifications as evidence (C8)?
3. **Bureau fee timing and evaluator independence** (C3).
4. **Per-band order limits**, so the sybil target is testable (C1).
5. **Legal memo timing** and whether escrow authority stays with the bureau at P1 (C6).
6. **Taiwan as second market:** card and LINE Pay dominate there and VASP rules apply to stablecoin flows; confirm it is a P3+ question rather than a design input.

## 5. Recommended sequence before delegation

1. Resolve §4 decisions (one working session).
2. Revise `03` formula and bands with worked examples as fixtures (architect, one day).
3. WS0.5 interface control: schemas, ABIs, message JSON, event format, each versioned (architect, two days).
4. Fold fact-check results from the research report into `01`, `02`, `09`.
5. Re-issue spec as v0.2, then delegate WS1 and WS4 first (they own the frozen interfaces), WS2/WS3/WS5 one day later.
