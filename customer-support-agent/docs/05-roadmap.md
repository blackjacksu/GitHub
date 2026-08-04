# 05 — Executable Plan

Five phases. Each ends with something usable, and each earns the right to the next by
producing evidence. Timeboxes assume one focused person working part-time; halve them if
this is full-time.

---

## Phase 0 — Prove it manually (1–2 weeks) · **no code**

The most valuable and most-skipped phase. You cannot design the case file or the playbook
by imagining them.

**Do this:**
1. List your own next 10–15 real support interactions (electricity, gas, insurance,
   apartment, medical bill — whatever's actually pending).
2. Handle each one by hand, but **write the script first**, by hand, before dialing.
3. Time everything: prep, IVR, hold, talk, follow-up.
4. Record for each provider: number that reached a human, IVR key sequence, exactly which
   fields they asked to authenticate, what they called the issue internally, whether an
   authorized third party can be added and how.
5. Note every moment you thought *"an AI could not have done this"* — that list is your
   real requirements doc.

**Exit criteria:** 10 completed cases, 5+ provider playbook entries, a time breakdown
showing where the minutes actually go, and a hand-written script template that felt good
to use.

> If the hand-written script doesn't noticeably help you, stop and rethink — that's cheap,
> honest information and it's better to learn it in week one.

---

## Phase 1 — The Prep Engine (3–5 weeks) · **MVP, ship this**

A web app that turns a complaint into a great call briefing. **No calling. No telephony.
No compliance review needed.**

**Build:**
- Auth + Identity Vault (encrypted per-field, entered once)
- Document upload → Claude vision parses bills/EOBs into structured facts
- Intake flow: describe the problem → agent asks ≤3 clarifying questions → Case File
- Provider Playbook seeded with your Phase 0 data (10–20 providers)
- **Script generator** — the core deliverable, see
  [`../examples/electricity-high-bill.md`](../examples/electricity-high-bill.md)
- Mobile-friendly call view: tap-to-dial, IVR keys as buttons, facts card, a live checklist,
  and a "reference number" capture field
- Outcome capture → receipt → follow-up reminder

**Stack:** Next.js on Vercel + Supabase + Anthropic API. Nothing exotic.

**Success metric:** *you* use it for every support call for a month without wishing you
hadn't. Then 5 other people do.

---

## Phase 2 — The Co-Pilot (4–6 weeks)

The user still makes the call. The agent is on the line *with* them, listening.

**Build:**
- Live transcription of the user's own call
- Real-time on-screen prompts: what to say next, the fact they're being asked for shown
  the instant it's requested, a nudge when the rep dodges the question
- Auto-capture of reference numbers, rep names, and promises from the transcript
- Post-call summary + auto-scheduled follow-up
- Playbook write-back: hold time, IVR path, what the rep asked

**Compliance note:** the user is a party to their own call, but the 13 all-party-consent
states mean the safe default is to have the user announce recording at the start — put
that line in the script and make it the first checklist item.

**Why this phase matters:** it's the first genuinely *novel* experience, it removes the
"what do I say now" anxiety that is most of the dread, and it generates high-quality
training data for Phase 4 with essentially zero legal risk.

---

## Phase 3 — Hold & Hand-Off (4–6 weeks) · **best value-to-risk ratio in the project**

The agent dials, navigates the IVR, and waits on hold. When a human picks up, it announces
itself, confirms it has the right department, and brings the user in — who arrives to a
live human instead of a queue.

**Build:**
- Telephony + voice platform integration (choose Vapi / Retell / LiveKit *here*, not before)
- IVR navigation from the playbook, with recovery when the tree has changed
- Hold detection and human-pickup detection
- Push notification + warm bridge to the user's phone
- Unconditional opening disclosure: AI, on behalf of a named person, call recorded
- Full transcript → receipt

**Why this is the sweet spot:** hold time is the single largest chunk of wall-clock
burden, and eliminating it requires **no impersonation and no delegated authority
whatsoever**. The agent never claims to be the user; it just refuses to wait on their
behalf. Legally about as clean as automation gets, and it's the feature people will
describe to their friends.

---

## Phase 4 — Delegated Resolution (ongoing, per-provider)

The original vision, unlocked one provider at a time.

**Order of attack — easiest channel first:**
1. **Data APIs** — answer the question without contacting anyone (utility usage/interval
   data via Bayou/UtilityAPI/Green Button; eligibility via 270/271)
2. **Email / secure message centers** — async, textual, fully automatable, no consent issues
3. **Portals** — browser automation with the user's own logged-in session
4. **Voice, delegated** — only for providers where the user has completed the
   authorized-third-party process, and only after a lawyer reviews the disclosure script

**Prerequisites before any delegated voice ships:**
- [ ] Legal review of disclosure + recording + TCPA posture
- [ ] Authorized-third-party flow implemented end-to-end for ≥1 provider
- [ ] Hard gate on money/irreversible actions verified by test
- [ ] Instrumented outcome data good enough to state real success rates (rule R8)

---

## Metrics — instrument these from Phase 1, not later

The North Star is **not** "% fully automated." It's:

> ### Minutes of user attention per resolved case

| Metric | Why | Rough target by Phase 3 |
|---|---|---|
| **User attention minutes / resolved case** | The actual product | < 5 (from a 45–90 min baseline) |
| First-contact resolution rate | Quality of prep | > 60% |
| % cases with a captured reference number | Follow-through discipline | > 90% |
| Promise-kept rate | Detects who needs escalating | measured, not targeted |
| Cases needing a second contact | Prep quality | falling over time |
| Playbook coverage | The compounding asset | providers with ≥3 observed cases |

These metrics are also your defense against the DoNotPay failure mode: you will always be
able to say precisely what the product does, because you measured it.

---

## Sequencing rationale, in one line each

- **Phase 0** because you cannot design the playbook schema from an armchair.
- **Phase 1** because it's useful immediately, carries zero legal risk, and builds the
  vault + playbook that every later phase requires.
- **Phase 2** because live assist is novel, safe, and generates the conversation data
  Phase 4 needs.
- **Phase 3** because hold time is the biggest single win available without touching
  impersonation or delegated authority.
- **Phase 4** last because it is gated on paperwork and legal review — neither of which
  gets faster by starting earlier, and both of which are wasted effort if Phases 1–3 don't
  find users.
