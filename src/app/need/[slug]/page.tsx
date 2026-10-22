import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  getMode,
  getNeed,
  getNeedContent,
  modes,
  modesWithContent,
  needs,
  renderMarkdown,
} from "@/lib/content";
import {
  Card,
  Container,
  Eyebrow,
  PageTitle,
  SectionTitle,
} from "@/components/ui";

export function generateStaticParams() {
  return needs.map((need) => ({ slug: need.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const need = getNeed(slug);
  if (!need) return {};
  return { title: need.name, description: need.question };
}

export default async function NeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode?: string }>;
}) {
  const { slug } = await params;
  const { mode: modeParam } = await searchParams;

  const need = getNeed(slug);
  if (!need) notFound();

  const written = modesWithContent(need.id);
  const activeMode =
    (modeParam ? getMode(modeParam) : undefined) ?? written[0] ?? undefined;
  const content = activeMode ? getNeedContent(need.id, activeMode.id) : null;

  return (
    <>
      <section className="border-b border-line bg-sunken">
        <Container className="py-12 sm:py-16">
          <Eyebrow>Need {String(need.order).padStart(2, "0")}</Eyebrow>
          <PageTitle>{need.name}</PageTitle>
          <p className="mt-3 text-lg text-muted">{need.question}</p>

          {written.length > 0 && (
            <div className="mt-8">
              <p className="text-sm text-muted">
                This reads completely differently depending on how you want to
                live. Pick a mode:
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {written.map((mode) => {
                  const active = activeMode?.id === mode.id;
                  return (
                    <Link
                      key={mode.id}
                      href={`/need/${need.id}?mode=${mode.id}`}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                        active
                          ? "border-brick bg-brick text-white"
                          : "border-line text-muted hover:border-brick hover:text-brick"
                      }`}
                    >
                      {mode.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </Container>
      </section>

      <Container className="py-14">
        {content && activeMode ? (
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <article className="max-w-2xl">
              <p className="text-sm text-muted">
                Written for{" "}
                <Link
                  href={`/mode/${activeMode.id}`}
                  className="font-medium text-brick underline underline-offset-4"
                >
                  {activeMode.name}
                </Link>{" "}
                — {activeMode.tagline.toLowerCase()}
              </p>
              <div
                className="prose mt-6"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content.body) }}
              />
            </article>

            <aside className="lg:pt-14">
              {content.tips.length > 0 && (
                <Card>
                  <h2 className="font-serif text-lg font-semibold tracking-tight">
                    If you read nothing else
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {content.tips.map((tip) => (
                      <li key={tip} className="flex gap-3 text-sm leading-relaxed">
                        <span aria-hidden className="text-brick">
                          —
                        </span>
                        <span className="text-muted">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              )}

              {need.id === "friends" && (
                <Card className="mt-4">
                  <h2 className="font-serif text-lg font-semibold tracking-tight">
                    Then do the thing
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Reading about this is the easy part. Pick two recurring
                    things and commit to going twice.
                  </p>
                  <Link
                    href={`/rhythm?mode=${activeMode.id}`}
                    className="mt-4 inline-flex rounded-lg bg-brick px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Open Rhythms
                  </Link>
                </Card>
              )}
            </aside>
          </div>
        ) : (
          <div className="max-w-2xl">
            <SectionTitle>Not written yet</SectionTitle>
            <p className="mt-4 leading-relaxed text-muted">
              Housing, commute and friends are written in full for all four
              modes. This one is summarised on each mode page for now — the plan
              is to get a reaction to the first three before expanding.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {modes.map((mode) => (
                <Card key={mode.id}>
                  <p className="font-medium">{mode.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {mode.needSummaries[need.id] ?? "—"}
                  </p>
                  <Link
                    href={`/mode/${mode.id}`}
                    className="mt-3 inline-block text-sm text-brick underline underline-offset-4"
                  >
                    See this mode
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </>
  );
}
