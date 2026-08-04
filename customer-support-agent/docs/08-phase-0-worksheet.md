# 08 — Phase 0 Worksheet

**Use this on your next real utility call.** Print it, or keep it open on a second screen.

The point is not to solve your bill. The point is that filling this in **is** the seed of
the Provider Playbook, and the parts that feel awkward to fill in are the parts of the
schema in [`04-architecture.md`](04-architecture.md) that are wrong. One real call will
teach us more than another week of planning.

Copy this file per call: `logs/2026-08-05-pge.md`.

---

## Before the call

**Provider:** ______________________  **Date/time started:** ____________

**What I want (one sentence, with a specific remedy):**
> ______________________________________________________________

**My hand-written opening line** — write it *before* dialing, even if it feels silly:
> ______________________________________________________________
> ______________________________________________________________

**Facts I had to go look up** ⏱ *(this list is the Identity Vault spec)*

| Fact | Where I found it | Minutes spent |
|---|---|---|
| | | |
| | | |
| | | |

---

## Routing ⏱

| | |
|---|---|
| Number dialed | |
| Where I found that number | |
| **Exact key sequence pressed** | |
| Did any sequence skip the menu? | |
| Dead ends / wrong departments hit | |
| Time from dial → hold queue | |
| **Time on hold** | |
| Transferred? How many times? | |

---

## Authentication ⏱

**Exactly what they asked for, in order** *(this is the auth_requirements list)*

1. ______________________
2. ______________________
3. ______________________

- Anything I couldn't answer? ______________________
- Did they accept a partial answer? ______________________
- **Did I ask whether an authorized third party can be added to this account?**
  ☐ Yes ☐ Forgot — *ask this every single time, it's the key to Phase 4*
  - Their answer: ______________________
  - Form / process / turnaround: ______________________

---

## The conversation

**Their internal name for my issue:** ______________________
*(e.g. "high bill investigation", "meter re-read", "budget billing")*

**What actually worked:**
> ______________________________________________________________

**What they pushed back on, and their exact words:**
> ______________________________________________________________

**What I wish I'd had in front of me:**
> ______________________________________________________________

**Did I escalate?** ☐ No ☐ Supervisor ☐ Higher
- What phrase triggered it: ______________________
- Did it change the outcome? ______________________

---

## Receipt ✅ *(fill this in every time, no exceptions)*

| | |
|---|---|
| Reference / ticket number | |
| Rep name & ID | |
| What they committed to | |
| By when | |
| Direct callback number | |

---

## Time accounting ⏱ *(the whole reason for this worksheet)*

| Stage | Minutes |
|---|---|
| Finding the number & department | |
| Digging up my own information | |
| IVR navigation | |
| **Hold** | |
| Actually talking | |
| Writing things down afterward | |
| **TOTAL** | |

**Of that total, how many minutes genuinely needed *me*?** ____________

---

## The most important box on this page

**Moments where I thought "an AI could not have done this":**
> ______________________________________________________________
> ______________________________________________________________
> ______________________________________________________________

**Moments where I thought "this was pure mechanical drudgery":**
> ______________________________________________________________
> ______________________________________________________________
> ______________________________________________________________

---

## After 3–5 calls, we should be able to answer

- [ ] Is the hand-written script actually helping, or is it theatre?
- [ ] What fraction of total time is hold? *(this sizes the Phase 3 payoff)*
- [ ] How many minutes genuinely required a human? *(this is the real North Star baseline)*
- [ ] Do the auth requirements differ enough between providers to need per-provider modelling?
- [ ] Does the authorized-third-party door actually exist at your utilities?
- [ ] Is the Case File schema in [`../examples/case-schema.yaml`](../examples/case-schema.yaml)
      missing fields, or carrying ones nothing ever fills?
