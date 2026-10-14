import Link from "next/link";
import { getUpcomingEvents } from "@/lib/content";

export const metadata = { title: "Events" };

const fmt = (d: Date) => d.toLocaleString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export default async function EventsPage() {
  const all = await getUpcomingEvents();
  const now = new Date();
  const upcoming = all.filter((e) => e.startsAt >= now).reverse();
  const past = all.filter((e) => e.startsAt < now);
  const List = ({ items }: { items: typeof all }) => (
    <ul className="space-y-4">
      {items.map((e) => (
        <li key={e.id}><Link href={`/events/${e.slug}`} className="card flex gap-5 p-5 hover:border-brand-300 transition">
          <div className="w-20 shrink-0 rounded-xl bg-brand-100 text-brand-800 flex flex-col items-center justify-center py-3"><span className="text-3xl font-extrabold leading-none">{e.startsAt.getDate()}</span><span className="text-xs font-semibold uppercase">{e.startsAt.toLocaleString("en-GB", { month: "short" })}</span><span className="text-[10px] text-gray-600">{e.startsAt.getFullYear()}</span></div>
          <div><h2 className="text-lg font-bold text-gray-900">{e.title}</h2><p className="text-sm text-gray-500">{fmt(e.startsAt)} · {e.location}</p><p className="mt-1 text-sm text-gray-600 line-clamp-2">{e.summary}</p></div>
        </Link></li>
      ))}
    </ul>
  );
  return (
    <main className="mx-auto max-w-4xl px-4 md:px-8 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Learning sessions & events</h1>
      <p className="mt-2 text-gray-600">Spaces where ideas, confidence, and opportunity meet.</p>
      <h2 className="mt-10 mb-4 text-xl font-bold text-gray-900">Upcoming</h2>
      {upcoming.length ? <List items={upcoming} /> : <p className="text-gray-500">No upcoming events yet. Follow us on social media for announcements.</p>}
      {past.length > 0 && <><h2 className="mt-12 mb-4 text-xl font-bold text-gray-900">Past events</h2><List items={past} /></>}
    </main>
  );
}
