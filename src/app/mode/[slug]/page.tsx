import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  carDefaultLabel,
  getMode,
  modes,
  needs,
  neighborhoodsForMode,
  rhythmsForMode,
  weekendRadiusLabel,
} from "@/lib/content";
import { RememberMode } from "@/components/remember-mode";
import {
  Card,
  Container,
  Eyebrow,
  FactRow,
  PageTitle,
  Pill,
  SectionTitle,
} from "@/components/ui";

export function generateStaticParams() {
  return modes.map((mode) => ({ slug: mode.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const mode = getMode(slug);
  if (!mode) return {};
  return {
    title: mode.name,
    description: `${mode.tagline} ${mode.description.slice(0, 140)}`,
  };
}

export default async function ModeResultPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mode = getMode(slug);
  if (!mode) notFound();

  const hoods = neighborhoodsForMode(mode);
  const modeRhythms = rhythmsForMode(mode);

  return (
    <>
      <RememberMode modeId={mode.id} />

      <section className="border-b border-line bg-sunken">
        <Container className="py-14 sm:py-20">
          <div className="max-w-2xl">
            <Eyebrow>Your mode</Eyebrow>
            <PageTitle>{mode.name}</PageTitle>
            <p className="mt-2 text-lg text-brick">{mode.tagline}</p>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              {mode.description}
            </p>
          </div>

          <dl className="mt-10 max-w-2xl">
            <FactRow label="The car question" value={carDefaultLabel[mode.carDefault]} />
            <FactRow
              label="Weekend radius"
              value={weekendRadiusLabel[mode.weekendRadius]}
            />
            <FactRow label="Home comes from" value={mode.homeSource} />
          </dl>

          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            {modes
              .filter((m) => m.id !== mode.id)
              .map((m) => (
                <Link
                  key={m.id}
                  href={`/mode/${m.id}`}
                  className="rounded-full border border-line px-3 py-1 text-muted transition hover:border-brick hover:text-brick"
                >
                  Try {m.name}
                </Link>
              ))}
          </div>
        </Container>
      </section>

      <Container className="py-14">
        <SectionTitle>Your Boston, across the seven needs</SectionTitle>
        <p className="mt-3 max-w-2xl text-muted">
          Three of these are written out in full for every mode. The rest are
          summarised here and will be written next — see the note at the bottom.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {needs.map((need) => {
            const summary = mode.needSummaries[need.id];
            const deep = need.depth === "v1";

            return (
              <Card key={need.id} className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-semibold tracking-tight">
                      {need.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted">{need.question}</p>
                  </div>
                  {deep ? (
                    <Pill tone="brick">Written</Pill>
                  ) : (
                    <Pill>Summary</Pill>
                  )}
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
                  {summary ?? "Not written for this mode yet."}
                </p>

                {deep && (
                  <Link
                    href={`/need/${need.id}?mode=${mode.id}`}
                    className="mt-4 text-sm font-medium text-brick underline underline-offset-4"
                  >
                    Read the full {need.name.toLowerCase()} guide
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      </Container>

      <Container className="pb-14">
        <SectionTitle>Where you&rsquo;d live</SectionTitle>
        <p className="mt-3 max-w-2xl text-muted">
          Ranked for this mode, best first. These are starting points for
          walking around on a Tuesday evening, not a verdict.
        </p>

        <ol className="mt-8 grid gap-4 sm:grid-cols-2">
          {hoods.map((hood, index) => (
            <li key={hood.id}>
              <Card className="h-full">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-sm text-brick">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-lg font-semibold tracking-tight">
                    {hood.name}
                  </h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {hood.blurb}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Pill>Walkability {hood.walkability}/5</Pill>
                  <Pill>Car-friendly {hood.carFriendliness}/5</Pill>
                </div>
              </Card>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="pb-20">
        <div className="rounded-xl border border-brick/35 bg-bricksoft p-6 sm:p-8">
          <Eyebrow>The part that actually matters</Eyebrow>
          <SectionTitle>Three things to show up to</SectionTitle>
          <p className="mt-3 max-w-2xl text-muted">
            Information doesn&rsquo;t make a city feel like home; repetition
            does. Pick two of these, go four times each, and don&rsquo;t evaluate
            before the fourth visit.
          </p>

          <ul className="mt-6 grid gap-3 sm:grid-cols-3">
            {modeRhythms.slice(0, 3).map((rhythm) => (
              <li
                key={rhythm.id}
                className="rounded-lg border border-line bg-surface p-4"
              >
                <p className="font-medium">{rhythm.name}</p>
                <p className="mt-1 text-xs text-muted">
                  {rhythm.cadence} · {rhythm.when}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {rhythm.showUpNudge}
                </p>
              </li>
            ))}
          </ul>

          <Link
            href={`/rhythm?mode=${mode.id}`}
            className="mt-6 inline-flex rounded-lg bg-brick px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            All rhythms for {mode.name}
          </Link>
        </div>

        <p className="mt-8 max-w-2xl text-sm text-muted">
          Food, play, weekends and career are summarised above but not yet
          written in full. That&rsquo;s deliberate — the plan is to stop here and
          react to what&rsquo;s working before expanding to all seven.
        </p>
      </Container>
    </>
  );
}
