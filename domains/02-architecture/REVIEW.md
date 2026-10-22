# Review notes — 02 Architecture
- Component split (on-chain primitives, off-chain bureau, client SDK/MCP) is right. Keep.
- §4 step 5 fee-on-complete creates an evaluator conflict (C3). Separate evaluator, attester, and dispute keys from P1.
- §5 "any third party can recompute a score" holds only for T, V, D, S (C3). State the reproducible subset.
- Availability 99.9% is a business target; funds safety must not depend on bureau uptime (C4).
- Data model: define what `software.codeHash` hashes for an LLM agent; `operator.kyaTier` duplicates attestation content and will drift; prefer resolving tier from the attestation UID.
- F9: confirm the Reputation Registry lets the bureau write feedback without the rated agent's authorisation; otherwise negative feedback can be refused.
- Open question §7 on evaluator set: recommend single bureau key at P0–P1 but with role-separated keys so the P2 move to a 3-of-5 set is a configuration change.

## From the landscape research
- F9 confirmed: the bureau can write ERC-8004 feedback freely; only self-rating is blocked. Verify `feedbackAuth`/`getSummary` details from the spec before WS1.
- Terminology: AP2 v0.2 uses Checkout/Payment mandates; A2A card path is `/.well-known/agent-card.json`; x402 v2 header names (R8).
- Competitive context (R1): a dozen thin ERC-8004 reputation oracles already exist on Base. The defensible position is escrow-grounded outcomes plus operator accountability, not "a score".
