# 01 — Blockchain Network Survey & Recommendation
*Domain: Blockchain exploration · Owner: Claude (architect) · Status: COMPLETE*

## 0. Framing question

We are not choosing a chain to *be* the product. We are choosing a **settlement and attestation substrate** on which a credit-bureau service can (a) anchor agent identities, (b) record transaction outcomes immutably, (c) publish signed scores, and (d) interoperate with the payment rails agents actually use. Five criteria matter, in this order:

1. **Existing agent-trust primitives** — are ERC-8004 / EAS / escrow standards already deployed? (Saves months.)
2. **Payment-rail gravity** — where is agent money actually moving (x402 / USDC)?
3. **Demo speed** — can one developer get a working flow in days?
4. **Cost & finality** — sub-cent fees, seconds-or-better finality.
5. **Credibility & longevity** — will merchants and enterprises accept records anchored here?

## 1. The five candidates

### A. Base (Ethereum L2, OP-Stack, Coinbase)
- **Primitives:** ERC-8004 Identity + Reputation registries deployed (Feb 2026). EAS is **predeployed as a system contract** (`0x4200000000000000000000000000000000000021`) on both Base mainnet and Base Sepolia. ERC-8183 reference escrows live on Base testnets.
- **Payment gravity:** Base dominates x402 activity (≈129M of ~161M cumulative payments through mid-2026, $42M volume). Coinbase AgentKit, Coinbase facilitator, USDC native.
- **Demo speed:** Solidity + Foundry/Hardhat; Base Sepolia faucets; every tool in the EVM ecosystem works. Best-documented path for agent payments.
- **Cost/finality:** < $0.01/tx; ~2s block time, soft finality seconds, L1 finality minutes.
- **Credibility:** Backed by a listed US company; captured ~62% of L2 fee revenue in 2025; Coinbase app distribution.
- **Risks:** Sequencer is centralized (Coinbase); OP-Stack fraud-proof decentralization still maturing; Coinbase could ship a competing "agent trust" product.

### B. Ethereum Mainnet (L1)
- **Primitives:** Canonical home of ERC-8004 (contracts repo lists mainnet addresses), EAS v0.26, ENSIP-25 agent names.
- **Payment gravity:** Low for micropayments — too expensive.
- **Demo speed:** Same tooling as Base; mainnet deployment costly.
- **Cost/finality:** ~$1–4/tx post-Fusaka; ~12–15 min economic finality.
- **Credibility:** Highest neutrality and longevity; the "root of trust" merchants would accept for high-value records.
- **Risks:** Fees make per-transaction attestations uneconomic. Only sensible as an *anchoring* layer (periodic Merkle-root checkpoints), not the working chain.

### C. Solana
- **Primitives:** No ERC-8004 equivalent — we would have to **write our own registry and attestation programs in Rust/Anchor**. Solana Agent Kit, Solana Attestation Service exist but are younger and non-standard.
- **Payment gravity:** Strong — second largest x402 chain, very large stablecoin volume, claims of up to 49–65% of agent-payment share (contested; adjusted figures much lower).
- **Demo speed:** Slower — Rust dev pool is smaller; fewer reusable audited components for our exact use case.
- **Cost/finality:** ~$0.00025/tx; ~400ms finality today, Alpenglow targeting 100–150ms.
- **Credibility:** Good; historical outage record is a talking point with enterprises.
- **Risks:** Rebuilding the trust primitives ourselves; standards fragmentation from the EVM agent ecosystem (ERC-8004/8183, EAS, ENS).

