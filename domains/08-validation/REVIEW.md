# Review notes — 08 Validation and test scope
- Validator independence and "files bugs, does not fix" are the right mandate. Keep.
- S3.1 cannot pass or fail until per-band order limits exist (C1).
- S2.5 "≥ 95% precision on fixture set" needs a fixture set owner and size; add recall as well, since false rejects hurt merchants.
- S2.8 latency: state whether signature verification is included.
- Add scopes for: bureau-down liveness paths (C4), authorised transfer vs reputation sale (C5), off-chain attestation revocation, reorg replay.
- Phase gates are reasonable.

## From the landscape research
- Add fixtures from documented attacks (Unit 42 UCP cart injection, AP2 ranking hijack) to S3.6.
- Add a scope for ERC-8183 fork review (known prose/code discrepancies, UUPS storage layout) to S1.3.
- S4.2 interop: verify off-chain attestations against the deployed EAS v1.0.1 domain, not the 1.4.0 source.
