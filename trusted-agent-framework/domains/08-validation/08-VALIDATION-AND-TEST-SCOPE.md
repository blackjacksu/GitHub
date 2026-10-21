# 08 — Validation & Test Scope
*Domain: QA / Validator · Audience: validator model (independent of implementers) · Status: v0.1*

## 1. Validator mandate
The validator is a **separate model/agent that has not seen the implementation being produced**. Its job: prove, with evidence, that (1) the chain layer works, (2) the bureau application works, (3) the trust design holds under attack, and (4) the demo tells the story. The validator **does not fix bugs** — it files them with reproduction steps and blocks the phase gate.

For each scope below the validator decides the concrete test cases; this document fixes *what must be covered* and *what "pass" means*.

## 2. Test scopes

### S1 — Chain & contracts
| Scope | Must cover | Pass criteria |
|---|---|---|
| S1.1 Deployment | Contracts deploy on Anvil fork and Base Sepolia; addresses recorded in `deployments.json` | Reproducible from clean clone with one command |
| S1.2 ERC-8004 integration | Register agent → agentId minted, `agentURI` resolves, registration file valid JSON schema; feedback written and readable | 100% of scripted registrations valid (vs. 3–15% in the wild) |
| S1.3 Escrow state machine | Every ERC-8183 transition (create, fund, submit, complete, reject, expire, dispute hooks) incl. unauthorized callers, double-fund, early complete | All invalid transitions revert; invariant: Σ balances conserved |
| S1.4 Stake & slash | Deposit, withdraw cooldown, slash only via ruling, over-slash impossible | Fuzz 10k runs no invariant break |
| S1.5 EAS schemas | 5 schemas registered; resolver rejects non-bureau attesters; revocation works | Verified on Base Sepolia explorer |
| S1.6 Gas & cost | Per-flow gas report | Full purchase ≤ $0.02 at Base Sepolia-equivalent prices |
| S1.7 Static/dynamic analysis | Slither, Aderyn, fuzz, invariants in CI | Zero high/medium findings unresolved |

### S2 — Bureau application
| Scope | Must cover | Pass |
|---|---|---|
| S2.1 Indexer | Backfill + live sync; reorg handling; event→table correctness | Row counts match on-chain after reorg simulation |
| S2.2 Scoring | Deterministic replay of fixtures; versioning; worked examples from `03` match | Byte-identical outputs across 3 runs; examples match spec |
| S2.3 Attestation pipeline | Off-chain attestation signed & verifiable; on-chain on band change; previous revoked | Third-party verify script passes |
| S2.4 KYA | Mock-provider flows for tiers 1–3; expiry; re-KYA on NFT transfer | Transfer → score drops to Provisional within 60s |
| S2.5 Evaluator | Correct complete/reject on evidence fixtures (delivered, not delivered, partial, fraud) | ≥ 95% precision on fixture set; zero auto-release without evidence |
| S2.6 Dispute flow | Open with bond, evidence window, auto-ruling, human path, appeal, execution | Every ruling produces `DisputeOutcome` + correct money movement |
| S2.7 API | OpenAPI conformance; signature enforcement; rate limits; degraded on-chain fallback | Contract tests green; API down → SDK still returns last on-chain score |
| S2.8 Latency | `GET /trust` p95 | < 150 ms (P1), < 100 ms (P3) |

### S3 — Trust design (adversarial)
| Scope | Must cover | Pass |
|---|---|---|
| S3.1 Sybil economics | Run `sim/sybil.ts`: cheapest path to each band | Cost to "Trusted" ≥ 10× band's max single-order limit |
| S3.2 Wash trading | Two KYA-linked agents trade in loops | Volume discounted; cluster flag raised; score gain < 5% of honest equivalent |
| S3.3 Reputation purchase | Buy trusted agent NFT | KYA + score revoked automatically |
| S3.4 Evaluator manipulation | Forged shipping evidence, buyer false claims | Rejected or escalated; bond forfeited for frivolous disputes |
| S3.5 Key compromise drill | Rotate bureau key per runbook | Old attestations revoked, new accepted, no gap > 7 days overlap |
| S3.6 Prompt-injection on agents | Merchant content instructs buyer agent to skip checks | SDK policy still enforces band gate |

### S4 — Protocol & SDK
| Scope | Must cover | Pass |
|---|---|---|
| S4.1 Conformance suite | All ATP messages: valid, malformed, replayed, expired | Suite green for reference impl |
| S4.2 Interop | A2A agent card contains atp fields; x402 payment lands in escrow; EAS attestation verifiable by generic EAS tooling | Verified with third-party tools (easscan, A2A validator) |
| S4.3 MCP server | Each tool with Claude; destructive tools require confirm | Manual transcript + automated harness |
| S4.4 Onboarding | New dev from README to first trust query | ≤ 15 minutes, logged |

### S5 — Security
| Scope | Pass |
|---|---|
| S5.1 Threat-model coverage: each threat in `06` has ≥1 test or documented accepted risk | 100% mapped |
| S5.2 Secrets/PII: no PII on chain, no secrets in repo | Scanners clean |
| S5.3 External audit (P3 gate) | No unresolved high/critical |

### S6 — Demo & story
| Scope | Pass |
|---|---|
| S6.1 `atp demo` end-to-end: register 2 agents → KYA → trust check → order → fund → fulfil → settle → scores change; then bad-merchant path → dispute → refund + slash | Runs unattended in < 5 min; explorer links resolve |
| S6.2 Narrative check | A non-technical viewer can follow the dashboard and explain what the bureau did | Willy sign-off |

## 3. Phase gates
| Gate | Required scopes green |
|---|---|
| P0 → P1 | S1.1–S1.3, S2.2, S6.1 (local) |
| P1 → P2 | all S1, S2.1–S2.7, S3.1–S3.3, S4.1–S4.2, S6 |
| P2 → P3 | everything incl. S3.4–S3.6, S5 |

## 4. Validator deliverables
- `validation/test-plan.md` — concrete cases derived from scopes above.
- Automated suites under `validation/` runnable in CI, separate from implementer tests.
- `validation/report-<phase>.md` with evidence (tx hashes, logs, screenshots) and go/no-go.