### D. Hedera (hashgraph; HCS + HCS-14 Universal Agent ID)
- **Primitives:** HCS-14 defines a cross-protocol Universal Agent ID; Hedera Consensus Service is a natural append-only log for transaction receipts; EVM-compatible via Hedera Smart Contract Service.
- **Payment gravity:** Weak for agent payments; x402 presence negligible.
- **Demo speed:** Moderate — good SDKs, but small developer community and fewer agent-commerce examples.
- **Cost/finality:** ~$0.0001/tx, **fees fixed in USD** (predictable), ~3–5s finality, ~10k TPS.
- **Credibility:** Council-governed (Google, IBM, Dell, etc.) — attractive to enterprises; criticized as too centralized by crypto-native users.
- **Risks:** Isolated from where buyer agents' money lives; we'd be bridging identities to EVM anyway.

### E. Arbitrum One (Ethereum L2, optimistic rollup)
- **Primitives:** EAS deployed; community ERC-8004-compatible escrows (e.g., PactEscrow) live; large DeFi tooling base.
- **Payment gravity:** Moderate; x402 support exists but far behind Base/Solana.
- **Demo speed:** Same as Base (EVM).
- **Cost/finality:** $0.05–0.30/tx (higher than Base); ~0.25s block time, L1 finality ~1 week challenge window for withdrawals.
- **Credibility:** Most decentralized major L2 (BoLD permissionless validation); strong DeFi reputation.
- **Risks:** Higher fees for high-frequency attestations; less agent-economy mindshare than Base.

