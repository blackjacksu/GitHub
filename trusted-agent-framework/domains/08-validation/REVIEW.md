# Review notes — 08 Validation and test scope
- Validator independence and "files bugs, does not fix" are the right mandate. Keep.
- S3.1 cannot pass or fail until per-band order limits exist (C1).
- S2.5 "≥ 95% precision on fixture set" needs a fixture set owner and size; add recall as well, since false rejects hurt merchants.
- S2.8 latency: state whether signature verification is included.
- Add scopes for: bureau-down liveness paths (C4), authorised transfer vs reputation sale (C5), off-chain attestation revocation, reorg replay.
- Phase gates are reasonable.
