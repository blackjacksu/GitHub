# 02 — High-Level Architecture Specification
*Domain: System architecture · Audience: all implementers · Status: v0.1 for delegation*

## 1. System context

```
┌──────────────────┐    ATP (trust query / receipts)    ┌──────────────────┐
│  BUYER'S AGENT   │◄──────────────────────────────────►│ MERCHANT'S AGENT │
│  (consumer side) │                                    │  (seller side)   │
└───────┬──────────┘                                    └─────────┬────────┘
        │  A2A / AP2 negotiation,  x402 payment                   │
        └─────────────────────┬──────────────────────────────────┘
                              ▼
                 ┌────────────────────────────┐
                 │   AGENTBUREAU (off-chain)  │  ← our service
                 │  KYA · Scoring · Evaluator │
                 │  Disputes · Indexer · API  │
                 └──────┬──────────────┬──────┘
                        │ writes       │ reads
                        ▼              ▼
   ┌──────────────────────────────────────────────────────────┐
   │              BASE (L2)  — settlement & attestation        │
   │  ERC-8004 Identity · ERC-8004 Reputation · ATP Validation │
   │  ERC-8183 Escrow · EAS (schemas + attestations) · USDC    │
   └──────────────────────────────────────────────────────────┘
                        │ periodic Merkle checkpoint (P3)
                        ▼
                  Ethereum L1 (anchor)
```

## 2. Components

### 2.1 On-chain (Base)
| Component | Source | Our responsibility |
|---|---|---|
| **Identity Registry** | ERC-8004 singleton (existing) | Use as-is. agentId (uint256) = primary key everywhere. |
| **Reputation Registry** | ERC-8004 singleton (existing) | Use as-is; bureau writes feedback as an *authorized client* after each settled purchase. |
| **ATPValidation** | Ours, implements ERC-8004 Validation Registry interface | Records bureau validation results (`validationRequest`/`validationResponse`) with evidence hash. |
| **ATPEscrow** | Fork of ERC-8183 reference | Job = purchase. Client = buyer agent, Provider = merchant agent, Evaluator = bureau (or bureau-approved evaluator set). Hooks: KYA gate `beforeAction` (both parties must hold a valid KYA attestation ≥ required tier). |
| **ATPStake** | Ours | Optional USDC stake per agentId; slashable on upheld dispute. Stake amount feeds Trust Score. |
| **EAS Schemas** | EAS (existing) | We register 5 schemas: `KYA`, `TrustScore`, `TxReceipt`, `DisputeOutcome`, `OperatorLink`. Bureau is the attester; `TrustScore` is revocable. |

### 2.2 Off-chain (AgentBureau service)
| Module | Function |
|---|---|
| **KYA Service** | Onboards operators (KYB for merchants, lightweight KYC for consumers), binds operator → agentId, issues `KYA` attestation with tier. Integrates a KYC vendor (e.g., Persona/Sumsub) behind an interface. |
| **Scoring Engine** | Deterministic function over indexed events → Trust Score 0–1000 + risk flags. Versioned (`scoreVersion`). Publishes `TrustScore` attestation (off-chain by default, on-chain on material change). |
| **Evaluator** | Verifies delivery evidence (merchant receipt, carrier tracking, buyer confirmation, or timeout rules) and calls `complete()` / `reject()` on ATPEscrow; writes `TxReceipt` attestation and ERC-8004 feedback. |
| **Dispute Bureau** | Case intake, evidence collection, automated adjudication ≤ threshold, human analyst above; emits `DisputeOutcome`; triggers slash/refund. |
| **Indexer** | Ponder/Envio pipeline over Base events (registries, escrow, EAS) → Postgres read model. |
| **ATP API** | REST + MCP server: `getTrust(agentId)`, `verifyAttestation`, `openDispute`, webhooks. |
| **Dashboard** | Explorer for agents, scores, transactions, disputes. |

### 2.3 Client side
- **ATP SDK (TypeScript, later Python):** wraps registration, KYA submission, trust lookup, escrow lifecycle, x402 payment, receipt verification.
- **MCP server** so any Claude/GPT-based agent can call `atp.check_counterparty`, `atp.create_order`, etc.

## 3. Core data model

