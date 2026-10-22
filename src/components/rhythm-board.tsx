"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Mode, Neighborhood, Rhythm } from "@/lib/types";
import { clearVisit, logVisit, useSavedMode, useVisits } from "@/lib/mode-storage";

type ModeStub = Pick<Mode, "id" | "name" | "homeSource">;
type HoodStub = Pick<Neighborhood, "id" | "name">;

const ALL = "all";

export function RhythmBoard({
  rhythms,
  modes,
  neighborhoods,
  initialMode,
}: {
  rhythms: Rhythm[];
  modes: ModeStub[];
  neighborhoods: HoodStub[];
  initialMode: string | null;
}) {
  // Mode precedence: an explicit pick on this page, then the ?mode= that got
  // you here, then whatever you chose last time, then everything.
  const [picked, setPicked] = useState<string | null>(null);
  const [hoodId, setHoodId] = useState<string>(ALL);
  const savedMode = useSavedMode();
  const visits = useVisits();

  const modeId = picked ?? initialMode ?? savedMode ?? ALL;

  const visible = useMemo(() => {
    return rhythms.filter((rhythm) => {
      const modeOk = modeId === ALL || rhythm.goodForModes.includes(modeId);
      const hoodOk =
        hoodId === ALL ||
        rhythm.neighborhood === "citywide" ||
        rhythm.neighborhood === hoodId;
      return modeOk && hoodOk;
    });
  }, [rhythms, modeId, hoodId]);

  const committed = Object.values(visits).filter((n) => n >= 1).length;
  const twice = Object.values(visits).filter((n) => n >= 2).length;

  const activeMode = modes.find((m) => m.id === modeId);

  return (
    <div>
      <div className="rounded-xl border border-brick/35 bg-bricksoft p-5 sm:p-6">
        <p className="font-serif text-lg font-semibold tracking-tight">
          {twice >= 2
            ? "Two things, twice each. That's the whole mechanic — keep going."
            : twice === 1
              ? "One thing twice. Pick a second and do the same."
              : committed > 0
                ? "You went once. The second visit is the one that counts."
                : "Pick two. Go four times each. Don't evaluate before the fourth."}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Visit one, nobody remembers you. Visit two, one or two people register
          that they&rsquo;ve seen you — and this is where almost everyone quits.
          Visit three, someone says hello first. Track it here; nothing leaves
          your browser.
        </p>
        {committed > 0 && (
          <p className="mt-3 text-sm font-medium">
            {committed} started · {twice} at two visits
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-wrap gap-4">
          <Filter
            label="Mode"
            value={modeId}
            onChange={setPicked}
            options={[
              { value: ALL, label: "Any mode" },
              ...modes.map((m) => ({ value: m.id, label: m.name })),
            ]}
          />
          <Filter
            label="Neighborhood"
            value={hoodId}
            onChange={setHoodId}
            options={[
              { value: ALL, label: "Anywhere" },
              ...neighborhoods.map((n) => ({ value: n.id, label: n.name })),
            ]}
          />
        </div>
        <p className="text-sm text-muted">
          {visible.length} {visible.length === 1 ? "rhythm" : "rhythms"}
          {activeMode ? ` for ${activeMode.name}` : ""}
        </p>
      </div>

      {activeMode && (
        <p className="mt-4 text-sm text-muted">
          For {activeMode.name}, home comes from{" "}
          <span className="text-foreground">
            {activeMode.homeSource.toLowerCase()}
          </span>
          . These are the things that build it.
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((rhythm) => (
          <RhythmCard
            key={rhythm.id}
            rhythm={rhythm}
            neighborhoodName={
              neighborhoods.find((n) => n.id === rhythm.neighborhood)?.name ??
              "Citywide"
            }
            visits={visits[rhythm.id] ?? 0}
            onVisit={() => logVisit(rhythm.id)}
            onReset={() => clearVisit(rhythm.id)}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-muted">
          Nothing seeded for that combination yet.{" "}
          <button
            type="button"
            onClick={() => {
              setPicked(ALL);
              setHoodId(ALL);
            }}
            className="text-brick underline underline-offset-4"
          >
            Clear the filters
          </button>
          .
        </p>
      )}
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-xs uppercase tracking-[0.14em] text-muted">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-lg border border-line bg-surface px-3 py-2 text-sm"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function RhythmCard({
  rhythm,
  neighborhoodName,
  visits,
  onVisit,
  onReset,
}: {
  rhythm: Rhythm;
  neighborhoodName: string;
  visits: number;
  onVisit: () => void;
  onReset: () => void;
}) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-serif text-lg font-semibold leading-snug tracking-tight">
          {rhythm.name}
        </h3>
        {visits >= 2 && (
          <span className="shrink-0 rounded-full border border-brick/35 bg-bricksoft px-2.5 py-0.5 text-xs font-medium text-brick">
            Twice
          </span>
        )}
      </div>

      <p className="mt-1.5 text-xs text-muted">
        {neighborhoodName} · {rhythm.cadence} · {rhythm.when} · {rhythm.cost}
      </p>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
        {rhythm.blurb}
      </p>

      <div className="mt-4 rounded-lg border border-line bg-sunken p-3">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-brick">
          The nudge
        </p>
        <p className="mt-1.5 text-sm leading-relaxed">{rhythm.showUpNudge}</p>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5" aria-hidden>
          {[0, 1].map((index) => (
            <span
              key={index}
              className={`h-2 w-6 rounded-full ${
                visits > index ? "bg-brick" : "bg-line"
              }`}
            />
          ))}
          <span className="ml-1 text-xs text-muted">
            {visits === 0
              ? "not yet"
              : visits === 1
                ? "went once"
                : "went twice"}
          </span>
        </div>

        {visits >= 2 ? (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-muted underline underline-offset-4 hover:text-brick"
          >
            Reset
          </button>
        ) : (
          <button
            type="button"
            onClick={onVisit}
            className="rounded-lg border border-brick px-3 py-1.5 text-xs font-medium text-brick transition hover:bg-brick hover:text-white"
          >
            {visits === 0 ? "I went" : "I went back"}
          </button>
        )}
      </div>

      {!rhythm.verified && (
        <p className="mt-3 text-xs text-muted">
          <span title="Seed entry — specifics not yet checked by a human">
            Unverified seed entry
          </span>
          {rhythm.link && (
            <>
              {" · "}
              <Link href={rhythm.link} className="text-brick underline">
                Source
              </Link>
            </>
          )}
        </p>
      )}
    </article>
  );
}
