"use client";

import { useSyncExternalStore } from "react";

/**
 * The only client-side state in v1. No accounts, no backend — the chosen mode
 * and the show-up-twice counts live in localStorage so the site can remember
 * you between visits without asking for anything.
 *
 * localStorage is an external store, so it is read through
 * useSyncExternalStore rather than copied into state in an effect. Snapshots
 * are cached by raw string so repeated reads return a stable reference.
 */

const MODE_KEY = "fah.mode";
const VISITS_KEY = "fah.visits";

/** Fired on write so components in other trees re-read without a router hop. */
const CHANGE_EVENT = "fah:storage";

/** rhythmId -> number of times the user has said "I went". */
export type VisitLog = Record<string, number>;

const EMPTY_VISITS: VisitLog = {};

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener(CHANGE_EVENT, emit);
    window.addEventListener("storage", emit);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener(CHANGE_EVENT, emit);
      window.removeEventListener("storage", emit);
    }
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* Private browsing, quota, or a disabled store. Not worth surfacing. */
  }
}

/* ---------------------------------------------------------------- mode --- */

function modeSnapshot(): string | null {
  const raw = readRaw(MODE_KEY);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "string" ? parsed : null;
  } catch {
    return null;
  }
}

function modeServerSnapshot(): string | null {
  return null;
}

export function useSavedMode(): string | null {
  return useSyncExternalStore(subscribe, modeSnapshot, modeServerSnapshot);
}

export function saveMode(modeId: string) {
  write(MODE_KEY, modeId);
}

/* -------------------------------------------------------------- visits --- */

let cachedVisitsRaw: string | null = null;
let cachedVisits: VisitLog = EMPTY_VISITS;

function visitsSnapshot(): VisitLog {
  const raw = readRaw(VISITS_KEY);
  if (raw === cachedVisitsRaw) return cachedVisits;

  cachedVisitsRaw = raw;
  if (!raw) {
    cachedVisits = EMPTY_VISITS;
    return cachedVisits;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    cachedVisits =
      parsed && typeof parsed === "object" ? (parsed as VisitLog) : EMPTY_VISITS;
  } catch {
    cachedVisits = EMPTY_VISITS;
  }
  return cachedVisits;
}

function visitsServerSnapshot(): VisitLog {
  return EMPTY_VISITS;
}

export function useVisits(): VisitLog {
  return useSyncExternalStore(subscribe, visitsSnapshot, visitsServerSnapshot);
}

/** Counts one visit. Caps at 2 — twice is the goal, not a streak counter. */
export function logVisit(rhythmId: string) {
  const visits = visitsSnapshot();
  write(VISITS_KEY, {
    ...visits,
    [rhythmId]: Math.min((visits[rhythmId] ?? 0) + 1, 2),
  });
}

export function clearVisit(rhythmId: string) {
  const visits = { ...visitsSnapshot() };
  delete visits[rhythmId];
  write(VISITS_KEY, visits);
}
