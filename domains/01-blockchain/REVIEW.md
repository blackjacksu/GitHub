# Review notes — 01 Blockchain survey
- Recommendation (Base, Sepolia for demo, L1 anchoring later) is sound and matches where x402 volume is. Keep.
- The weighting favours the chosen answer; that is acceptable for a decision record but say so.
- Claims under fact-check: ERC-8004 deployments and adoption figures (F1, F2), EAS predeploy address (F3), x402 volumes (F4), ERC-8183 reference deployments (F6), Base fee share (F8). Update this doc when the research report lands.
- Add Base finality guidance for the indexer (soft vs L1 finality, reorg depth) since scoring reads events.

## From the landscape research
- F1: ERC-8004 Identity/Reputation live on Base and Base Sepolia at the `0x8004…` addresses; **no official Validation Registry anywhere**. Deploy `ATPValidation` ourselves and track ERC-8294.
- F2: replace "85–97% empty shells" with the paper's numbers (3%/4%/15% valid-and-live on Ethereum/BSC/Base; 73–91% sybil reviewers).
- F3: EAS predeploy confirmed on Base mainnet at v1.0.1 (not 1.4.0); sign off-chain attestations against the deployed domain version. Base Sepolia address not directly observed; confirm from docs.base.org.
- F4: the x402 160M/129M/$42M trio has no primary source; cite Chainalysis (>138M on Base by Q3 2026) and note TRM's estimate that only 0.6–7.5% is genuinely agent-driven.
- F8 (62% of L2 fee revenue) was not checked; source it or drop it.
