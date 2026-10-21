# Review notes — 03 Trust mechanism
**Blocker.** See `docs/REVIEW-v0.1.md` C1 for worked numbers.
- `D` awards full credit (250 points) to agents with zero history. Add a prior or confidence scaling.
- Tenure and volume log curves give most of their credit at the low end (90 days → 0.64; $10k → 0.67). A 90-day, $10k, KYA-2 agent reaches *Trusted* (691).
- Band gates in the table ("≥ 1 year, staked") are not enforced by the formula. Make bands = threshold + hard gates.
- The "≥ 10× cost" property is untestable until per-band order limits are defined. Define them, ideally as a function of stake.
- Count only counterparty-diverse, cluster-discounted volume for V.
- Penalties are "time-decaying" with no curve; specify.
- Off-chain attestation revocation mechanism (§3 step 4) is unspecified.
- Dispute state machine is reasonable. Specify the bond refund rules for Split rulings and the appeal bond size. Add four-eyes review for human rulings (insider threat).
- Good: both-sided direction-specific counters; versioned scoring; fixtures as the test contract.
