# Review notes — 07 Agent tooling
- Deliverable set is right but too wide for P0/P1 (C10). Suggested P0: SDK core + script-driven `atp demo` + one-page explorer; P1: MCP server, indexer, LLM demo agents; P2: CLI polish, `create-atp-agent`, Python.
- Monorepo tooling unspecified (pnpm + turborepo or similar); specify so implementers do not each pick one.
- Make `packages/scoring` take an event array so it does not depend on the indexer; the demo can feed events from a script.
- MCP server: `confirm: true` on destructive tools is good; also return the policy decision and reason so the agent cannot silently skip the trust check.
- Repo layout §4 is good; adopt it when implementation starts (this repo's `domains/` folder maps to `docs/`).

## From the landscape research
- Coinbase AgentKit's README states it enforces no spend caps, allowlists or human approval; the SDK must layer `SpendPermissionManager` or equivalent itself.
- MCP spec 2026-07-28 deprecates dynamic client registration (RFC 7591) in favour of Client ID Metadata Documents; the MCP registry is still preview and unsigned. Pin tool definitions by hash.
