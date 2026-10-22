import Link from "next/link";
import { modes, needs } from "@/lib/content";
import {
  ButtonLink,
  Card,
  Container,
  Eyebrow,
  SectionTitle,
} from "@/components/ui";

export default function Home() {
  return (
    <>
      <section className="border-b border-line bg-sunken">
        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <Eyebrow>A guide for people who just got here</Eyebrow>
            <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
              Every other guide gives you a checklist. The items aren&rsquo;t
              independent.
            </h1>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                Someone who wants to disappear into a walkable neighborhood and
                know their bartender lives a completely different Boston than
                someone optimising a Cambridge commute and a Saturday hike two
                hours north. Same city. Almost no overlap.
              </p>
              <p>
                So the unit here isn&rsquo;t &ldquo;apartment&rdquo; or
                &ldquo;food.&rdquo; It&rsquo;s a{" "}
                <strong className="font-semibold text-foreground">
                  mode of living
                </strong>
                . Pick yours, and where you live, whether you drive, how far you
                go on a Saturday, and where you&rsquo;d plausibly meet people all
                fall out of it together.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/mode">Find your Boston</ButtonLink>
              <ButtonLink href="/about" variant="ghost">
                Why this exists
              </ButtonLink>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <SectionTitle>Four ways to live here</SectionTitle>
        <p className="mt-3 max-w-2xl text-muted">
          Start with the one that sounds like the life you want, not the one that
          sounds like the person you currently are.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {modes.map((mode) => (
            <Link key={mode.id} href={`/mode/${mode.id}`} className="group">
              <Card className="h-full transition group-hover:border-brick">
                <h3 className="font-serif text-xl font-semibold tracking-tight">
                  {mode.name}
                </h3>
                <p className="mt-1 text-sm text-brick">{mode.tagline}</p>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-muted">
                  {mode.description}
                </p>
                <p className="mt-4 text-sm font-medium text-muted group-hover:text-brick">
                  Home comes from: {mode.homeSource}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </Container>

      <Container className="pb-16">
        <div className="rounded-xl border border-line bg-surface p-6 sm:p-8">
          <SectionTitle>The seven needs</SectionTitle>
          <p className="mt-3 max-w-2xl text-muted">
            Every mode answers all seven. Two of them get special treatment,
            because Boston makes them special.
          </p>
          <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {needs.map((need) => (
              <li
                key={need.id}
                className="flex items-baseline gap-3 border-t border-line pt-3"
              >
                <span className="font-serif text-sm text-brick">
                  {String(need.order).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-medium">
                    {need.name}
                    {need.optional && (
                      <span className="ml-2 text-xs text-muted">secondary</span>
                    )}
                  </p>
                  <p className="text-sm text-muted">{need.question}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-sunken p-4">
              <p className="text-sm font-semibold">
                Driving is a fork, not a category.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                In most cities car ownership is a utility question. Here it
                reshapes your rent, your neighborhood, your weekends and your
                social circle. So it&rsquo;s the first question the mode selector
                asks.
              </p>
            </div>
            <div className="rounded-lg border border-line bg-sunken p-4">
              <p className="text-sm font-semibold">
                Friends is behavior, not information.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                No listicle solves it, and it&rsquo;s the reason people leave.
                That&rsquo;s what{" "}
                <Link href="/rhythm" className="text-brick underline">
                  Rhythms
                </Link>{" "}
                is for — recurring things to show up to, and a nudge to go back a
                second time.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
