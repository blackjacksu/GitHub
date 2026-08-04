# 06 — Open Questions

Things I couldn't decide for you. Roughly in order of how much they change the plan.

---

## Q1. Personal tool, or product? 🔴 *changes everything*

These diverge almost immediately:

| | **Personal tool** | **Product** |
|---|---|---|
| Playbook | Just your ~15 providers | Must scale to thousands; becomes the moat |
| Vault | Your data, simple encryption | Multi-tenant isolation, security review, maybe SOC 2 |
| Legal | Essentially none — you're acting for yourself | Disclosure, TCPA, recording consent, marketing claims |
| Delegated calling | You can just do it | Gated on legal review + authorized-agent flows |
| Phase 4 | Optional | The whole business |
| Realistic timeline | Weeks | Quarters |

**My read:** build it as a personal tool *first* regardless of ambition. Phases 0–2 are
identical either way, and the personal version gets you 15 real cases of playbook data —
which is exactly what the product version would need anyway. The fork point is Phase 3.

## Q2. Which vertical first? 🔴

You listed electricity, gas, apartment/property management, hospital billing, health
insurance, car insurance. They are not equally good starting points:

| Vertical | Frequency | $ at stake | Data APIs | Compliance load | Start here? |
|---|---|---|---|---|---|
| **Electricity / gas** | High | Medium | **Yes — strong** | Low | ✅ Best first |
| Apartment / property mgmt | Medium | Low–med | None | Low | Good second — pure long-tail voice |
| Car insurance | Low | Medium | Weak | Medium | Later |
| Hospital billing | Low | **High** | Partial | High | Highest value, do later |
| Health insurance | Medium | **High** | Partial (270/271, FHIR) | **Highest** | Highest value, do last |

**My recommendation: utilities first.** It's the example you reached for yourself, the
data APIs are genuinely good, the compliance load is the lightest, and the "estimated
read / rate plan change / degree-day comparison" analysis produces a visibly smart result
on day one. Medical is where the money is, but it's a bad place to learn.

## Q3. How much do you want to build vs. use?

The voice layer is commoditized; the playbook is not. My default assumption is: buy
everything on the voice/telephony side, build everything on the case/playbook/vault side.
Push back if you'd rather go deeper on the realtime audio stack — that changes the Phase 3
platform choice toward LiveKit.

## Q4. Comfort level on credential custody?

Specifically: are you willing to have the system hold portal **passwords** (which unlocks
the portal-automation channel), or should it hold identifiers only — account numbers, DOB,
last-4 — and always hand off for login? Identifiers-only is meaningfully safer and only
costs you one channel out of six.

## Q5. Do you want to record calls at all?

Recording gives you the transcript, the receipt, the playbook write-back, and the training
data. It also drags in the 13 all-party-consent states. The middle path — **transcribe
live, store the text, don't retain audio** — is legally softer but the consent question
doesn't fully vanish. Worth a decision before Phase 2.

## Q6. What's your actual time budget?

The roadmap timeboxes assume part-time. If this is a weekend project, Phase 1 is still
very achievable and genuinely useful on its own — I'd just cut the document-parsing piece
from the MVP and enter bill facts manually at first.

---

## What I'd suggest we do next

1. **Answer Q1 and Q2** — those two unblock everything else.
2. **Run Phase 0 on one real case this week.** Pick whichever bill is actually annoying you
   right now. Do it by hand, script first, and log the provider data.
3. Bring the results back here and we'll turn the hand-written script into the generator
   spec, then start building Phase 1.

Phase 0 is not busywork — the shape of the playbook schema is the thing most likely to be
wrong in this document, and one real case will tell us more than another week of planning.
