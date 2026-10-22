# Feel at Home in Boston

_Working title._ A guide for newcomers to Boston organised around **how you want to live**, not a checklist of things to look up.

## The thesis

Every "moving to Boston" site is a checklist: best neighborhoods, top 10 restaurants, how to get a Charlie Card. Item by item. This site rejects that, because the items aren't independent.

Someone who wants to disappear into a walkable neighborhood and know their bartender lives a completely different Boston than someone optimising a Cambridge lab commute and a Saturday hike two hours north. So the atomic unit isn't "apartment" or "food" — it's a **mode of living** that determines all of them at once.

The deeper goal isn't information transfer. It took the creator four years to feel at home here. The product's real job is to **manufacture the conditions for "home" to happen faster than four years**.

**Design consequence:** a feature that only transfers information is low priority. A feature that nudges behavior — that gets someone to show up somewhere twice — is the whole point.

## Structure

**Mode → the seven needs.** Pick a mode and the entire site reconfigures around it.

The seven needs: housing, commute & driving, friends, food, play, weekends, career (secondary).

Two get special treatment:

- **Driving is a fork, not a category.** In most cities car ownership is a utility question; here it reshapes rent, neighborhood, weekends and social circle. It is the first question the mode selector asks, and it renders as a fork rather than an ordinary question.
- **Friends is behavior, not information.** No listicle solves it and it's the reason people leave. That's what `/rhythm` is for.

## Routes

| Route | What it is |
|---|---|
| `/` | Landing. The thesis in one line, one CTA. |
| `/mode` | Mode selector — four questions, the car question first. Skippable. |
| `/mode/[slug]` | Result page: the seven needs, neighborhoods and rhythms tuned to the mode. |
| `/need/[slug]` | Deep dive per need, switchable by mode. |
| `/rhythm` | The behavioral heart: recurring things filtered by mode + neighborhood, with the show-up-twice mechanic. |
| `/about` | The four-years story. |

## Editing the content

**All content lives in `src/content/` as JSON and markdown. None of it is hardcoded in components.** That is deliberate — the real content comes from lived experience, and editing it should not require touching code.

```
src/content/
  modes.json                      the four archetypes, incl. a one-line summary per need
  neighborhoods.json              blurbs + walkability / car-friendliness ratings
  needs.json                      the seven needs and their order
  rhythms.json                    recurring things to show up to
  quiz.json                       the mode selector questions and their mode weights
  about.md                        the /about story
  need-content/<need>/<mode>.md   the long-form writing, one file per (need, mode)
```

To add a mode: add an entry to `modes.json` with a `needSummaries` key for every need id, then optionally add `need-content/<need>/<new-mode>.md` files. Nothing else needs to change — the routes, the quiz scoring and the filters all read from data.

To deepen a need: create `src/content/need-content/<needId>/<modeId>.md` with frontmatter `tips: []` and a markdown body, then flip that need's `depth` to `"v1"` in `needs.json`. The mode result page starts linking to it.

Types are in `src/lib/types.ts`; the loaders are in `src/lib/content.ts`.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind v4 · `marked` + `gray-matter` for content. No database, no auth, no backend. Mode choice and visit counts live in `localStorage`.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npx eslint .
```

## Status

Built through phase 4 of the plan, then deliberately stopped for a human reaction.

**Done**

- Scaffold and all routes
- Data-driven mode system; the selector, the scoring and the result page all read from `src/content`
- Full per-mode writing for **housing**, **commute & driving** and **friends** — 12 essays
- `/rhythm` with mode + neighborhood filtering and the show-up-twice tracker

**Not done, on purpose**

- Food, play, weekends and career have a one-line summary per mode but no long-form writing
- User accounts, UGC, reviews, maps integrations, SEO work

**Needs a human before this goes near a real audience**

- **The rhythms are seeded categories, not verified listings.** Each describes a kind of recurring thing that reliably exists in Greater Boston, but times, prices and specific venues are unchecked. They render with an "unverified seed entry" caveat and every entry carries `verified: false`. Flip it to `true` once confirmed.
- Anything price-, fee- or law-related in the need essays is written to be checked rather than quoted. Broker fee rules in particular changed recently.

## Open questions

The decisions this build couldn't make:

1. **What actually tipped it to "home" after four years?** The four modes in `modes.json` are placeholders until this is answered — the real set should come from that experience, and it drives the whole `/rhythm` surface.
2. **Who is this for** — brand-new arrivals, or people a year in who still feel like they're performing?
3. **Passion project, or something meant to grow?** Changes how much to invest in accounts, UGC and SEO.
4. **Career: in or out?** Currently modelled as `optional: true` and treated as secondary.
