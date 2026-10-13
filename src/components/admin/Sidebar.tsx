"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./Icon";

export type NavItem = { href: string; label: string; icon: string; badge?: number };
export type NavGroup = { title: string; items: NavItem[] };

export function Sidebar({ groups, user }: { groups: NavGroup[]; user: { name: string; email: string; role: string } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {groups.map((g) => (
        <div key={g.title}>
          <p className="px-3 mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">{g.title}</p>
          <ul className="space-y-0.5">
            {g.items.map((it) => {
              const active = it.href === "/admin" ? pathname === "/admin" : pathname.startsWith(it.href);
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                      active ? "bg-brand-600 text-white font-semibold" : "text-gray-700 hover:bg-orange-50 hover:text-brand-700"
                    }`}
                  >
                    <Icon name={it.icon} className="w-4.5 h-4.5" />
                    <span className="flex-1">{it.label}</span>
                    {it.badge ? (
                      <span className={`text-[11px] rounded-full px-1.5 py-0.5 ${active ? "bg-white/20" : "bg-brand-100 text-brand-700"}`}>{it.badge}</span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
  return (
    <>
      <header className="md:hidden sticky top-0 z-30 flex items-center justify-between bg-white border-b px-4 h-14">
        <Link href="/admin" className="flex items-center gap-2 font-extrabold text-brand-600">
          <Image src="/images/logos/womentorIcon.svg" alt="" width={28} height={28} /> WOMENTOR CMS
        </Link>
        <button onClick={() => setOpen(!open)} aria-label="Menu" className="p-2 rounded-lg hover:bg-gray-100">
          <Icon name={open ? "x" : "menu"} />
        </button>
      </header>
      <aside className={`${open ? "flex" : "hidden"} md:flex fixed md:sticky top-14 md:top-0 inset-x-0 md:inset-auto z-20 h-[calc(100vh-3.5rem)] md:h-screen w-full md:w-64 shrink-0 flex-col bg-white border-r border-gray-200`}>
        <div className="hidden md:flex items-center gap-3 px-5 h-16 border-b">
          <Image src="/images/logos/womentorIcon.svg" alt="" width={32} height={32} />
          <div className="leading-tight">
            <p className="font-extrabold text-brand-600">WOMENTOR</p>
            <p className="text-[11px] text-gray-500">Content Management</p>
          </div>
        </div>
        {nav}
        <div className="border-t px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">{user.name.slice(0, 1).toUpperCase()}</div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-[11px] text-gray-500 truncate">{user.role.toLowerCase()} · {user.email}</p>
          </div>
          <form action="/admin/logout" method="post">
            <button title="Sign out" className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"><Icon name="logout" className="w-4 h-4" /></button>
          </form>
        </div>
      </aside>
    </>
  );
}
