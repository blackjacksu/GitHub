# 10 — Workstreams, Goals & Delegation Plan
*Domain: Program management · Audience: Willy + delegating model · Status: v0.1*

## 1. Workstreams (one implementer model each; architect reviews all)

| WS | Domain | Goal (definition of done for the stream) | Primary docs | Depends on |
|---|---|---|---|---|
| **WS0** Blockchain exploration | Architect (Claude) | Chain chosen (Base), demo stack fixed, deployment addresses for ERC-8004 + EAS on Base Sepolia confirmed, Anvil-fork script working | `01` | — |
| **WS1** Contracts & chain | Smart-contract dev | `ATPValidation`, `ATPEscrow` (ERC-8183 fork + KYA hook), `ATPStake`, 5 EAS schemas deployed on Anvil-fork and Base Sepolia with ≥ 90% test coverage | `02`, `03`, `06` | WS0 |
| **WS2** Trust mechanism | Trust/risk engineer | `packages/scoring` deterministic library + attestation pipeline + dispute state machine + sybil simulator report meeting the 10× cost property | `03` | WS1 (schemas), WS5 (indexer) |
| **WS3** Identity & KYA | Identity engineer | Registration helpers, KYA service with mock + real provider interface, operator binding ceremony, re-KYA-on-transfer | `04` | WS1 |
| **WS4** Communication protocol | Protocol/backend engineer | Normative `spec/atp-protocol.md`, `packages/protocol`, bureau API (trust, orders, evidence, webhooks), conformance suite | `05` | WS1 |
| **WS5** Agent tooling & infra | DX engineer | Indexer, `@atp/sdk`, `@atp/mcp-server`, CLI incl. `atp demo`, explorer dashboard, demo buyer/merchant agents | `07` | WS1, WS4 |
| **WS6** Network security | Security engineer | Threat model complete, key runbook, CI security gates, pen-test checklist, audit RFP | `06` | all (continuous) |
| **WS7** Validation | **Independent validator model** | Test plan from scopes in `08`, automated validation suites, phase-gate reports | `08` | all |
| **WS8** Business | Willy (+ Claude support) | Proposal finalized, 3 design partners, pitch deck, legal memo scoped | `09` | P1 demo |

## 2. Phase plan with task breakdown

### P0 — Local demo (weeks 1–2)
- WS0: Anvil fork of Base Sepolia; verify ERC-8004 Identity/Reputation + EAS addresses; faucet scripts. ✅ decision already made in `01`.
- WS1: Deploy `ATPEscrow` (minimal: create/fund/submit/complete/reject/expire), `ATPValidation` stub, register `KYA` + `TrustScore` + `TxReceipt` schemas.
- WS2: Scoring v0 (T, V, D, K only), off-chain attestation signing.
- WS3: Register 2 agents, mock KYA tier 1 & 2.
- WS4: Minimal API: `GET /trust`, `POST /evidence`; EIP-712 signing.
- WS5: `atp demo` script: two scripted (non-LLM) agents complete one purchase; console output shows scores before/after.
- WS7: Gate P0→P1 (S1.1–S1.3, S2.2, S6.1).

### P1 — Testnet demo (weeks 3–5)
- WS1: Base Sepolia deployment, `ATPStake`, remaining schemas, fuzz/invariants.
- WS2: Full formula, on-chain attestation on band change, dispute auto-ruling path.
- WS3: Operator binding ceremony, provider interface, re-KYA on transfer.
- WS4: Full order lifecycle messages, webhooks, conformance suite v1.
- WS5: Indexer, SDK v0.1, MCP server, explorer v0, LLM-based demo agents incl. bad-merchant mode, x402 testnet funding.
- WS6: Threat model v1, KMS signer, CI gates.
- WS7: Gate P1→P2.
- WS8: Public demo video + first partner conversations.

### P2 — Pilot (weeks 6–12)
- WS1: Audit prep, timelock/UUPS, pause guardian.
- WS2: Score calibration on pilot data; human dispute review tooling; appeal flow.
- WS3: Real KYC/KYB vendor; compliance memo (US + Taiwan).
- WS4: Batch trust API, rate limiting, x402-metered queries.
- WS5: Python SDK, `create-atp-agent`, docs site; 3–5 real merchant agents integrated.
- WS6: Pen test; audit RFP issued.
- WS7: Gate P2→P3 incl. adversarial scopes.
- WS8: Design-partner case studies; pre-seed.

### P3 — Mainnet (week 13+)
- Base mainnet deployment post-audit; multisig/threshold bureau key; L1 checkpoint anchoring; pricing live; x402 Foundation application; evaluator-set decentralization design.

## 3. Delegation template (paste into each implementer's brief)
```
ROLE: <WS name> implementer for AgentBureau.
READ FIRST: docs/00-OVERVIEW.md, docs/02-ARCHITECTURE-SPEC.md, docs/<your domain doc>.md
GOAL: <copy the "Goal" cell from §1>
CONSTRAINTS: Stack in 02 §6 is binding. No new chains, no new token. Pointers on chain, payloads off chain.
             Do not change EAS schema fields or ATP message formats without architect approval.
INTERFACES YOU DEPEND ON: <list from §1 "Depends on" with repo paths>
DELIVERABLES: <from your domain doc "Deliverables" section>
DONE WHEN: validator scopes <S-ids> are green and architect has reviewed PR.
REPORT BACK: PR link, test output, open questions as a numbered list.
```

## 4. Architect review cadence
- Daily: PR review for interface changes (schemas, protocol messages, contract ABIs).
- Weekly: integration run of `atp demo` on latest main; update this doc's status column.
- Phase end: validator report → go/no-go → update `00-OVERVIEW.md` phase table.

## 5. Status board (update as work lands)
| WS | Status | Owner model | Next milestone |
|---|---|---|---|
| WS0 | ✅ Done (2026-10-21) | Claude | — |
| WS1 | ⬜ Not started | — | P0 contracts on Anvil fork |
| WS2 | ⬜ | — | Scoring v0 |
| WS3 | ⬜ | — | Mock KYA |
| WS4 | ⬜ | — | `GET /trust` |
| WS5 | ⬜ | — | `atp demo` |
| WS6 | ⬜ | — | Threat model v0 |
| WS7 | ⬜ | — | P0 gate |
| WS8 | ⬜ | Willy | Partner list |
