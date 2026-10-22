# Review notes — 01b Contracts (WS1)
- No standalone spec. Before delegation, consolidate: contract list, ABIs, events, roles, upgrade policy, fee mechanics.
- Fee: `02` §4 takes the bureau fee on `complete()` only; this pays the evaluator to complete. Charge at `fund()` or on all outcomes (C3).
- Liveness: add buyer-confirm auto-release and timeout release when evidence was submitted and no dispute opened (C4).
- Verify how the ERC-8183 reference assigns `jobId` before adopting `keccak(buyer, merchant, nonce)` (`05` §2).
- Upgradeability: UUPS + 48h timelock on a contract holding user funds; consider immutable versions with migration, or a timelock longer than the max job deadline.
- `OperatorLink` with an array field forces revoke-and-reissue on every change; prefer one attestation per (operator, agent).

## From the landscape research
- ERC-8183 reference code has documented prose/code discrepancies, no listed deployments or audits, and an open issue reporting a UUPS storage collision that locked funds in a fork. Fork with a full independent review, not as a trusted base.
- ERC-8183 has no delegation or session-key mechanism (R2). Spending caps go in the agent account: Coinbase `SpendPermissionManager` or MetaMask Delegation Framework on Base.
- EAS resolvers run only for on-chain attestations; off-chain revocation is `revokeOffchain(uid)` checked via `getRevokeOffchain(attester, uid)`.
- Consider an ERC-1271 contract signer (Safe) as the attester identity so KMS keys rotate without re-issuing attestations (R10).
