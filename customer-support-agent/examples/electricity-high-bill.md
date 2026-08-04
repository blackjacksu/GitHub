# Example output — "Why is my electricity so high this month?"

This is a mock of what the **Phase 1 Prep Engine** hands the user. It's your own example,
worked all the way through. Treat it as the spec for the script generator: if the generator
can reliably produce this, Phase 1 is done.

Everything in `‹angle brackets›` is filled from the Identity Vault or the Provider Playbook —
the user types none of it.

---

# 📞 Call: ‹Pacific Gas & Electric› — High Bill Investigation

**Case #481** · Est. 12 min talk + hold · Prepared 2026-08-04

### Before you dial
- [ ] Have your ‹July 2026› bill open (attached below)
- [ ] Somewhere to write a reference number
- [ ] Say **"I'm recording this call for my records"** at the start ← *‹CA is an all-party consent state›*

---

## 1. Routing

| | |
|---|---|
| **Number** | ‹1-800-743-5000› |
| **IVR path** | Press ‹1› (English) → ‹3› (Billing) → ‹0› ‹0› ‹0› (skips menu, reaches a human) |
| **Hours** | ‹Mon–Fri 7am–7pm PT› — *observed shortest hold: ‹before 8:30am PT›* |
| **Ask for** | ‹"Billing — high bill investigation"› (their internal term) |
| **Median hold** | ‹~14 min› *(observed over ‹6› prior cases)* |

## 2. They will ask you for — *have these ready*

| They'll ask | Answer |
|---|---|
| Account number | ‹8830-142-297› |
| Name on account | ‹Willy Su› |
| Service address | ‹1042 Alma St, Apt 3B› |
| Date of birth | ‹March 4, 1991› |
| Last 4 of SSN | ‹4471› |

> ⚠️ Verify you dialed the number above before giving any of this out.

## 3. Your opening line

> "Hi — I'm recording this call for my records. I'd like to open a **high bill
> investigation** for account ‹8830-142-297›. My ‹July› bill was ‹$412›, which is
> ‹238%› of my ‹June› bill of ‹$173›, and ‹204%› of what I paid in ‹July of last year›.
> My usage pattern hasn't changed. I'd like to understand the cause and request a
> **meter re-read**."

*Why this works: it names their internal process, gives the specific comparison up front,
and states a concrete remedy — so the rep has something to act on immediately rather than
starting a diagnostic conversation from zero.*

## 4. The evidence you're holding

*Auto-computed from your bill history and the utility data feed:*

| | ‹Jun 2026› | ‹Jul 2026› | ‹Jul 2025› |
|---|---|---|---|
| Amount | ‹$173› | **‹$412›** | ‹$202› |
| kWh | ‹541› | **‹1,284›** | ‹623› |
| Days in period | ‹30› | ‹34› ⚠️ | ‹31› |
| Read type | ‹Actual› | **‹Estimated›** ⚠️ | ‹Actual› |
| Rate plan | ‹E-TOU-C› | ‹E-TOU-C› | ‹E-1› ⚠️ |

**🚩 Three findings to raise, in priority order:**
1. **The July read was *estimated*, not actual** — this alone often explains the spike, and
   it's the strongest single point you have. Lead with it.
2. **The billing period was ‹34› days, not ‹30›** — ‹13%› longer than usual.
3. **You were moved from ‹E-1› to ‹E-TOU-C›** since last summer — a time-of-use plan, so
   last year's July isn't a clean comparison. Ask whether the plan change was opt-in.

## 5. What to ask for — in order

1. ✅ **A meter re-read** *(the estimated read makes this hard to refuse)*
2. ✅ **A written breakdown** of daily usage for the ‹July› period
3. ✅ **Re-bill on the actual read**, if the re-read comes back lower
4. ✅ **A rate-plan analysis** — would ‹E-1› or ‹E-TOU-D› have been cheaper for your usage?
5. ⭕ If the amount stands: **a payment arrangement or budget billing** to smooth it out

## 6. If they push back

| They say | You say |
|---|---|
| *"Estimated reads are normal."* | "Understood — but I'm being billed ‹238%› of normal on an estimate. I'm requesting an actual re-read and a re-bill on the actual figure." |
| *"Usage is usage, nothing we can do."* | "Then I'd like the daily interval data for that period in writing, so I can identify what changed." |
| *"You'd have to submit that in writing."* | "Happy to. What's the exact address or form, and what's your reference number for this call?" |
| *Rep won't help at all* | "I'd like to escalate to a **supervisor**, please." → then: "If this can't be resolved here, my next step is a complaint with the ‹California Public Utilities Commission›. I'd rather resolve it with you." |

**Escalation ladder:** ‹rep → supervisor → Billing Escalations → CPUC complaint (‹1-800-649-7570›)›

## 7. Before you hang up — capture these

- [ ] **Reference / ticket number:** `________________`
- [ ] **Rep name & ID:** `________________`
- [ ] **What they committed to:** `________________`
- [ ] **By when:** `________________`
- [ ] **Callback number if disconnected:** `________________`

---

### 📅 Auto follow-up
If no meter re-read is confirmed by **‹2026-08-11›**, this case reopens and escalates one
rung automatically. You'll get a notification.

---

## Notes on this example

Three things to notice, because they're the real design lessons:

1. **The best part of this script isn't the script — it's §4.** The findings (estimated
   read, longer period, rate-plan change) came from *data analysis*, not from an AI being
   good at talking. That analysis is what turns a weak "my bill seems high" call into a
   strong "your July read was estimated and I want a re-read" call. Per
   [`../docs/03-tool-landscape.md`](../docs/03-tool-landscape.md), much of this is
   available through utility data APIs without contacting anyone.

2. **§7 is where most real-world resolutions are lost.** Without a reference number, the
   next call starts over from zero. Capturing it is trivial engineering and disproportionate
   value.

3. **Nothing here required a phone-calling AI.** The entire artifact is Phase 1. That's the
   argument for the roadmap ordering in one page.
