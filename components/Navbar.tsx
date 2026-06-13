"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { ACCENT } from "@/lib/brand";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/hyperscalers", label: "Hyperscalers" },
  { href: "/certifications", label: "Certifications" },
  { href: "/training", label: "Training" },
  { href: "/news", label: "News" },
  { href: "/compare", label: "Compare" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-white/10 bg-base-900/80 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="section-pad flex h-16 items-center justify-between">
        <Link href="/" className="group flex items-center gap-2.5">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg border text-sm font-bold"
            style={{
              borderColor: "rgba(0,212,255,0.4)",
              color: ACCENT,
              boxShadow: "0 0 18px rgba(0,212,255,0.25)",
            }}
          >
            ⬡
          </span>
          <span className="font-heading text-[15px] font-semibold tracking-tight text-ink-100">
            Agentic<span className="text-accent">HyperScalers</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-lg px-3 py-2 font-body text-sm transition-colors duration-300 ${
                    active
                      ? "text-ink-100"
                      : "text-ink-300 hover:text-ink-100"
                  }`}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute inset-x-3 -bottom-[1px] h-[2px] rounded-full"
                      style={{
                        background: ACCENT,
                        boxShadow: "0 0 10px 1px rgba(0,212,255,0.7)",
                      }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <Link
          href="/compare"
          className="pill-btn hidden border-accent/40 text-accent hover:bg-accent/10 md:inline-flex"
          style={{ boxShadow: "0 0 18px rgba(0,212,255,0.15)" }}
        >
          Compare all 4 →
        </Link>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 text-ink-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-white/10 bg-base-900/95 backdrop-blur-xl md:hidden">
          <ul className="section-pad flex flex-col gap-1 py-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-lg px-3 py-2.5 font-body text-sm ${
                    isActive(link.href)
                      ? "bg-white/5 text-accent"
                      : "text-ink-300"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
