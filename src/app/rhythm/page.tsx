import type { Metadata } from "next";
import { RhythmBoard } from "@/components/rhythm-board";
import { getMode, modes, neighborhoods, rhythms } from "@/lib/content";
import { Container, Eyebrow, PageTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Rhythms",
  description:
    "Recurring things to show up to in Boston, filtered by how you want to live — and a nudge to go back a second time.",
};

export default async function RhythmPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode: modeParam } = await searchParams;
  const initialMode = modeParam && getMode(modeParam) ? modeParam : null;

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>The behavioral bit</Eyebrow>
        <PageTitle>Things to show up to. Twice.</PageTitle>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
          <p>
            Friends is the need no listicle solves, and it&rsquo;s the reason
            people leave Boston. It isn&rsquo;t an information problem. Adult
            friendship needs repeated, unplanned contact with the same people,
            and adult life supplies almost none of it — so it has to be built on
            purpose.
          </p>
          <p>
            Everything below is a thing that recurs. The specific activity
            matters much less than the fact that the same faces come back.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <RhythmBoard
          rhythms={rhythms}
          modes={modes.map(({ id, name, homeSource }) => ({
            id,
            name,
            homeSource,
          }))}
          neighborhoods={neighborhoods.map(({ id, name }) => ({ id, name }))}
          initialMode={initialMode}
        />
      </div>

      <div className="mt-14 max-w-2xl rounded-xl border border-line bg-sunken p-6">
        <h2 className="font-serif text-lg font-semibold tracking-tight">
          About this list
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          These are seeded categories, not endorsements of specific venues.
          Every entry describes a kind of recurring thing that reliably exists in
          Greater Boston; the named times, prices and locations still need to be
          checked by a human before this goes anywhere near a real audience.
          That&rsquo;s what the caveat on each card means.
        </p>
      </div>
    </Container>
  );
}
