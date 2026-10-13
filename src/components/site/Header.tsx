"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/admin/Icon";

const SECTIONS = [
  { id: "home", label: "Home" }, { id: "about", label: "About" }, { id: "mentorship", label: "Mentorship" },
  { id: "community", label: "Community" }, { id: "contact", label: "Contact Us" },
];

export function Header({ logoUrl, siteName, appUrl, loginLabel, showNews, showEvents }: {
  logoUrl: string; siteName: string; appUrl: string; loginLabel: string; showNews: boolean; showEvents: boolean;
}) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useEffect(() => {
    if (!onHome) return;
    const onScroll = () => {
      let current = "home";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= 120) current = s.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome]);

  const links = [
    ...SECTIONS.map((s) => ({ href: onHome ? `#${s.id}` : `/#${s.id}`, label: s.label, active: onHome && active === s.id })),
    ...(showNews ? [{ href: "/news", label: "News", active: pathname.startsWith("/news") }] : []),
    ...(showEvents ? [{ href: "/events", label: "Events", active: pathname.startsWith("/events") }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-orange-100">
      <div className="mx-auto max-w-7xl px-4 md:px-8 h-20 md:h-24 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logoUrl} alt={siteName} width={48} height={48} className="w-10 h-10 md:w-12 md:h-12" priority />
          <span className="text-xl md:text-2xl font-extrabold tracking-wide text-brand-600" style={{ fontFamily: "var(--font-montserrat)" }}>{siteName.toUpperCase().replace(" AFRICA", "")}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={`text-sm lg:text-base text-brand-700 hover:text-brand-800 transition ${l.active ? "font-extrabold" : "font-semibold"}`}>{l.label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={appUrl} className="hidden md:inline-flex rounded-lg border border-black px-5 py-2 text-sm font-semibold text-[#101828] hover:bg-orange-50 transition">{loginLabel}</a>
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="md:hidden p-2 text-brand-700"><Icon name={open ? "x" : "menu"} className="w-7 h-7" /></button>
        </div>
      </div>
      {open && (
        <div className="md:hidden absolute inset-x-0 top-20 bg-orange-50 border-t border-orange-200 shadow-lg">
          <nav className="flex flex-col p-4 gap-1">
            {links.map((l) => <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg text-brand-700 font-semibold hover:bg-orange-100">{l.label}</Link>)}
            <a href={appUrl} className="mt-2 rounded-lg border border-black px-5 py-2 text-center font-semibold text-[#101828]">{loginLabel}</a>
          </nav>
        </div>
      )}
    </header>
  );
}
