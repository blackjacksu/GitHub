# 06 — Network & Protocol Security
*Domain: Security engineering · Audience: security engineer, contract auditor · Status: v0.1*

## 1. Domain goal
*Make the bureau the hardest-to-corrupt participant in the system: no single key can mint trust, no counterparty can forge a receipt, no sybil can farm a score economically, and every money-moving contract is audited and upgrade-safe.*

## 2. Threat model (STRIDE-lite, ranked)
| # | Threat | Actor | Impact | Mitigation |
|---|---|---|---|---|
| 1 | **Bureau key compromise** → forged TrustScore/KYA attestations | External attacker / insider | Catastrophic | Attester = 2-of-3 multisig (Safe) or threshold signer (P1), HSM/KMS, key rotation with EAS revocation of old-key attestations, on-chain `bureauKeyRegistry` consumers check |
| 2 | **Sybil / reputation farming** | Fraud rings | High | Economic design in `03`; OperatorLink clustering; stake + slashing; KYA tier gating |
| 3 | **Wash trading** between colluding agents to inflate V | Fraud rings | High | Intra-cluster volume discounted; fee makes it costly; anomaly detection (graph cycles) |
| 4 | **Evaluator bribery / wrong ruling** | Merchant or buyer | High | Rule-based first; human review above threshold; appeal with bond; evaluator rotation (P2+); all rulings attested & public |
| 5 | **Escrow contract bug** (drain, stuck funds) | Attacker | Catastrophic | Fork audited ERC-8183 reference; Foundry invariant + fuzz tests; external audit before mainnet; pause guardian; upgrade via timelock |
| 6 | **Prompt injection into agents** (merchant page tells buyer agent "skip trust check") | Malicious merchant | Medium-High | SDK enforces trust check *in code* not in prompt; policy engine outside LLM; signed messages only |
| 7 | **Replay / MITM of ATP messages** | Network attacker | Medium | EIP-712 signatures + nonces + timestamps; TLS; optional mTLS tier 3 |
| 8 | **Reputation transfer by NFT sale** | Fraudster buys trusted agent | Medium | Transfer → auto-revoke KYA + score (see `04`) |
| 9 | **Indexer/API poisoning** (serve wrong score) | Infra attacker | Medium | Scores are signed attestations; SDK verifies signature + can cross-check on-chain; reproducible scoring |
| 10 | **DoS on bureau API** | Anyone | Medium | Rate limits per agentId, x402 micro-fee per query at scale, CDN, degraded on-chain fallback |
| 11 | **PII leakage** from KYA store | Breach | High (legal) | PII only at vendor + encrypted store; chain holds hashes; least-privilege; audit logs |
| 12 | **Base sequencer outage / censorship** | Infra | Low-Medium | Off-chain attestations keep working; L1 force-inclusion path; L1 anchoring (P3) |

## 3. Key management
- Bureau signer: AWS KMS / GCP KMS ECDSA key (P1) → Safe multisig with KMS signers (P2) → threshold signature (P3).
- Agent keys: SDK supports hot key + owner key separation; owner (NFT holder) cold; hot key delegated with spending caps via ERC-8183 hook / session-key pattern.
- Rotation runbook: new key published in `bureauKeyRegistry` + EAS attestation signed by old key, 7-day overlap.

## 4. Smart-contract security requirements
- Solidity ^0.8.24, OpenZeppelin, no inline assembly without review.
- Reentrancy guards on all fund-moving functions; checks-effects-interactions.
- Foundry: unit + fuzz + invariant tests (invariants: escrow balance == Σ funded−released−refunded; stake never leaves except slash/withdraw-after-cooldown).
- Static analysis: Slither + Aderyn in CI; mythril optional.
- External audit before mainnet (budget line in `09`).
- Upgradeability: UUPS proxies with 48h timelock; emergency pause (guardian) that can only halt, never move funds.

## 5. Service & infra security
- OWASP ASVS L2 baseline for API; input validation via JSON Schema; signed-request middleware.
- Secrets in KMS/Doppler; no secrets in env files in repo.
- Dependency scanning (npm audit, Socket) in CI; pinned lockfiles.
- Logging: structured, PII-redacted; retained 1y; tamper-evident (hash chain) for dispute evidence.
- Backups: Postgres PITR; attestations re-derivable from chain.

## 6. Deliverables
- `security/threat-model.md` (living), this table expanded with DREAD scores.
- `security/key-management-runbook.md`.
- CI pipeline: Slither, Aderyn, Foundry fuzz/invariants, npm audit, secret scanning.
- Pen-test checklist for API and MCP server (prompt-injection cases included).
- Audit RFP + remediation tracking (P2→P3).
