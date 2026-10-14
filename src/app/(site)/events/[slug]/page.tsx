import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";

const fmt = (d: Date) => d.toLocaleString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await prisma.event.findUnique({ where: { slug } });
  return { title: e?.title ?? "Event", description: e?.summary };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = await prisma.event.findUnique({ where: { slug } });
  if (!e || !e.published) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-12 md:py-16">
      <Link href="/events" className="text-sm text-brand-700 hover:underline">← All events</Link>
      <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">{e.title}</h1>
      <div className="mt-4 card p-4 text-sm text-gray-700 space-y-1">
        <p><span className="font-semibold">When:</span> {fmt(e.startsAt)}{e.endsAt && ` – ${fmt(e.endsAt)}`}</p>
        <p><span className="font-semibold">Where:</span> {e.location}</p>
        {e.registerUrl && <a href={e.registerUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-2">Register</a>}
      </div>
      {e.coverImage && <div className="relative mt-8 aspect-[16/9] rounded-2xl overflow-hidden"><Image src={e.coverImage} alt="" fill className="object-cover" sizes="768px" priority /></div>}
      {e.summary && <p className="mt-8 text-lg text-gray-700 font-medium">{e.summary}</p>}
      <article className="prose-site mt-6 text-base md:text-lg" dangerouslySetInnerHTML={{ __html: renderMarkdown(e.body) }} />
    </main>
  );
}
