import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getCollection } from "@/lib/collections";
import { PageHeader, Flash } from "@/components/admin/PageHeader";
import { Icon } from "@/components/admin/Icon";
import { moveItem, togglePublished } from "./actions";

function cell(v: unknown): string {
  if (v == null || v === "") return "—";
  if (v instanceof Date) return v.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  const s = String(v);
  return s.length > 70 ? s.slice(0, 70) + "…" : s;
}

export default async function CollectionPage({ params, searchParams }: {
  params: Promise<{ collection: string }>; searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
}) {
  await requireUser();
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) notFound();
  const sp = await searchParams;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: Record<string, unknown>[] = await (prisma as any)[c.model].findMany({
    orderBy: c.orderable ? { order: "asc" } : { [c.sortBy?.field ?? "createdAt"]: c.sortBy?.dir ?? "desc" },
  });
  return (
    <>
      <PageHeader title={c.label} description={c.description}
        action={<Link href={`/admin/c/${c.key}/new`} className="btn-primary"><Icon name="plus" className="w-4 h-4" /> New {c.singular.toLowerCase()}</Link>} />
      <Flash searchParams={sp} />
      <div className="card overflow-hidden">
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">Nothing here yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                {c.orderable && <th className="px-3 py-2 w-20">Order</th>}
                {c.listColumns.map((col) => <th key={col} className="px-3 py-2">{c.fields.find((f) => f.name === col)?.label ?? col}</th>)}
                {c.publishable && <th className="px-3 py-2 w-28">Status</th>}
                <th className="px-3 py-2 w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((it, i) => (
                <tr key={String(it.id)} className="hover:bg-orange-50/40">
                  {c.orderable && (
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-0.5">
                        <form action={moveItem.bind(null, c.key, String(it.id), "up")}><button disabled={i === 0} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30" title="Move up"><Icon name="up" className="w-4 h-4" /></button></form>
                        <form action={moveItem.bind(null, c.key, String(it.id), "down")}><button disabled={i === items.length - 1} className="p-1 rounded hover:bg-gray-200 disabled:opacity-30" title="Move down"><Icon name="down" className="w-4 h-4" /></button></form>
                      </div>
                    </td>
                  )}
                  {c.listColumns.map((col, j) => (
                    <td key={col} className={`px-3 py-2 ${j === 0 ? "font-medium text-gray-900" : "text-gray-600"}`}>
                      {j === 0 ? <Link href={`/admin/c/${c.key}/${it.id}`} className="hover:text-brand-700">{cell(it[col])}</Link> : cell(it[col])}
                    </td>
                  ))}
                  {c.publishable && (
                    <td className="px-3 py-2">
                      <form action={togglePublished.bind(null, c.key, String(it.id), !it.published)}>
                        <button className={`text-xs font-medium rounded-full px-2 py-0.5 ${it.published ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`} title="Click to toggle">
                          {it.published ? "Published" : "Draft"}
                        </button>
                      </form>
                    </td>
                  )}
                  <td className="px-3 py-2 text-right">
                    <Link href={`/admin/c/${c.key}/${it.id}`} className="text-brand-700 font-medium hover:underline">Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
