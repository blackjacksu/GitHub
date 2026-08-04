# 02 — Requirements

What has to be true for this to work. Split into the four things the system must know,
the four things it must do, and the rules it must never break.

---

## A. The four knowledge assets

Everything the product does is downstream of these. Building them *is* building the product.

### A1. The Identity Vault — "who the user is"

Per-user, encrypted, field-level. Populated once, reused across every case forever. This is
the single biggest time-saver in the entire system and it's pure CRUD.

| Class | Fields | Sensitivity |
|---|---|---|
| Person | legal name, DOB, phone, email, current + prior address, last 4 SSN | High |
| Accounts | provider, account/member/policy number, service address, account holder name | Medium |
| Portal creds | username, password, MFA method | **Critical** |
| Documents | bills, EOBs, policy PDFs, lease, denial letters | Medium–high |
| Preferences | callback windows, contact channel, escalation tolerance | Low |

### A2. The Provider Playbook — "how this company works"

Per-provider (per-region where it matters). **This is the defensible asset.** Every case
run should write back into it.

- Contact surface: phone numbers by department, hours + timezone, chat/portal/secure-message
  URLs, email, mailing address for formal disputes
- **IVR map**: the actual key sequence that reaches a human, and the sequence for each
  department
- Auth requirements: exactly which fields they ask for, in what order
- **Authorized-third-party process**: does it exist, what form, how long, is a recorded
  verbal authorization accepted
- Issue taxonomy: their internal name for the thing the user wants ("high bill
  investigation", "meter re-read", "budget billing", "prior authorization appeal")
- Escalation ladder: supervisor → retention → executive complaints → state regulator
  (public utility commission, insurance commissioner) → and the phrasing that triggers each
- Observed reality: median hold time, callback reliability, what actually worked last time

### A3. The Case File — "what we're trying to accomplish"

One object per user-problem, from intake to resolution. See
[`../examples/case-schema.yaml`](../examples/case-schema.yaml) for the full shape.

Must carry: goal, acceptable outcomes, walk-away line, facts + evidence, attempt history,
current state, next action + due date, and the **outcome receipt** (reference number, who
was spoken to, what was promised, by when).

### A4. The Consent & Authorization Ledger

Immutable, append-only. For every case: what the user authorized the agent to *do*, which
fields it may *disclose*, to whom, and until when. Every actual disclosure logs against it.
This is what makes delegated action defensible, and it's also the substrate for the audit
trail.

---

## B. The four capabilities

### B1. Intake — turn a vague complaint into a structured case

Input is messy: *"my electricity bill is way too high this month"*, possibly with a photo
of the bill. Output is a complete Case File. The agent must:
- classify the issue and map it to the provider's own terminology
- pull known facts from the vault, and identify which facts are **missing**
- ask the user only for what's genuinely missing (target: ≤3 questions)
- parse uploaded documents (bills, EOBs, denial letters) into structured fields
- state a concrete, checkable goal — not "resolve the issue" but "obtain a meter re-read
  and a written explanation of the 240% usage increase for the July billing period"

### B2. Preparation — produce the script and the briefing

The core deliverable of v1. See [`../examples/electricity-high-bill.md`](../examples/electricity-high-bill.md).
Must include: routing, IVR path, opening statement, facts-they'll-ask-for card, the ask,
the evidence, branch handling for the likely responses, the escalation phrase, and a
capture slot for the reference number.

### B3. Execution — actually run the interaction

Channel-dependent, in ascending order of difficulty:

| Channel | Mechanism | Difficulty |
|---|---|---|
| **Script** | Render to the human | Trivial |
| **Co-pilot** | Live assist while the human talks | Low |
| **Email / secure message** | Compose, send, parse the reply, thread | Low |
| **Data API** | Utility/insurer data pulls with user authorization | Medium |
| **Portal** | Browser automation against a logged-in session | Medium–high (fragile, MFA) |
| **Voice — hold & hand off** | Agent dials, navigates IVR, waits, brings user in | Medium |
| **Voice — delegated** | Agent conducts the call as an authorized third party | High |

### B4. Follow-through — close the loop

The most-neglected and cheapest-to-build capability. Capture the reference number and the
promise; set the follow-up date; detect the broken promise; re-open automatically;
escalate one rung. **A large share of real-world resolutions fail purely because nobody
followed up on day 10.**

---

## C. The hard rules

These are non-negotiable and should be enforced in code, not in a prompt.

| # | Rule | Why |
|---|---|---|
| R1 | **Never claim to be the user.** Always disclose: AI, and acting on behalf of a named person. | Fraud exposure; state AI-disclosure law |
| R2 | **Never place secrets in an LLM prompt or transcript.** Model emits `{{account_id}}`; a deterministic layer substitutes at delivery and redacts on capture. | Credential custody; blast radius |
| R3 | **Disclose recording at the top of every call.** | 13 all-party-consent states |
| R4 | **Never commit money, cancel service, or accept a settlement without explicit user approval.** | Irreversibility |
| R5 | **Release PII per-field, per-case, per-provider, logged.** Never bulk access. | Least privilege; audit |
| R6 | **Every case produces a receipt** — transcript/summary, reference number, promise, follow-up date. | Trust; and it's the product's memory |
| R7 | **Hard stop and escalate to the human** on: identity challenge, legal/medical judgment, anything not in the authorization, or a rep who asks to speak to the account holder. | Keeps the agent inside its competence |
| R8 | **Claim only what is measured.** No capability marketing ahead of instrumented outcomes. | FTC v. DoNotPay |

---

## D. Non-functional requirements

- **Latency (voice):** sub-second turnaround is table stakes; tuned stacks hit ~500–700ms
  median in 2026. Above ~1.2s the conversation feels broken and reps hang up.
- **Interruption handling:** IVRs and reps talk over you. Barge-in support is mandatory,
  not a nice-to-have.
- **Security:** encryption at rest with per-field keys; row-level isolation per user; no
  shared-tenant leakage of vault data; short-lived credential handles rather than
  long-lived copies.
- **Auditability:** every disclosure, every call, every action reconstructible after the fact.
- **Graceful degradation:** any automated channel that fails must fall back to producing a
  *script* for the human. The product never dead-ends.
- **Cost per case:** voice runs roughly $0.05–0.12/min of platform cost before LLM tokens.
  A 45-minute hold is a real line item — budget it, and prefer the async channels when
  they exist.
