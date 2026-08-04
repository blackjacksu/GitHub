# 04 — Architecture

## The organizing idea

**A case is a state machine; the channel is a pluggable executor.**

Get this separation right and everything else follows. The agent decides *what to
accomplish*; a channel decides *how to deliver it*. Voice is one channel among six, and
demoting it from "the product" to "an executor" is what makes the roadmap tractable.

```
                         ┌────────────────────────────┐
  "my power bill is  ──▶ │  INTAKE                    │
   crazy this month"     │  classify → map to provider│
        + photo of bill  │  taxonomy → fill from vault│
                         │  → ask for what's missing  │
                         └──────────────┬─────────────┘
                                        ▼
                         ┌────────────────────────────┐
   IDENTITY VAULT ──────▶│  CASE FILE                 │◀────── PROVIDER PLAYBOOK
   (per-field release)   │  goal · facts · evidence   │        (IVR, escalation,
                         │  authorization · history   │         auth reqs, taxonomy)
                         │  state · next action       │
                         └──────────────┬─────────────┘
                                        ▼
                         ┌────────────────────────────┐
                         │  PLANNER  (Opus 5)         │
                         │  channel choice · strategy │
                         │  script · branch handling  │
                         │  escalation ladder         │
                         └──────────────┬─────────────┘
                                        ▼
              ┌──────────── GUARDRAIL LAYER (deterministic, not prompted) ───────────┐
              │  PII substitution · disclosure injection · recording notice ·        │
              │  authorization check · money/irreversibility gate · transcript redact│
              └──────────────┬──────────────────────────────────────────────────────┘
                             ▼
        ┌────────┬───────────┬──────────┬─────────┬──────────┬────────────┐
        │ SCRIPT │ CO-PILOT  │ EMAIL /  │  DATA   │  PORTAL  │  VOICE     │
        │        │ (live)    │ MESSAGE  │  API    │ (browser)│ (hold/deleg)│
        └────┬───┴─────┬─────┴────┬─────┴────┬────┴─────┬────┴──────┬─────┘
             └─────────┴──────────┴──────┬───┴──────────┴───────────┘
                                         ▼
                         ┌────────────────────────────┐
                         │  OUTCOME / RECEIPT         │
                         │  ref # · promise · deadline│
                         │  transcript · next follow-up│
                         └──────────────┬─────────────┘
                                        │
                    ┌───────────────────┴──────────────────┐
                    ▼                                      ▼
          write back to PLAYBOOK              FOLLOW-UP SCHEDULER
          (what worked, hold time,            (promise broken? → reopen,
           IVR path, rep behavior)             escalate one rung)
```

## Case state machine

```
DRAFT ─▶ READY ─▶ IN_PROGRESS ─▶ AWAITING_PROVIDER ─▶ RESOLVED
             │         │                  │              │
             │         ▼                  ▼              │
             │   NEEDS_USER          PROMISE_BROKEN ─────┘
             │   (OTP, auth,              │
             │    decision, $)            ▼
             │         │             ESCALATED ──▶ (regulator / formal complaint)
             └─────────┴──────────────────┘
```

`NEEDS_USER` is the most important state in the system. It is not a failure — it's the
designed handoff. Every push notification the user receives corresponds to an entry into
it, and the product's quality is largely measured by **how few seconds each one costs**.

## The guardrail layer — why it's deterministic

The single most important architectural decision: **guardrails are code, not prompt
instructions.** A model told "never reveal the SSN" will eventually reveal the SSN.

```
Planner emits:   "My date of birth is {{user.dob}} and the account
                  number is {{account.electric.number}}."
                          │
                          ▼
Authorization check:  Is dob released for case #481 to provider PG&E?  ✓ (logged)
                      Is account.electric.number released?             ✓ (logged)
                          │
                          ▼
Substitution (deterministic, outside the model):
                  "My date of birth is March 4, 1991 and the account
                   number is 8830142297."
                          │
                          ▼
Delivered to channel. Transcript stored with values re-redacted to placeholders.
```

The model never sees the real values, on the way in or the way out. This also makes the
transcript safe to feed back into the next planning step.

## Core data model

```
users
  └─ vault_fields         (per-field encrypted, key, value, sensitivity, verified_at)
  └─ accounts             (provider_id, account_number, holder_name, service_address)
  └─ documents            (type, storage_ref, parsed_json, case_id?)
  └─ authorizations       (provider_id, scope, granted_at, expires_at, evidence_ref)

providers
  └─ contact_points       (channel, value, department, hours, timezone)
  └─ ivr_paths            (goal, key_sequence, observed_at, success_rate)
  └─ auth_requirements    (ordered list of required fields)
  └─ agent_process        (third-party authorization: exists?, form, turnaround)
  └─ issue_taxonomy       (our_label → their_label, typical_remedy, rights_basis)
  └─ escalation_ladder    (rung, title, trigger_phrase, typical_outcome)
  └─ observations         (median_hold_s, callback_reliability, updated_at)

cases
  └─ goal, acceptable_outcomes, walk_away
  └─ facts                (key → value | vault_ref)
  └─ evidence             (document_ids, computed_findings)
  └─ consent_grants       (field, provider, purpose, granted_at)  ← the ledger
  └─ attempts             (channel, started_at, duration, transcript_ref, outcome)
  └─ receipts             (ref_number, rep_name, promise, promised_by, verified_at)
  └─ state, next_action, next_action_due
```

`providers` is the table that appreciates. Everything else is per-user plumbing.

## Where the LLM is and isn't

| Task | LLM? | Why |
|---|---|---|
| Classifying a complaint into an issue type | Yes | Messy natural language in |
| Parsing a bill / EOB image | Yes | Vision, wildly varied layouts |
| Choosing channel + strategy | Yes | Judgment over playbook + history |
| Writing the script and branch handling | Yes | This is the craft |
| Deciding which PII may be released | **No** | Authorization table lookup |
| Substituting secret values | **No** | Deterministic |
| Injecting AI/recording disclosure | **No** | Must be unconditional |
| Gating money/irreversible actions | **No** | Hard rule |
| Scheduling follow-ups | **No** | Dates and rules |
| Live conversation turn-taking | Yes (fast model) | Plan is precomputed; executor is fast |

## Two design notes worth locking in early

**1. Every channel degrades to `SCRIPT`.** Voice fails, portal changes its DOM, API returns
nothing — the fallback is always "hand the human a great briefing." The product never
dead-ends, and this makes shipping risky channels safe.

**2. Write back to the playbook on every attempt.** Hold time, which IVR sequence worked,
what the rep asked for, which escalation phrase moved things. This is the compounding
loop — case #500 against a given utility should go materially better than case #5. If
you skip this, you've built a wrapper around a voice API instead of an asset.
