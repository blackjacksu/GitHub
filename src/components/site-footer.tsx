import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-md">
          A work in progress. It took four years to feel at home here; this is an
          attempt to make it take less.
        </p>
        <div className="flex gap-5">
          <Link href="/mode" className="hover:text-brick">
            Modes
          </Link>
          <Link href="/rhythm" className="hover:text-brick">
            Rhythms
          </Link>
          <Link href="/about" className="hover:text-brick">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
