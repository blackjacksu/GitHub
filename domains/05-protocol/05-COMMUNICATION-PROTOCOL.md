# 05 — ATP Communication Protocol
*Domain: Protocol / backend engineering · Audience: protocol engineer · Status: v0.1*

## 1. Domain goal
*Define and implement the wire protocol by which a buyer agent, a merchant agent, and the bureau exchange trust proofs, orders, payments and receipts — reusing A2A, x402 and EAS formats so that any agent framework can join with one SDK call.*

## 2. Design rules
- **Transport:** HTTPS + JSON; all requests are signed (EIP-712 typed data) by the agent's wallet key; bureau responses are signed by the bureau key. mTLS optional at tier 3.
- **Reuse, don't invent:** discovery = A2A agent card; payment = x402 (`402` challenge → `X-PAYMENT` header); claims = EAS attestations (on- or off-chain JSON); escrow = ERC-8183 calls.
- **Every message carries** `atpVersion`, `chainId`, sender `agentId`, `nonce`, `timestamp`, `signature`.
- **Idempotency:** `jobId` = keccak(buyerAgentId, merchantAgentId, buyerNonce).

## 3. Message catalogue

### 3.1 Discovery & handshake
| Msg | Direction | Purpose |
|---|---|---|
| `GET /.well-known/agent.json` | any → agent | A2A agent card incl. `atp.agentId`, endpoints, KYA attestation URL |
| `ATP_HELLO` | buyer → merchant | Introduce: agentId, capabilities, requested trust band |
| `ATP_HELLO_ACK` | merchant → buyer | Accept + merchant's own agentId + required buyer band |
Both parties then call the bureau independently (never trust a counterparty's self-reported score).

### 3.2 Trust query (bureau API)
```
GET /v1/trust/{agentId}?minFresh=300
→ 200 { score, band, kyaTier, attestation: {uid|offchainJSON, signature}, flags[], computedAt, scoreVersion }
```
- SDK verifies signature locally; caches by `computedAt`.
- `POST /v1/trust/batch` for marketplaces.
- Webhook `trust.changed` for subscribed agentIds.

### 3.3 Order lifecycle (mirrors ERC-8183 states)
| Step | On-chain call | Off-chain message |
|---|---|---|
| Quote | — | `ATP_QUOTE` (merchant → buyer): items, price USDC, deadline, evaluator=bureau, policy hash |
| Create | `createJob(provider, evaluator, budget, deadline, expiry)` by buyer | `ATP_ORDER_CREATED` with txHash |
| Fund | `fund(jobId)` — USDC pulled into escrow; x402 facilitator can perform this on buyer's behalf after `402` challenge | `ATP_FUNDED` |
| Fulfil | `submit(jobId, evidenceHash)` by merchant | `ATP_SUBMITTED` + evidence bundle to bureau (`POST /v1/evidence`) |
| Confirm | — | `ATP_BUYER_CONFIRM` (optional; speeds evaluation) |
| Evaluate | `complete(jobId, attestationUID)` / `reject(jobId, reason)` by bureau | `ATP_SETTLED` to both parties with `TxReceipt` attestation |
| Dispute | handled by Dispute Bureau; `ATPEscrow` hook for post-completion clawback from stake | `ATP_DISPUTE_OPENED/RULED` |

### 3.4 Receipts
`TxReceipt` EAS attestation (off-chain JSON, optionally on-chain) is the canonical receipt. Both agents store it; either can present it to a third party who verifies bureau signature + on-chain job state.

## 4. Sequence (happy path)
```
Buyer                Bureau                 Merchant              Base
  │ GET trust(M) ─────►│                        │                   │
  │◄── score+attest ───│                        │                   │
  │                    │◄──── GET trust(B) ─────│                   │
  │                    │───── score+attest ────►│                   │
  │ ATP_HELLO ────────────────────────────────►│                   │
  │◄──────────────────────────── ATP_QUOTE ────│                   │
  │ createJob+fund ───────────────────────────────────────────────►│
  │ ATP_FUNDED ───────────────────────────────►│                   │
  │                                            │ submit(evidence) ─►│
  │                    │◄── POST /evidence ─────│                   │
  │                    │ verify… complete(jobId) ──────────────────►│
  │◄── ATP_SETTLED ────│──── ATP_SETTLED ──────►│                   │
```

## 5. Error & edge handling
- Stale score (`computedAt` older than policy) → SDK refetches; if bureau unreachable, fall back to **last on-chain** `TrustScore` attestation read directly from Base (degraded mode, flag `source=onchain`).
- Counterparty below band → `ATP_DECLINE {reason: "band", required, actual}`.
- Replay → nonce registry per agentId in bureau; on-chain nonces for escrow.
- Deadline passed, no submit → anyone may call `expire(jobId)`; SDK auto-calls.

## 6. Deliverables
- `spec/atp-protocol.md` (normative, with JSON Schemas for every message).
- `packages/protocol`: TS types, EIP-712 domain, signer/verifier, message builders.
- Bureau API (Fastify) implementing §3.2–3.4 + OpenAPI doc.
- Conformance test suite (`conformance/`) that a third-party agent can run against itself.
