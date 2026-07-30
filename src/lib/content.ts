/**
 * Content access layer. Server-only.
 *
 * Everything the site says lives in src/content as JSON or markdown, never in
 * a component. The point is that the person with the lived experience can edit
 * the guide without touching code.
 *
 *   src/content/modes.json                     the four archetypes
 *   src/content/neighborhoods.json             where they live
 *   src/content/needs.json                     the seven needs
 *   src/content/rhythms.json                   recurring things to show up to
 *   src/content/quiz.json                      the mode selector
 *   src/content/need-content/<need>/<mode>.md  the deep per-mode writing
 */

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

import modesData from "@/content/modes.json";
import neighborhoodsData from "@/content/neighborhoods.json";
import needsData from "@/content/needs.json";
import rhythmsData from "@/content/rhythms.json";
import quizData from "@/content/quiz.json";

import type {
  Mode,
  Need,
  NeedContent,
  Neighborhood,
  QuizQuestion,
  Rhythm,
} from "./types";

const CONTENT_DIR = path.join(process.cwd(), "src", "content");
const NEED_CONTENT_DIR = path.join(CONTENT_DIR, "need-content");

// JSON imports widen to structural types with optional keys, so these go
// through `unknown`. The shape is enforced by the types in ./types.ts and by
// the loaders below, not by the compiler reading the literals.
export const modes = modesData as unknown as Mode[];
export const neighborhoods = neighborhoodsData as unknown as Neighborhood[];
export const rhythms = rhythmsData as unknown as Rhythm[];
export const quiz = quizData as unknown as QuizQuestion[];
export const needs = (needsData as unknown as Need[])
  .slice()
  .sort((a, b) => a.order - b.order);

export function getMode(id: string): Mode | undefined {
  return modes.find((m) => m.id === id);
}

export function getNeed(id: string): Need | undefined {
  return needs.find((n) => n.id === id);
}

export function getNeighborhood(id: string): Neighborhood | undefined {
  return neighborhoods.find((n) => n.id === id);
}

export function getRhythm(id: string): Rhythm | undefined {
  return rhythms.find((r) => r.id === id);
}

/** Neighborhoods a mode recommends, in the mode's own ranked order. */
export function neighborhoodsForMode(mode: Mode): Neighborhood[] {
  return mode.neighborhoodIds
    .map(getNeighborhood)
    .filter((n): n is Neighborhood => Boolean(n));
}

/** Rhythms a mode recommends, in the mode's own order. */
export function rhythmsForMode(mode: Mode): Rhythm[] {
  return mode.rhythmIds
    .map(getRhythm)
    .filter((r): r is Rhythm => Boolean(r));
}

/**
 * The written body for one (need, mode) pair, or null when it has not been
 * written yet. Only the v1 needs — housing, commute, friends — have bodies;
 * the rest fall back to the mode's one-line summary.
 */
export function getNeedContent(
  needId: string,
  modeId: string,
): NeedContent | null {
  const file = path.join(NEED_CONTENT_DIR, needId, `${modeId}.md`);
  if (!fs.existsSync(file)) return null;

  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const tips = Array.isArray(data.tips) ? (data.tips as string[]) : [];

  return { needId, modeId, body: content.trim(), tips };
}

/** Which modes have a written body for this need. Used to gate deep-dive links. */
export function modesWithContent(needId: string): Mode[] {
  return modes.filter((m) => getNeedContent(needId, m.id) !== null);
}

/**
 * Markdown -> HTML for locally authored, trusted content only. Never pass
 * anything user-submitted through here; there is no sanitiser in this path.
 */
export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false });
}

export const carDefaultLabel: Record<Mode["carDefault"], string> = {
  yes: "Yes, get a car",
  no: "No car",
  either: "A car is optional",
};

export const weekendRadiusLabel: Record<Mode["weekendRadius"], string> = {
  small: "Small — the neighborhood",
  medium: "Medium — a day's drive and back",
  large: "Large — two hours out and a night away",
};
