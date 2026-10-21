# Review notes — 02 Architecture
- Component split (on-chain primitives, off-chain bureau, client SDK/MCP) is right. Keep.
- §4 step 5 fee-on-complete creates an evaluator conflict (C3). Separate evaluator, attester, and dispute keys from P1.
- §5 "any third party can recompute a score" holds only for T, V, D, S (C3). State the reproducible subset.
- Availability 99.9% is a business target; funds safety must not depend on bureau uptime (C4).
- Data model: define what `software.codeHash` hashes for an LLM agent; `operator.kyaTier` duplicates attestation content and will drift; prefer resolving tier from the attestation UID.
- F9: confirm the Reputation Registry lets the bureau write feedback without the rated agent's authorisation; otherwise negative feedback can be refused.
- Open question §7 on evaluator set: recommend single bureau key at P0–P1 but with role-separated keys so the P2 move to a 3-of-5 set is a configuration change.
