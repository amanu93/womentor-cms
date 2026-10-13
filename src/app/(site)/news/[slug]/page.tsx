import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { renderMarkdown } from "@/lib/markdown";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.post.findUnique({ where: { slug } });
  return { title: p?.title ?? "News", description: p?.excerpt };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await prisma.post.findUnique({ where: { slug } });
  if (!p || !p.published) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 md:px-8 py-12 md:py-16">
      <Link href="/news" className="text-sm text-brand-700 hover:underline">← All news</Link>
      <h1 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">{p.title}</h1>
      <p className="mt-2 text-sm text-gray-500">{p.publishedAt?.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}{p.author && ` · ${p.author}`}</p>
      {p.coverImage && <div className="relative mt-8 aspect-[16/9] rounded-2xl overflow-hidden"><Image src={p.coverImage} alt="" fill className="object-cover" sizes="768px" priority /></div>}
      {p.excerpt && <p className="mt-8 text-lg text-gray-700 font-medium">{p.excerpt}</p>}
      <article className="prose-site mt-6 text-base md:text-lg" dangerouslySetInnerHTML={{ __html: renderMarkdown(p.body) }} />
    </main>
  );
}
