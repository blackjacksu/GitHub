# Review notes — 06 Network and protocol security
- Threat table is a good start. Gaps to add:
  - Evaluator liveness / bureau outage freezing escrows (C4).
  - Synthetic business identities passing KYB; vendor compromise. The "scarce resource" argument rests on vendor quality.
  - Insider threat in human dispute review; require four-eyes above a threshold.
  - Reorg and finality handling for scoring inputs.
  - Metadata leakage from signed trust lookups.
- Threat 6 (prompt injection): the SDK policy only helps agents that use it; the bureau cannot enforce buyer-side policy. The durable defence is that money sits in escrow regardless of what the LLM decides. Say that explicitly.
- Key management: separate keys per role (attester, evaluator, dispute, API signing) from P1; consider EIP-1271 contract signer so attestation verification survives rotation.
- Contract requirements are sound. Add: timelock ≥ max job deadline, pause cannot block `expire()`/refund paths.

## From the landscape research
- R2: replace "ERC-8183 hook / session-key pattern" with an account-layer mechanism (Coinbase `SpendPermissionManager`, MetaMask Delegation Framework v1.3.0, or Zodiac Roles); ERC-7715/7710 are not ready.
- R5: money-transmission and escrow-licensing exposure (FinCEN control test, California internet-escrow licence, Taiwan VASA 2026-06-30) argues for the legal memo at P1.
- R9: cite Unit 42's UCP cart-mandate injection and "Whispers of Wealth" AP2 attack as threat-6 evidence; adopt OWASP Agentic Top 10 (2025-12) and OWASP MCP Top 10 as baselines; pin MCP tool hashes (Snyk Agent Scan lineage).
- R10: ERC-1271 attester identity; Foundry 1.8 `forge lint`; audit budget ~$15–40k plus re-audit rounds (*secondary*).
- Base finality for the indexer: unsafe head can reorg to safe head; safe head reorgs only with L1 (~13 min); forced inclusion via `OptimismPortal.depositTransaction` with a 12h sequencing-window bound.
