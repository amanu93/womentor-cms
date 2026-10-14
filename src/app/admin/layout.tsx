import type { Metadata } from "next";
import { headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { COLLECTIONS } from "@/lib/collections";
import { Sidebar, type NavGroup } from "@/components/admin/Sidebar";

export const metadata: Metadata = { title: { default: "Womentor CMS", template: "%s · Womentor CMS" } };
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  // The login page shares this layout but has no user.
  if (!user) return <>{children}</>;
  void headers;

  const [unreadMessages, waitlist] = await Promise.all([
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.waitlistSubscriber.count(),
  ]);

  const groups: NavGroup[] = [
    { title: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: "dashboard" }] },
    { title: "Site", items: [
      { href: "/admin/home", label: "Home page text", icon: "home" },
      { href: "/admin/settings", label: "Settings & contact", icon: "settings" },
    ]},
    { title: "Home page sections", items: COLLECTIONS.filter((c) => c.group === "Home page sections").map((c) => ({ href: `/admin/c/${c.key}`, label: c.label, icon: c.icon })) },
    { title: "Content", items: [
      ...COLLECTIONS.filter((c) => c.group === "Content").map((c) => ({ href: `/admin/c/${c.key}`, label: c.label, icon: c.icon })),
      { href: "/admin/media", label: "Media library", icon: "media" },
    ]},
    { title: "Inbox", items: [
      { href: "/admin/inbox/messages", label: "Messages", icon: "mail", badge: unreadMessages },
      { href: "/admin/inbox/waitlist", label: "Waitlist", icon: "inbox", badge: waitlist },
    ]},
  ];
  if (user.role === "ADMIN") groups.push({ title: "Administration", items: [{ href: "/admin/users", label: "Users", icon: "users" }] });

  return (
    <div className="min-h-screen bg-gray-50 md:flex">
      <Sidebar groups={groups} user={user} />
      <main className="flex-1 min-w-0">
        <div className="mx-auto max-w-5xl px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
