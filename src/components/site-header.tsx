import Link from "next/link";

const links = [
  { href: "/mode", label: "Find your mode" },
  { href: "/rhythm", label: "Rhythms" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-4">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-lg font-semibold tracking-tight">
            Feel at Home
          </span>
          <span className="text-xs uppercase tracking-[0.18em] text-muted">
            Boston
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted transition-colors hover:text-brick"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
