# Review notes — 04 Identity and KYA
- Three-layer model (operator / agent / keys) is the right shape. Keep.
- C5: key rotation and reputation sale are the same on-chain event. Define an authorised-transfer ceremony that preserves score when the same `operatorHash` re-verifies within a grace window; cover EOA → Safe migration.
- C8: accept existing verifications (Coinbase Verifications EAS attestations on Base, wallet/AP2 provider KYC) as tier-1 evidence instead of running consumer KYC. Keep bureau-run KYB for tiers 2–3.
- Tier 3 "software attestation" needs a definition for LLM agents (model id, prompt bundle hash, tool manifest, SDK version) and a statement of what a TEE quote would actually prove.
- `operatorHash = keccak(vendorRef ‖ salt)`: fine; document that unlinkability depends on bureau secrecy of the salt and that GDPR erasure leaves an orphaned hash on chain (confirm with counsel).
- Interop table is good; add Coinbase Verifications and Cloudflare Web Bot Auth once research confirms details.

## From the landscape research
- R6: EDPB draft guidance treats hashes of personal data as personal data; do not rely on the "orphaned hash" argument for `operatorHash`.
- R7: tier-3 software attestation recipe is TEE-derived key → address in `report_data` → DCAP verification → registered against agentId. Define tier 3 as that; a signed SBOM (model id, prompt bundle hash, tool manifest) is a realistic non-TEE tier 2.5.
- F12: Firmata/DYOE not found. The real KYA field is Skyfire, Sumsub KYA Module (2026-10-19), Trulioo Digital Agent Passport, Concordium CIS-8004, Catena ACK-ID, plus the Visa/Mastercard/Ant cross-network KYA framework (Sept 2026). Several are candidate tier-1/2 evidence providers rather than competitors.
- ERC-8004 transfer only clears `agentWallet`; reputation stays with the token. "Reputation laundering" via sale is discussed in the community with no spec-level answer, so C5's authorised-transfer ceremony is our responsibility.
