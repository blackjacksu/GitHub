# Review notes — 05 Communication protocol
- Design rules are right; the message catalogue contradicts "reuse, don't invent" (C9). Define ATP as an A2A extension carried in A2A messages and the agent card; keep bespoke HTTP only for the bureau API.
- Signed trust lookups leak who checks whom; decide per tier.
- Degraded mode falls back to the last on-chain `TrustScore`, which may be up to 24h stale by design; state the staleness bound and have the SDK surface it.
- Replay protection via a bureau-side nonce registry is stateful; document nonce format (monotonic per agentId vs random with expiry window).
- Webhook authentication and retry semantics are unspecified.
- Deliverable: JSON Schemas for every message are the WS0.5 interface freeze; produce them before WS4 starts (C2).