### Agent Passport (ERC-8004 registration file, extended)
```json
{
  "agentId": 847205,
  "chainId": 84532,
  "name": "acme-store-agent",
  "operator": { "did": "did:pkh:eip155:84532:0xOp...", "kyaTier": 2, "attestationUID": "0x..." },
  "endpoints": { "a2a": "https://...", "mcp": "https://...", "x402": "https://..." },
  "software": { "model": "claude-fable-5-1", "framework": "atp-sdk@0.1", "codeHash": "0x..." },
  "wallets": [ "0xAgentWallet" ],
  "policies": { "maxOrderUSDC": 500, "allowedCategories": ["retail"] },
  "externalIds": { "visaTAP": "...", "mastercardAgentPay": "...", "hcs14": "uaid:..." }
}
```
*Payload stored off-chain (IPFS/HTTPS), hash on chain via `agentURI`.*

### EAS schemas (field sketch)
- **KYA**: `uint256 agentId, uint8 tier, bytes32 operatorHash, uint64 verifiedAt, uint64 expiresAt, string vendorRef`
- **TrustScore**: `uint256 agentId, uint16 score, uint8 band, uint32 scoreVersion, bytes32 inputsRoot, uint64 computedAt` (revocable)
- **TxReceipt**: `uint256 buyerAgentId, uint256 merchantAgentId, bytes32 jobId, uint256 amountUSDC, uint8 outcome, bytes32 evidenceHash`
- **DisputeOutcome**: `bytes32 jobId, uint8 ruling, uint256 refundUSDC, uint256 slashUSDC, bytes32 reasonHash`
- **OperatorLink**: `bytes32 operatorHash, uint256[] agentIds` (one operator → many agents; sybil cluster key)

## 4. Primary flow — escrowed purchase (happy path)
1. Buyer agent calls `atp.getTrust(merchantAgentId)` → bureau returns signed `TrustScore` + KYA tier. Buyer policy decides (e.g., require score ≥ 600 for orders > $50).
2. Merchant agent symmetrically checks buyer (`score ≥ 300`, KYA tier ≥ 1).
3. Buyer agent `createJob(merchantAgentId, budget, evaluator=bureau, deadline)` on ATPEscrow; `fund()` with USDC (x402 header carries the payment authorization; facilitator settles into escrow).
4. Merchant agent fulfils; `submit(jobId, evidenceHash)` (order confirmation + shipping proof).
5. Bureau evaluator verifies evidence (or buyer confirms) → `complete(jobId, attestationUID)`; escrow releases to merchant minus bureau fee.
6. Bureau writes `TxReceipt` attestation, ERC-8004 feedback for both agents, and recomputes both Trust Scores.

Unhappy paths: `reject` (evidence fails) → refund; timeout → `expire` → refund; post-completion complaint → Dispute Bureau (see `03`).

## 5. Non-functional requirements
| Attribute | Target (P1 demo → P3 mainnet) |
|---|---|
| Trust lookup latency | < 150 ms p95 (served from index + cached attestation) |
| Score recompute | < 60 s after on-chain event finality |
| Availability | 99.9% (P3) |
| Cost per settled purchase | < $0.02 on-chain + bureau fee |
| Auditability | Any third party can recompute a score from public events + published `scoreVersion` algorithm |

## 6. Technology stack (binding for implementers)
- Contracts: Solidity ^0.8.24, Foundry, OpenZeppelin 5.x, EAS resolver contracts where needed.
- Service: TypeScript/Node 20, Fastify, Postgres 16, viem, EAS SDK, Ponder (indexer), Redis (cache).
- Agents/demo: TypeScript, Anthropic SDK, MCP; x402 client (`x402-fetch` / Coinbase facilitator).
- Infra: Docker Compose for P0/P1; Vercel/Fly for API; Supabase acceptable for Postgres.

## 7. Open design questions (architect to decide by P1 end)
- Evaluator set: single bureau key (P0–P1) → 3-of-5 bureau-approved evaluators (P2) → staked permissionless evaluators (P3+)?
- Score publication cadence: on every tx vs. batched hourly on-chain? (Default: off-chain always, on-chain on band change.)
- Fiat (AP2/card) orders: bureau can only attest to *outcome*, not escrow; treat as lower-weight events.
