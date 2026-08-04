# 00 — Idea Brief

## Your idea, restated

People lose a lot of time to *administrative contact work*: calling or messaging the
electricity company, the gas company, the water utility, the apartment complex or
property manager, a hospital's billing department, a health insurance company, a car
insurer. Each interaction is individually small, but they are frequent, unschedulable,
and cognitively annoying — and they pile up.

You want an AI agent that removes that burden. Concretely, in your own example: it's the
end of the month, the electricity bill is unusually high, and you want to ask the utility
why. To do that you need your account ID, your username, your date of birth, the billing
period in question, and the actual comparison numbers — and then you need to survive an
IVR tree and a hold queue before you can say any of it.

The agent should either:
- **produce a script** you can follow, pre-filled with your details, or
- **run the whole interaction itself**, without human intervention, and
- **notify you to step in** when something genuinely needs you.

## Decomposing the burden

The single word "burden" is hiding at least six distinct costs. This matters, because
they have very different difficulty levels and they don't all need the same solution.

| # | Cost | What it actually is | How hard to automate |
|---|---|---|---|
| 1 | **Routing** | Which number? Which department? What are the hours? Which IVR keys? | Easy — it's a lookup problem |
| 2 | **Retrieval** | Account ID, meter number, member ID, policy number, last bill amount | Easy–medium — it's a vault + document-parsing problem |
| 3 | **Framing** | Knowing what to *ask for*, in the words that get results, and what your rights are | Medium — this is where an LLM is genuinely strong |
| 4 | **Waiting** | Hold queues, callback windows, "we'll call you in 3–5 business days" | Medium — solvable, and the single biggest time sink |
| 5 | **Speaking** | Authenticating, navigating the rep, pushing back, escalating | **Hard** — legal + identity walls live here |
| 6 | **Bookkeeping** | Reference number, what was promised, by when, and following up | Easy — and almost universally neglected |

The instinct is to attack #5, because it's the loud one. But #1, #2, #3, #4 and #6 are
**most of the wall-clock time and nearly all of the failure modes**, and they are
dramatically easier. A product that nails those and leaves the human to talk for four
minutes is already a large win.

## The two product modes you described

You actually described two different products, and it's worth naming them separately
because they have different risk profiles:

**Mode A — "Give me a script."**
The agent prepares everything and hands the human a briefing: the number, the IVR path,
the opening sentence, the facts they'll be asked for, the questions to ask, the fallback
if the rep says no, and a place to write down the reference number. The human makes the
call. *Zero legal exposure, immediate value, buildable in weeks.*

**Mode B — "Do it for me."**
The agent contacts the provider itself, authenticates, conducts the interaction, and only
pings the human for a one-time code or a decision that costs money. *This is the ambitious
version and the one with real obstacles.* See [`01-validation.md`](01-validation.md).

Mode A is not a consolation prize for Mode B. It is the on-ramp: the same case file,
playbook, and vault that power Mode A are exactly what Mode B needs. You build Mode A,
you're 60% of the way to Mode B, and you have real users generating the provider
knowledge that Mode B depends on.

## The thing that is actually scarce

Not the AI. Voice agents are a commodity in 2026 — a dozen platforms will let you make an
outbound call with an LLM on the other end in an afternoon.

What's scarce is **the provider playbook**: for Pacific Gas & Electric specifically, what
number reaches a human, which IVR keys skip the menu, what they will ask you to
authenticate, what the actual name of the "high bill investigation" process is, what
they're obligated to offer you, who to escalate to when the first rep says no, and how to
get added as an authorized third party on the account.

That knowledge is fragmented across Reddit threads, forum posts, and people's heads. It
compounds with every case the system runs. **That's the asset.** The AI is the interface
to it.

## Non-goals (for now)

- Not a general-purpose personal assistant.
- Not legal advice, and not marketed as a substitute for a lawyer or a licensed
  advocate — see the DoNotPay precedent in [`01-validation.md`](01-validation.md).
- Not a bill-*negotiation* service on day one (adjacent, proven business, but a different
  operational model — it's a services business with a % fee).
- Not enterprise contact-center software. That market is crowded and well-funded; ours is
  the consumer side of the same phone call.
