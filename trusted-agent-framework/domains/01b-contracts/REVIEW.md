# Review notes — 01b Contracts (WS1)
- No standalone spec. Before delegation, consolidate: contract list, ABIs, events, roles, upgrade policy, fee mechanics.
- Fee: `02` §4 takes the bureau fee on `complete()` only; this pays the evaluator to complete. Charge at `fund()` or on all outcomes (C3).
- Liveness: add buyer-confirm auto-release and timeout release when evidence was submitted and no dispute opened (C4).
- Verify how the ERC-8183 reference assigns `jobId` before adopting `keccak(buyer, merchant, nonce)` (`05` §2).
- Upgradeability: UUPS + 48h timelock on a contract holding user funds; consider immutable versions with migration, or a timelock longer than the max job deadline.
- `OperatorLink` with an array field forces revoke-and-reissue on every change; prefer one attestation per (operator, agent).
