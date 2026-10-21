# 03 — Trust Mechanism Design
*Domain: Trust / risk engineering · Audience: trust engineer + smart-contract dev · Status: v0.1*

## 1. Goal for this domain
Produce a **Trust Score** that (a) a merchant agent and a buyer agent will both act on, (b) grows with honest tenure exactly as Willy intends, (c) cannot be farmed cheaply by sybils, and (d) is reproducible by anyone from public data.

**Domain goal statement for the implementer:** *Ship a versioned scoring library, the EAS `TrustScore` attestation pipeline, the dispute state machine, and a sybil-resistance test harness that demonstrates farming a score to band "Trusted" costs more than the economic value it unlocks.*

## 2. Trust Score definition

Score ∈ [0, 1000]. Five bands:

| Band | Range | Meaning | Typical policy |
|---|---|---|---|
| Unverified | 0–149 | Registered, no KYA | Merchants reject or require full prepay |
| Provisional | 150–399 | KYA tier ≥1, little history | Small orders, escrow mandatory |
| Established | 400–649 | ≥ 90 days + verified volume | Normal escrow |
| Trusted | 650–849 | ≥ 1 year, clean disputes, staked | Faster release, higher limits |
| Elite | 850–1000 | Multi-year, high volume, zero upheld disputes | Instant release, credit lines |

### 2.1 Components (v1 formula — tune in P2 with real data)
```
score = clamp( 1000 × ( 0.25·T + 0.30·V + 0.25·D + 0.10·S + 0.10·K ) − P , 0, 1000 )
```
| Symbol | Component | Definition | Note |
|---|---|---|---|
| **T** | Tenure | `min(1, log(1+ activeDays)/log(1+1095))` — saturates at ~3 years | **Counts only days with ≥1 verified tx or valid stake** (not calendar age) |
| **V** | Verified volume | `min(1, log(1+ settledUSDC_12m)/log(1+ 1e6))` | Only ATPEscrow-settled or evaluator-attested tx |
| **D** | Dispute record | `1 − upheldDisputes_12m / max(10, settledTx_12m)` with floor 0 | Upheld = ruled against this agent |
| **S** | Stake | `min(1, stakeUSDC / (0.05 × settledUSDC_12m + 100))` | Skin in the game relative to volume |
| **K** | KYA tier | tier 0→0, 1→0.4, 2→0.8, 3→1.0 | See `04` |
| **P** | Penalties | Active fraud flag −400; expired KYA −150; operator-cluster flag −100 | Time-decaying |

Decay: components use 12-month windows so inactivity slowly lowers V and D confidence; tenure never decays but is gated on activity.

### 2.2 Why tenure alone is not enough (sybil analysis)
Research on ERC-8004 shows ~85–97% of registrations are empty placeholders and that new identities are nearly free. If "time alive = trust," an attacker registers 10,000 agents today and harvests "Trusted" status in a year. Defences baked into the formula:
1. Tenure counts **active** days only — being alive is free, transacting verifiably costs money.
2. Volume counts **escrow-settled** tx only — wash trading between two sybils pays bureau fees and ties up capital, and both sides' operators are KYA-linked (`OperatorLink`), so bureau can discount intra-cluster volume.
3. Stake component rewards real capital at risk; slashing makes a high score a liability if abused.
4. KYA tier 2+ requires a legal entity or verified person — the scarce resource.

**Target property (test in harness):** cost to lift a fresh agent to "Trusted" ≥ 10× the max single-order limit that band unlocks.

### 2.3 Both-sided scoring
Same formula, different policy defaults. Merchants typically care about buyer *non-repudiation* (no false disputes); buyers care about merchant *delivery*. Store direction-specific counters (`disputesAsBuyer`, `disputesAsMerchant`) so a bad buyer doesn't look like a bad merchant.

## 3. Attestation lifecycle
1. Indexer observes new event affecting agentId.
2. Scoring engine recomputes; stores `inputsRoot` = Merkle root of input event hashes.
3. If band changed OR 24h since last on-chain write → on-chain EAS attestation, **revoke previous**. Else → off-chain signed attestation served via API.
4. Consumers verify: EAS signature + attester == bureau key + not revoked + `computedAt` fresh (< 1h for on-chain band reads, < 5 min for API reads).

## 4. Dispute state machine
```
Opened → EvidenceWindow (72h) → AutoRuling (≤ $200) | HumanReview (> $200)
       → Ruled{Buyer|Merchant|Split} → Executed (refund / slash / release) → Closed
                                      ↘ Appeal (once, bonded) → HumanReview
```
- Opening a dispute requires a small bond (e.g., 2% of order) refunded if ruling favours opener — deters frivolous disputes by buyer agents.
- Rulings are EAS `DisputeOutcome` attestations referencing `jobId`; evidence hashes stored, raw evidence encrypted off-chain.
- Evaluator for auto-ruling: rule-based first (tracking shows delivered → merchant; no shipment by deadline → buyer), LLM-assisted summarisation for human reviewers; never LLM-only for money above threshold.

## 5. Validation role (ERC-8004 Validation Registry)
Bureau acts as validator for purchase outcomes: `validationRequest(agentId, requestHash)` by merchant on submit; `validationResponse(..., response=0–100, evidenceURI)` by bureau on completion. This makes our evaluations legible to any ERC-8004-aware third party, not just ATP users.

## 6. Deliverables for this domain
- `packages/scoring` — pure TS library, deterministic, versioned, 100% unit-tested, with fixture replay.
- `contracts/ATPStake.sol`, dispute hooks in `ATPEscrow`.
- EAS schema registration scripts + resolver that enforces attester == bureau.
- Sybil cost simulator (`sim/sybil.ts`) producing the "cost to Trusted" report.
- Scoring spec doc with worked examples (publish publicly — transparency is the product).
