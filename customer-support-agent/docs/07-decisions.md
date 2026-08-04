# 07 — Decision Log

Append-only. Each entry records what was decided, when, and what it rules in and out, so
we don't relitigate settled ground.

---

## D1 — Build as a personal tool first
**Date:** 2026-08-04 · **Status:** Accepted

Build for a single user (you) and your ~15 real providers. The product question is
deferred to the Phase 3 fork point, not answered now.

**Rules in:**
- Single-tenant data model; simple encryption; no multi-tenant isolation work yet
- No legal review needed for Phases 0–2 (you are acting for yourself)
- Playbook seeded by hand from your own cases — depth over breadth
- Ship-to-usefulness measured in weeks

**Rules out (for now):**
- SOC 2, security review, marketing claims, contingency-fee billing
- Any provider you don't personally have an account with

**Why:** Phases 0–2 are byte-for-byte identical either way, and the personal build
generates exactly the playbook data a product version would need. Nothing is foreclosed.

**Revisit when:** Phase 2 is in daily use and you want to hand it to someone else.

---

## D2 — Utilities (electricity + gas) as the first vertical
**Date:** 2026-08-04 · **Status:** Accepted

**Rules in:**
- Bill parsing tuned for electric/gas statements only
- Utility data APIs (Bayou / UtilityAPI / Green Button) as a first-class evidence source
- Issue taxonomy scoped to: unexpected increase, estimated read, rate-plan question,
  meter dispute, payment arrangement, outage credit, billing error
- CPUC (or your state's PUC) as the terminal escalation rung

**Rules out (for now):** medical billing, health insurance, car insurance, property
management. Revisited after Phase 1 works end-to-end on one utility.

**Why:** highest frequency, best API coverage, lightest compliance load, and the
data-driven findings (estimated read, period length, rate-plan change) make the output
visibly smart on day one.

---

## D3 — Credential scope deferred; vault built with per-field sensitivity from the start
**Date:** 2026-08-04 · **Status:** Accepted

The vault ships with a `sensitivity` tier on every field and a per-field release gate, so
adding portal passwords later is a data question, not a rewrite.

**Rules in:**
- Every vault field carries `sensitivity: low | medium | high | critical`
- Release is per-field, per-case, per-provider, and logged (requirement R5)
- Phase 1 populates identifiers only — account number, holder name, service address, DOB,
  SSN last-4

**Rules out (for now):** storing portal passwords; browser automation channel.

**Revisit when:** Phase 4, if a target utility has no usable API and no email channel.

---

## Consequences for the plan

Phase 1 scope narrows to something quite concrete:

> A single-user web app that ingests **electric and gas bills**, pulls **13 months of
> history**, computes the **findings** (estimated read / period length / rate-plan change /
> weather-normalized usage), and emits the **call script** — for the ~5 utility providers
> you actually have accounts with.

That is a genuinely small build, and it's the whole of
[`../examples/electricity-high-bill.md`](../examples/electricity-high-bill.md).

Two things drop out of the MVP entirely as a result of D1 + D2:
- Multi-provider generality — hardcode-ish is fine for five providers
- Any compliance surface — nothing here contacts anyone
