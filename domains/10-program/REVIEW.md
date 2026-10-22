# Review notes — 10 Workstreams and delegation
- Add **WS0.5 interface control** (schemas, ABIs, message JSON, event format) before WS1–WS5 (C2).
- WS2 is blocked on WS5 (indexer) yet P0 wants scoring v0 in weeks 1–2; break the dependency by making scoring a pure function over an event array.
- Add owners for legal/compliance and data-protection even if the owner is Willy plus counsel.
- Delegation template: add the list of directories the implementer may touch, the exact test commands, and the ADR process for interface changes.
- Status board: fine. Consider tracking it in GitHub issues or a project board rather than a markdown table once more than one agent is active.

## From the landscape research
- Add a WS1 task: independent review of the ERC-8183 fork before any funds path is built.
- Add a WS3 task: evaluate Coinbase Verifications, Sumsub KYA, Trulioo and Skyfire as tier-1/2 evidence providers behind `IKycProvider`.
- Add a WS2 task: evaluate Kleros v2 Agentic Commerce Court as the appeal layer.
