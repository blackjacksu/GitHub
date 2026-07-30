import type { Metadata } from "next";
import { ModeSelector } from "@/components/mode-selector";
import { modes, quiz } from "@/lib/content";
import { Container, Eyebrow, PageTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Find your mode",
  description:
    "Four questions. The first one is whether you'll have a car, because in Boston that decides most of the rest.",
};

export default function ModePage() {
  const cards = modes.map(({ id, name, tagline, description, homeSource }) => ({
    id,
    name,
    tagline,
    description,
    homeSource,
  }));

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>Mode selector</Eyebrow>
        <PageTitle>Four questions, then your Boston.</PageTitle>
        <p className="mt-4 text-lg leading-relaxed text-muted">
          There are no wrong answers and this isn&rsquo;t a personality test.
          It&rsquo;s a way of choosing which set of trade-offs you&rsquo;d rather
          make — because you are going to make one set or another whether you
          choose it or not.
        </p>
      </div>

      <div className="mt-12">
        <ModeSelector quiz={quiz} modes={cards} />
      </div>
    </Container>
  );
}
