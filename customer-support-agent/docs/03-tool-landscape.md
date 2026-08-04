# 03 — Tool Landscape (as of August 2026)

What exists that we can build on, what we have to build ourselves, and who's already
nearby in the market.

---

## 1. Voice agent platforms — solved, commoditized, pick one later

This layer is **not** where the work is. Four credible options, all of which will place an
outbound call with an LLM on the line:

| Platform | Shape | Best for | Rough cost |
|---|---|---|---|
| **Vapi** | Orchestration middleware — bring your own LLM / TTS / STT / telephony | Max control; MVPs | ~$0.05–0.10/min |
| **Retell AI** | Managed stack, strong latency, visual builder, built-in compliance features | Fastest good-quality start | ~$0.07–0.12/min |
| **Bland AI** | API-first, built for high-volume outbound | Scale outbound; not our shape yet | Custom |
| **LiveKit Agents** | Open-source realtime framework, self-hostable | HIPAA/self-hosting; deep control | Infra cost only |

Notes that matter for us:
- Tuned stacks (Deepgram + a small fast LLM + ElevenLabs Flash on Vapi) reach ~500–700ms
  median latency; Retell's managed stack is ~600–620ms out of the box.
- **LiveKit is the one to keep in mind for the health-insurance use case** — self-hosting
  is the clean answer to HIPAA-adjacent audio.
- Telephony underneath is Twilio/Telnyx/Vonage regardless.

**Recommendation:** don't choose yet. This decision belongs to Phase 3. Choosing early is
a classic way to burn two weeks on the least differentiated part of the system.

## 2. The reasoning layer

Claude (Opus 5 / Sonnet 5) via the Anthropic API for intake, case planning, script
generation, document parsing, and reply drafting. Sonnet-class for the high-volume parsing
paths, Opus-class for planning and escalation strategy. Prompt caching on the provider
playbook content matters once volume is real.

For voice, the LLM in the loop needs to be fast more than smart — the *plan* is computed
before the call; the in-call model executes it.

## 3. Data channels that skip the phone entirely

**This is the most under-appreciated part of the landscape.** For several of your target
verticals, the information the user wants can be fetched without contacting anyone.

### Utilities (electricity, gas)
- **Bayou Energy** — instant electricity/gas data, ~66% of US meters, roadmap to ~78%
- **Arcadia** — claims ~95% of US utility accounts, plus international
- **UtilityAPI** — bill, meter, interval and authorization data; Green Button XML export
- **Green Button Connect My Data (CMD)** — the standard OAuth-style consumer authorization
  flow; several utilities support it directly

Implication for your own example: **"why is my electricity so high this month?" is often
answerable without calling anyone at all.** Pull 13 months of interval data, compare
usage against degree-days, check for a rate-plan change or an estimated read, and you can
frequently hand the user the answer — or, far better, hand them a call script that already
contains the answer and demands a specific remedy. That's a dramatically stronger opening
than "I think my bill is high."

### Health insurance / medical billing
- Eligibility and benefits are a standardized EDI transaction (270/271); modern API
  wrappers over it exist (Stedi, Availity and similar clearinghouses)
- Claims/EOB access via consumer-permissioned health data APIs (e.g. Flexpa) and payer
  FHIR endpoints mandated by CMS interoperability rules
- **Caveat:** this vertical carries the heaviest compliance load. High value, do it later.

### Everything else (apartment complexes, small insurers, hospital billing)
No APIs. Portal, email, or phone. This is the long tail and it's where voice earns its keep.

## 4. What we have to build ourselves

Nothing off-the-shelf covers these — which is precisely why the project is interesting:

1. **The Provider Playbook database** — IVR maps, escalation ladders, authorized-agent
   processes, per-provider issue taxonomy. Seeded manually, grown by every case run.
2. **The Case File engine** — intake → plan → execute → follow up → receipt.
3. **The consent/authorization ledger** and the per-field PII release gate.
4. **The redaction boundary** — placeholder-in / substitute-at-delivery, so secrets never
   touch a model or a stored transcript.
5. **The co-pilot UX** — live call assist is a genuinely novel interface and there's no
   good consumer product for it.

## 5. Who's already nearby

- **GetHuman** — long-standing directory of contact numbers and IVR shortcuts. Proof the
  routing problem is real; scope is far narrower than this.
- **BillShark / Rocket Money** — bill negotiation, 35–60% of first-year savings, 2–4 week
  turnaround, operates via a signed customer authorization. **The closest working
  precedent for the delegated model** — study their authorization flow specifically.
- **DoNotPay** — the cautionary tale, not the competitor. See
  [`01-validation.md`](01-validation.md).
- **Medical bill / claim-denial appeal tools** — the highest-willingness-to-pay adjacent
  category; several entrants.
- **Enterprise voice AI (Retell, Vapi, PolyAI, Lorikeet, Fin, Open.cx)** — building the
  *other* side of the call. Not competitors; eventually counterparties.

**Nobody credible is holding the consumer's end of the phone yet.** That's the opening.

## 6. Suggested stack for Phase 1

Chosen for speed to a working thing, and because these are already wired into your
environment:

```
Frontend / API   Next.js on Vercel
Data + Auth      Supabase (Postgres, row-level security, encrypted columns, storage)
Reasoning        Anthropic API — Sonnet 5 for parsing, Opus 5 for planning
Docs / OCR       Claude vision for bill + EOB parsing
Voice            deferred to Phase 3
Utility data     Bayou or UtilityAPI, once one vertical is proven
```

Phase 1 needs no telephony, no browser automation, and no compliance review. That's the
point.

---

## Sources

- [12 Voice Agent Platforms Compared in 2026 — Softcery](https://softcery.com/lab/choosing-the-right-voice-agent-platform-in-2026)
- [Retell vs Vapi vs LiveKit: The Voice AI Shootout for 2026](https://amjid.au/insights/retell-vs-vapi-vs-livekit-the-voice-ai-shootout/)
- [AI Voice Agent Platform Comparison 2026 — open.cx](https://www.open.cx/blog/ai-voice-agent-platform-comparison-2026)
- [Bayou vs Arcadia: Utility API Comparison](https://blog.bayou.energy/utility-api-bayou-vs-arcadia/)
- [UtilityAPI — Green Button docs](https://utilityapi.com/docs/greenbutton)
- [Bayou Energy](https://www.bayou.energy/)
- [Compare BillShark vs Rocket Money — CB Insights](https://www.cbinsights.com/compare/billshark-vs-truebill)
