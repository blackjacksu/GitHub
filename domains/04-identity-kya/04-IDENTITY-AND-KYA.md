# 04 — Identity & Know-Your-Agent (KYA)
*Domain: Identity / compliance engineering · Audience: identity engineer, compliance advisor · Status: v0.1*

## 1. Domain goal
*Give every agent a persistent, portable identity (ERC-8004 agentId on Base) bound to an accountable operator, with tiered KYA that is cheap at the bottom and strong at the top, and that interoperates with the IDs card networks and other ecosystems already issue.*

## 2. Identity model — three layers
| Layer | Object | Where | Who controls |
|---|---|---|---|
| **Operator** | Legal person/entity (merchant business, consumer) | Off-chain KYC/KYB record; on-chain only as `operatorHash` + `OperatorLink` attestation | Bureau |
| **Agent** | ERC-8004 agentId (ERC-721 token) + registration file | Base | Operator's wallet (owner of the NFT) |
| **Session / wallet keys** | Hot wallet(s) the agent signs x402 payments with; AP2 mandates | Agent runtime | Agent (delegated, scoped) |

Rule: trust attaches to the **agentId**, accountability attaches to the **operator**, authority is scoped by **keys/policies**. Rotating a key must not reset trust; changing operator (NFT transfer) **does** reset score to Provisional and requires re-KYA (prevents buying a reputation).

## 3. KYA tiers
| Tier | Who | Checks | Output |
|---|---|---|---|
| 0 | Anyone | Register on ERC-8004, valid registration file, reachable endpoint | No attestation; score band Unverified |
| 1 | Consumers / hobby merchants | Email + phone + wallet-ownership proof (SIWE) + liveness-lite; optional Visa TAP / AP2 ID link | `KYA` attestation tier 1, 12-month expiry |
| 2 | Businesses | KYB: legal entity, UBO, sanctions/OFAC screening, domain control proof (DNS TXT), bank/payout account verified by vendor | `KYA` tier 2, 12-month expiry |
| 3 | High-volume / regulated | Tier 2 + signed operator agreement, software attestation (code hash or TEE quote of agent runtime), spending-policy registration | `KYA` tier 3, 6-month expiry |

Vendor abstraction: `IKycProvider { startSession, getResult }` so Persona / Sumsub / Onfido can be swapped; P0/P1 uses a **mock provider**.

## 4. Operator binding ceremony
1. Operator connects wallet (owner of agentId NFT) → SIWE signature.
2. Operator completes vendor KYC/KYB → bureau receives verdict + reference.
3. Bureau computes `operatorHash = keccak(vendorRef ‖ salt)`; stores salt privately.
4. Bureau attests `KYA(agentId, tier, operatorHash, …)` and updates `OperatorLink` to include agentId.
5. Agent's registration file is updated with `operator.attestationUID`; agent re-signs and republishes.

Privacy: no PII on chain; `operatorHash` is unlinkable without bureau's salt; GDPR deletion = revoke attestation + delete off-chain record (hash becomes orphan).

## 5. Interoperability map
| External system | How we link |
|---|---|
| Visa Trusted Agent Protocol | Store Visa agent identity cert fingerprint in `externalIds.visaTAP`; bureau can verify TAP signature on inbound HTTP |
| Mastercard Agent Pay | Store agentic-token reference |
| Google AP2 / A2A agent card | Include `atp.agentId` and bureau attestation URL in the A2A agent card `extensions` |
| ENS (ENSIP-25) | Optional human-readable name → agentId |
| Hedera HCS-14 UAID | Store `uaid` for cross-ecosystem discovery |
| W3C DID | Expose `did:pkh:eip155:8453:<ownerAddress>` and `did:web:bureau…/agents/<id>` resolvers |

## 6. Deliverables
- `packages/identity`: register agent, build/sign registration file, pin to IPFS, update `agentURI`.
- KYA service with mock provider + provider interface; admin UI for tier upgrades.
- EAS `KYA` + `OperatorLink` schemas, resolver forbidding self-attestation.
- Re-KYA-on-transfer: indexer watches `Transfer` events on Identity Registry → auto-revoke `KYA` + `TrustScore`.
- Compliance memo (P2): which tier triggers money-transmission / data-protection obligations in the US and Taiwan (Willy's two markets).
