# Customer Support Agent (working codename: **Holdline**)

An AI agent that takes the burden of dealing with customer support off a person's
plate — electricity and gas utilities, apartment complexes, health insurance,
car insurance, hospital billing, and the long tail of miscellaneous admin.

> **Status:** Idea stage. Nothing is built yet. This directory is the thinking,
> the validation, and the plan. Read the docs in order.

## The one-paragraph version

Dealing with a utility or an insurer costs a person 30–90 minutes of calendar-shredding
effort: finding the right number, guessing the IVR path, waiting on hold, digging up an
account number, being asked for a date of birth they have to look up, getting transferred,
then having no record of what was agreed. Almost none of that is *thinking* — it's
retrieval, waiting, and bookkeeping. Holdline turns each of these into a **case**: it
assembles the facts, produces a ready-to-use call script, holds the line, and keeps the
receipt — escalating to the human only at the moments that genuinely require a human.

## Read in this order

| Doc | What's in it |
|---|---|
| [`docs/00-idea-brief.md`](docs/00-idea-brief.md) | The idea restated cleanly, with the problem decomposed |
| [`docs/01-validation.md`](docs/01-validation.md) | **Is this valid?** Honest verdict, evidence, and where the idea breaks |
| [`docs/02-requirements.md`](docs/02-requirements.md) | What has to be true for this to work — functional, data, legal |
| [`docs/03-tool-landscape.md`](docs/03-tool-landscape.md) | What already exists that we can build on, and what we'd have to build |
| [`docs/04-architecture.md`](docs/04-architecture.md) | System design and the core data model |
| [`docs/05-roadmap.md`](docs/05-roadmap.md) | The executable plan — phases, MVP scope, success metrics |
| [`docs/06-open-questions.md`](docs/06-open-questions.md) | Decisions that need your input |
| [`examples/electricity-high-bill.md`](examples/electricity-high-bill.md) | A concrete sample output, using your own example |
| [`examples/case-schema.yaml`](examples/case-schema.yaml) | The machine-readable shape of a case |

## The headline conclusion

**The problem is real and the idea is valid — but the version you described
("an AI that calls customer support for you, no human intervention") is the
*third* thing to build, not the first.**

Fully autonomous outbound calling runs into four walls at once: AI-disclosure
laws, call-recording consent, provider authentication rules that require the
*account holder*, and the fact that handing an AI your SSN and date of birth is
a serious custody problem. All four are solvable, but not on day one.

The sequence that works:

```
1. SCRIPT      Prepare the human perfectly.        ← ship first, legally trivial, useful immediately
2. CO-PILOT    Sit on the call with the human.     ← the real "wow", still clean
3. HOLD & HAND Wait on hold, hand over a human.    ← highest value per unit of risk
4. DELEGATE    Act as an authorized agent.         ← the original vision, provider by provider
```

See [`docs/01-validation.md`](docs/01-validation.md) for why, and
[`docs/05-roadmap.md`](docs/05-roadmap.md) for how.
