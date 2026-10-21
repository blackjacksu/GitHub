# Review notes — 04 Identity and KYA
- Three-layer model (operator / agent / keys) is the right shape. Keep.
- C5: key rotation and reputation sale are the same on-chain event. Define an authorised-transfer ceremony that preserves score when the same `operatorHash` re-verifies within a grace window; cover EOA → Safe migration.
- C8: accept existing verifications (Coinbase Verifications EAS attestations on Base, wallet/AP2 provider KYC) as tier-1 evidence instead of running consumer KYC. Keep bureau-run KYB for tiers 2–3.
- Tier 3 "software attestation" needs a definition for LLM agents (model id, prompt bundle hash, tool manifest, SDK version) and a statement of what a TEE quote would actually prove.
- `operatorHash = keccak(vendorRef ‖ salt)`: fine; document that unlinkability depends on bureau secrecy of the salt and that GDPR erasure leaves an orphaned hash on chain (confirm with counsel).
- Interop table is good; add Coinbase Verifications and Cloudflare Web Bot Auth once research confirms details.
