import Image from "next/image";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/content";

export const metadata = { title: "News & stories" };

export default async function NewsPage() {
  const posts = await getPublishedPosts();
  return (
    <main className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900">News & stories</h1>
      <p className="mt-2 text-gray-600">Updates, events and stories from the Womentor Africa community.</p>
      {posts.length === 0 ? <p className="mt-10 text-gray-500">No stories published yet. Check back soon.</p> : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.id} href={`/news/${p.slug}`} className="card overflow-hidden hover:border-brand-300 hover:shadow transition">
              <div className="relative aspect-[16/9] bg-brand-100">{p.coverImage && <Image src={p.coverImage} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 33vw" />}</div>
              <div className="p-5">
                <p className="text-xs text-gray-500">{p.publishedAt?.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}{p.author && ` · ${p.author}`}</p>
                <h2 className="mt-1 text-lg font-bold text-gray-900">{p.title}</h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
