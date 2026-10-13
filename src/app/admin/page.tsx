import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { COLLECTIONS } from "@/lib/collections";
import { PageHeader } from "@/components/admin/PageHeader";
import { Icon } from "@/components/admin/Icon";

export const metadata = { title: "Dashboard" };

export default async function Dashboard({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser();
  const { error } = await searchParams;
  const counts = await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    COLLECTIONS.map(async (c) => ({ c, n: (await (prisma as any)[c.model].count()) as number })),
  );
  const [messages, waitlist, recentMessages, recentWaitlist, settings] = await Promise.all([
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.waitlistSubscriber.count(),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.waitlistSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } }),
  ]);

  return (
    <>
      <PageHeader title={`Welcome back, ${user.name.split(" ")[0]}`} description="Manage everything that appears on womentorafrica.com."
        action={<a href="/" target="_blank" className="btn-secondary"><Icon name="external" className="w-4 h-4" /> View site</a>} />
      {error === "forbidden" && <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-800">You need the admin role for that page.</div>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Stat label="Unread messages" value={messages} href="/admin/inbox/messages" icon="mail" />
        <Stat label="Waitlist signups" value={waitlist} href="/admin/inbox/waitlist" icon="inbox" />
        <Stat label="Mentee signup" value={settings.menteeSignup ? "Open" : settings.menteeWaitlist ? "Waitlist" : "Closed"} href="/admin/settings#signup-availability" icon="users" />
        <Stat label="Mentor signup" value={settings.mentorSignup ? "Open" : settings.mentorWaitlist ? "Waitlist" : "Closed"} href="/admin/settings#signup-availability" icon="users" />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Edit the site</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card href="/admin/home" icon="home" title="Home page text" sub="Hero, intros, banners, popup" />
        <Card href="/admin/settings" icon="settings" title="Settings & contact" sub="Address, emails, socials, signup" />
        {counts.map(({ c, n }) => <Card key={c.key} href={`/admin/c/${c.key}`} icon={c.icon} title={c.label} sub={`${n} item${n === 1 ? "" : "s"}`} />)}
        <Card href="/admin/media" icon="media" title="Media library" sub="Upload images" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <div className="flex items-center justify-between px-5 py-3 border-b"><h3 className="font-semibold">Latest messages</h3><Link href="/admin/inbox/messages" className="text-sm text-brand-700">All</Link></div>
          <ul className="divide-y">
            {recentMessages.length === 0 && <li className="px-5 py-4 text-sm text-gray-500">No messages yet.</li>}
            {recentMessages.map((m) => (
              <li key={m.id} className="px-5 py-3 text-sm">
                <p className={`truncate ${m.read ? "text-gray-700" : "font-semibold text-gray-900"}`}>{m.subject || m.message.slice(0, 60)}</p>
                <p className="text-xs text-gray-500">{m.name} · {m.email}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <div className="flex items-center justify-between px-5 py-3 border-b"><h3 className="font-semibold">Latest waitlist signups</h3><Link href="/admin/inbox/waitlist" className="text-sm text-brand-700">All</Link></div>
          <ul className="divide-y">
            {recentWaitlist.length === 0 && <li className="px-5 py-4 text-sm text-gray-500">No signups yet.</li>}
            {recentWaitlist.map((w) => (
              <li key={w.id} className="px-5 py-3 text-sm flex justify-between"><span className="text-gray-900">{w.email}</span><span className="text-xs rounded-full bg-brand-100 text-brand-700 px-2 py-0.5 capitalize">{w.role}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, href, icon }: { label: string; value: number | string; href: string; icon: string }) {
  return (
    <Link href={href} className="card p-4 flex items-center gap-3 hover:border-brand-300 transition">
      <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center"><Icon name={icon} /></div>
      <div><p className="text-xl font-bold text-gray-900">{value}</p><p className="text-xs text-gray-500">{label}</p></div>
    </Link>
  );
}
function Card({ href, icon, title, sub }: { href: string; icon: string; title: string; sub: string }) {
  return (
    <Link href={href} className="card p-4 flex items-center gap-3 hover:border-brand-300 hover:shadow transition">
      <div className="w-9 h-9 rounded-lg bg-orange-50 text-brand-600 flex items-center justify-center"><Icon name={icon} className="w-4.5 h-4.5" /></div>
      <div className="min-w-0"><p className="font-medium text-gray-900 truncate">{title}</p><p className="text-xs text-gray-500">{sub}</p></div>
    </Link>
  );
}
