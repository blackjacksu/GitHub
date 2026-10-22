# Trusted Agent Framework (working name: AgentBureau)

**Thesis:** agent-to-agent commerce now has payment rails (x402, AP2, Visa TAP, Mastercard Agent Pay)
but no answer to "should I trust this counterparty?". AgentBureau is a credit bureau for agents:
Know-Your-Agent (KYA) checks, a reproducible Trust Score, escrow evaluation, and a dispute bureau,
delivered as attestations on Base (ERC-8004 identity, ERC-8183 escrow, EAS attestations) plus an SDK and MCP server.

> Status: **design review**. Spec v0.1 (2026-10-21) is filed per domain below. Nothing is implemented yet.
> Review and survey are done. Next: resolve the decisions in the review §4, revise the spec to v0.2, freeze interfaces, then delegate each workstream to an implementer agent.

## Start here

1. [`domains/00-overview/00-OVERVIEW.md`](domains/00-overview/00-OVERVIEW.md) — thesis, key decision, document map, phases
2. [`domains/02-architecture/02-ARCHITECTURE-SPEC.md`](domains/02-architecture/02-ARCHITECTURE-SPEC.md) — system architecture and data model
3. [`docs/REVIEW-v0.1.md`](docs/REVIEW-v0.1.md) — architecture review of the spec: verdict, ranked issues, fact-check register, decisions needed
4. [`research/reports/Agent commerce trust landscape.md`](research/reports/Agent%20commerce%20trust%20landscape.md) — landscape survey with 200+ citations (raw notes in `research/research_notes/`)

## Domains

Each domain folder holds its spec, a `README.md` (owner, dependencies, status), and will gain `REVIEW.md` and `BRIEF.md` before delegation.

| Folder | Workstream | Spec |
|---|---|---|
| `domains/00-overview/` | — | Master plan and index |
| `domains/01-blockchain/` | WS0 (done) | Chain survey and recommendation (Base) |
| `domains/01b-contracts/` | WS1 | Contracts and chain (spec spread across 02/03/06) |
| `domains/02-architecture/` | cross-cutting | High-level architecture |
| `domains/03-trust-mechanism/` | WS2 | Trust Score, sybil resistance, disputes |
| `domains/04-identity-kya/` | WS3 | Identity model, KYA tiers, operator binding |
| `domains/05-protocol/` | WS4 | ATP wire protocol |
| `domains/06-security/` | WS6 | Threat model, keys, contract and infra security |
| `domains/07-tooling/` | WS5 | SDK, MCP server, CLI, indexer, explorer |
| `domains/08-validation/` | WS7 | Validator mandate, test scopes, phase gates |
| `domains/09-business/` | WS8 | Business proposal |
| `domains/10-program/` | — | Workstreams, phases, delegation template |

## Other directories

| Path | Purpose |
|---|---|
| `docs/` | Reviews and architecture decision records (`docs/adr/`) |
| `research/` | Landscape survey (`research/reports/`) and raw notes (`research/research_notes/`) |

The spec's target repo layout (`contracts/`, `packages/`, `apps/`, `spec/`, `security/`) is in
`domains/07-tooling/07-AGENT-TOOLING.md` §4 and will be created when implementation starts.

## License

Apache-2.0 (see `LICENSE`). Change before first release if a different license is wanted.