*(Also considered and set aside: Polygon PoS — cheap and EVM but no ERC-8004 deployment and less agent traction; Avalanche subnet / own appchain — maximum control but zero shared liquidity, identity or distribution, and weeks of infra before a demo; Arc (Circle's L1) — interesting, USDC-native, ERC-8004/8183 examples exist, but too new to anchor a bureau on.)*

## 2. Comparison matrix

| Criterion (weight) | Base | Ethereum L1 | Solana | Hedera | Arbitrum |
|---|---|---|---|---|---|
| Agent-trust primitives already deployed (30%) | ●●●●● ERC-8004 + EAS predeploy + 8183 refs | ●●●●○ canonical but costly | ●●○○○ must build | ●●●○○ HCS-14, HCS logs | ●●●●○ EAS + escrows |
| Agent payment gravity / x402 (20%) | ●●●●● | ●○○○○ | ●●●●○ | ●○○○○ | ●●○○○ |
| Demo speed for a small team (20%) | ●●●●● | ●●●●○ | ●●○○○ | ●●●○○ | ●●●●○ |
| Cost & finality (15%) | ●●●●○ | ●○○○○ | ●●●●● | ●●●●● | ●●●○○ |
| Credibility / neutrality (15%) | ●●●●○ | ●●●●● | ●●●○○ | ●●●●○ | ●●●●○ |
| **Weighted score** | **4.6** | 3.1 | 3.1 | 3.0 | 3.5 |

## 3. Recommendation

**Build on Base. Demo on Base Sepolia. Anchor checkpoints to Ethereum L1 later.**

Why Base wins decisively:
- It is the only network where **all four primitives we need are already deployed** — ERC-8004 registries, EAS (as a system contract, so it will never disappear), ERC-8183 reference escrows, and the x402 facilitator with native USDC. The demo becomes "write ~3 small contracts + an off-chain bureau service," not "build a chain."
- It is **where buyer agents' money already is**. A bureau that merchants' agents consult must sit in the hot path of payments; Base is the hot path.
- Every implementer model we delegate to knows Solidity/TypeScript/Foundry; no Rust ramp.

Hedging strategy (keeps us multi-chain without multi-chain cost):
- Identity = ERC-8004 agentId **on Base** is the primary key. Store it in the agent's AP2/A2A agent card so Visa TAP / AP2 flows can reference it.
- Trust Score attestations are **EAS off-chain attestations** (signed, free) by default; we post **on-chain** only for score changes and disputes. Off-chain attestations are chain-agnostic and can be verified by a Solana or Hedera counterparty.
- Phase 3: periodic Merkle root of the bureau ledger posted to **Ethereum L1** for maximum longevity.
- If Solana agent volume justifies it, Phase 4 adds a Solana "mirror" program that verifies the bureau's signature on EAS attestations — no re-implementation of scoring.

## 4. Demo-stack decision (concrete)

| Layer | Choice |
|---|---|
| Local chain | **Anvil (Foundry)** — fork Base Sepolia so ERC-8004 + EAS addresses already exist |
| Contracts | Solidity 0.8.x, Foundry; OpenZeppelin |
| Testnet | Base Sepolia (chainId 84532); test USDC from Circle faucet |
| Attestations | EAS SDK (`@ethereum-attestation-service/eas-sdk`), schemas registered on Base Sepolia |
| Payments | x402 with Coinbase facilitator (testnet), USDC |
| Bureau service | TypeScript (Node 20), Postgres, viem/wagmi, Ponder or Envio for indexing |
| Agents (demo) | Two TypeScript agents using Anthropic SDK + MCP, buyer & merchant |

## 5. Honest caveats surfaced by research
- ERC-8004 is still **Draft**. Empirical studies (mid-2026) found most registrations are placeholders (only 3–15% expose a valid registration file) and reputation is thin. This is *why a bureau is needed* — but it also means we cannot inherit trust from the registry; we must manufacture it via KYA + validation.
- The ERC-8004 **Validation Registry had no mainnet deployment** observed in those studies. We should be prepared to deploy our own validation contract that follows the interface.
- Sybil attacks and "tenure farming" are explicit open problems in the standard. Our Trust Score must make tenure expensive (stake, verified volume, KYA) — see `03-TRUST-MECHANISM.md`.
- Card networks (Visa TAP, Mastercard Agent Pay) solve *agent recognition for card payments* but are closed. We interoperate (store their agent IDs in the passport), we do not compete on card rails.

## Sources
- [What is ERC-8004? — eco.com](https://eco.com/support/en/articles/13221214-what-is-erc-8004-the-ethereum-standard-enabling-trustless-ai-agents)
- [Can Trustless Agents Be Trusted? — arXiv 2606.26028](https://arxiv.org/html/2606.26028)
- [ERC-8004 Explained: adoption & timeline — Datawallet](https://www.datawallet.com/crypto/erc-8004-explained)
- [ERC-8183: Agentic Commerce — eips.ethereum.org](https://eips.ethereum.org/EIPS/eip-8183)
- [EAS contracts & deployments — GitHub](https://github.com/ethereum-attestation-service/eas-contracts)
- [Awesome ERC-8004 (KYA, escrow, x402 examples)](https://github.com/apexfaucet-hub/awesome-erc8004)
- [x402 vs AP2 2026 — rohitraj.tech](https://rohitraj.tech/notes/ai-agent-payments-x402-vs-ap2-2026)
- [x402 Explained & identity question — Concordium](https://www.concordium.com/article/x402-explained-agentic-payments-identity)
- [AP2 Explained — eco.com](https://eco.com/support/en/articles/14845479-ap2-agent-payments-protocol-explained)
- [AI Agents: Crypto's Next Wave — ByteTree](https://www.bytetree.com/research/2026/05/ai-agents-cryptos-next-wave/)
- [Best Blockchain to Build On in 2026 — Sherlock](https://sherlock.xyz/post/best-blockchain-to-build-on-in-2026)
- [Blockchain Platform Comparison 2026 — Debut Infotech](https://www.debutinfotech.com/blog/blockchain-platform-comparison-best-chain-to-build)
- [Best Blockchains for Enterprise — Mpost](https://mpost.io/best-blockchains-for-enterprise-use-speed-cost-scalability-compared/)
- [Solana AI Agent Economy 2026 — CryptoTimes](https://www.cryptotimes.io/insights/solana-ai-agent-economy-2026-inside-the-31b-race-to-build-cryptos-machine-payment-layer/)
- [TessIndex / HCS-14 context — arXiv 2608.21942](https://arxiv.org/pdf/2608.21942)
