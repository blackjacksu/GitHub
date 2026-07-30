import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import matter from "gray-matter";

import { renderMarkdown } from "@/lib/content";
import { ButtonLink, Container, Eyebrow } from "@/components/ui";

export const metadata: Metadata = {
  title: "About",
  description:
    "It took four years to feel at home in Boston. This is an attempt to make it take less.",
};

function loadAbout() {
  const file = path.join(process.cwd(), "src", "content", "about.md");
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    pullQuote: typeof data.pullQuote === "string" ? data.pullQuote : "",
    body: content.trim(),
  };
}

export default function AboutPage() {
  const { pullQuote, body } = loadAbout();

  return (
    <Container className="py-14 sm:py-20">
      <div className="max-w-2xl">
        <Eyebrow>About</Eyebrow>
        {pullQuote && (
          <p className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {pullQuote}
          </p>
        )}
        <div
          className="prose mt-10"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
        />

        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonLink href="/mode">Find your mode</ButtonLink>
          <ButtonLink href="/rhythm" variant="ghost">
            Go to Rhythms
          </ButtonLink>
        </div>
      </div>
    </Container>
  );
}
