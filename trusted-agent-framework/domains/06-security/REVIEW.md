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
