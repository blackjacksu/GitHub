# 07 — Agent Infrastructure & Tooling
*Domain: Developer experience / agent infrastructure · Audience: DX engineer · Status: v0.1*

## 1. Domain goal
*Make joining the trusted layer a five-minute job for any agent builder: one SDK, one MCP server, one CLI, one dashboard — so that the bureau's value compounds through adoption, not through our own sales calls.*

## 2. Deliverable set

### 2.1 `@atp/sdk` (TypeScript first; Python P2)
```ts
const atp = new ATP({ chain: baseSepolia, wallet, bureauUrl });
await atp.identity.register({ name, endpoints, software });     // ERC-8004 mint + file pin
await atp.kya.start({ tier: 2 });                                // returns vendor session URL
const t = await atp.trust.get(merchantAgentId);                  // verified attestation
if (t.band >= "Established") {
  const job = await atp.orders.create({ merchantAgentId, budgetUSDC: 120, deadline });
  await atp.orders.fund(job.id);                                 // x402 → escrow
}
atp.orders.on("settled", receipt => store(receipt));
```
Design: pure functions over viem; no hidden LLM calls; policy engine (`atp.policy`) evaluates trust requirements deterministically.

### 2.2 `@atp/mcp-server`
Tools exposed to any MCP-capable agent (Claude, Cursor, etc.):
`atp_check_counterparty`, `atp_create_order`, `atp_fund_order`, `atp_submit_fulfilment`, `atp_confirm_receipt`, `atp_open_dispute`, `atp_my_score`.
Each tool returns structured JSON + a human-readable summary; destructive tools require an explicit `confirm: true`.

### 2.3 `atp` CLI
`atp init`, `atp register`, `atp kya`, `atp trust <id>`, `atp order create|fund|submit|complete`, `atp dispute open`, `atp demo` (spins up Anvil fork + two agents + bureau and runs the full flow).

### 2.4 Bureau service (reference implementation)
- Monorepo `apps/bureau`: API, scoring worker, evaluator worker, dispute admin UI.
- `docker compose up` brings up Anvil-fork, Postgres, indexer, bureau, dashboard.

### 2.5 Indexer
Ponder (or Envio) config indexing: ERC-8004 Identity/Reputation events, ATPValidation, ATPEscrow, ATPStake, EAS `Attested/Revoked` for our schema UIDs. Outputs GraphQL + Postgres tables consumed by scoring and dashboard.

### 2.6 Dashboard / explorer (`apps/explorer`)
Next.js app: agent profile (passport, KYA tier, score history chart), transaction list with on-chain links, dispute timeline, "verify this attestation" page, public scoring-algorithm page.

### 2.7 Demo agents (`apps/demo-agents`)
- `buyer-agent`: Claude-based shopper with a budget and a policy (min band).
- `merchant-agent`: catalogue of 5 fake SKUs, fulfils via simulated shipping; one "bad merchant" mode for the dispute demo.
Both use `@atp/mcp-server`.

## 3. Developer onboarding flow (target)
1. `npx create-atp-agent` → scaffold with wallet, registration file, MCP config.
2. `atp register` (testnet faucet auto-requested).
3. `atp kya --tier 1` (mock provider auto-approves on testnet).
4. Paste MCP server into Claude config → agent can now check trust and transact.

## 4. Repo layout
```
agentbureau/
  contracts/          Foundry: ATPValidation, ATPEscrow, ATPStake, EAS schemas, scripts
  packages/
    protocol/         ATP message types, EIP-712, signing
    scoring/          deterministic scoring lib
    identity/         registration & KYA helpers
    sdk/              @atp/sdk
    mcp-server/       @atp/mcp-server
    cli/              atp CLI
  apps/
    bureau/           API + workers + admin
    indexer/          Ponder project
    explorer/         dashboard
    demo-agents/      buyer + merchant
  spec/               protocol & scoring specs
  security/           threat model, runbooks
  docs/               these plan files
```

## 5. Quality bar
- TypeScript strict, ESLint, Vitest ≥ 85% coverage on packages; Foundry coverage ≥ 90% on contracts.
- Every package has a README with a 60-second example.
- Conventional commits; changesets for versioning; CI runs `atp demo` end-to-end on every PR.
