/**
 * Domain types for the guide.
 *
 * The spine of the product is Mode -> the seven needs. A Mode is an archetype of
 * how someone wants to live in Boston; picking one reconfigures every need at
 * once. Everything here is deliberately flat so the content can live in
 * editable data files rather than in code.
 */

/** Whether a mode assumes car ownership. Driving is a fork, not a category. */
export type CarDefault = "yes" | "no" | "either";

/** How far someone in this mode travels on a free Saturday. */
export type WeekendRadius = "small" | "medium" | "large";

export interface Mode {
  id: string;
  name: string;
  tagline: string;
  /** A paragraph in the second person: what this life actually feels like. */
  description: string;
  carDefault: CarDefault;
  weekendRadius: WeekendRadius;
  /** Where the feeling of "home" comes from for this mode. */
  homeSource: string;
  /** Neighborhood ids, ranked best-first. */
  neighborhoodIds: string[];
  /** Rhythm ids this mode should be nudged toward. */
  rhythmIds: string[];
  /**
   * One or two sentences per need, keyed by need id. Every mode answers all
   * seven needs here; the needs marked `depth: "v1"` additionally have a full
   * body in src/content/need-content/.
   */
  needSummaries: Record<string, string>;
}

export interface Neighborhood {
  id: string;
  name: string;
  blurb: string;
  /** 1 (need a car for milk) to 5 (everything within ten minutes on foot). */
  walkability: number;
  /** 1 (parking is a second job) to 5 (you will find a spot). */
  carFriendliness: number;
  goodForModes: string[];
}

export interface Need {
  id: string;
  name: string;
  order: number;
  /** Career is real but usually solved before arrival, so it is secondary. */
  optional: boolean;
  /** The question a newcomer is actually asking. */
  question: string;
  /** "v1" needs have full per-mode bodies written; "later" have summaries only. */
  depth: "v1" | "later";
}

export interface NeedContent {
  needId: string;
  modeId: string;
  /** Markdown. Authored in src/content/need-content/<needId>/<modeId>.md */
  body: string;
  tips: string[];
}

export type RhythmType =
  | "trivia"
  | "sport"
  | "run"
  | "market"
  | "club"
  | "class"
  | "volunteer"
  | "music";

export type Cadence = "weekly" | "biweekly" | "monthly" | "seasonal";

/**
 * The behavioral unit of the product. A Rhythm is a recurring thing you can
 * show up to. Information transfer is not the point; showing up twice is.
 */
export interface Rhythm {
  id: string;
  name: string;
  type: RhythmType;
  /** A neighborhood id, or "citywide" for things that move around. */
  neighborhood: string;
  cadence: Cadence;
  /** Human-readable, e.g. "Free" or "Cost of a drink". */
  cost: string;
  /** e.g. "Wednesday mornings". Kept loose on purpose. */
  when: string;
  cost_note?: string;
  goodForModes: string[];
  blurb: string;
  /** The second-visit prompt. This is the whole mechanic. */
  showUpNudge: string;
  /**
   * false = seeded by the build, details not confirmed by a human. Rendered
   * with a visible caveat so nothing unverified reads as fact.
   */
  verified: boolean;
  link?: string;
}

export interface QuizOption {
  label: string;
  /** Mode id -> points. */
  weights: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  /** The car question renders as a fork rather than an ordinary question. */
  fork?: boolean;
  note?: string;
  options: QuizOption[];
}
