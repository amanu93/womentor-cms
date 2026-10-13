import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getCollection } from "@/lib/collections";
import { PageHeader, Flash } from "@/components/admin/PageHeader";
import { FieldRenderer } from "@/components/admin/FieldRenderer";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { saveItem, deleteItem } from "../actions";

export default async function EditPage({ params, searchParams }: {
  params: Promise<{ collection: string; id: string }>; searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireUser();
  const { collection, id } = await params;
  const c = getCollection(collection);
  if (!c) notFound();
  const isNew = id === "new";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item: Record<string, unknown> | null = isNew ? null : await (prisma as any)[c.model].findUnique({ where: { id } });
  if (!isNew && !item) notFound();
  const sp = await searchParams;
  const publicUrl = item && typeof item.slug === "string" ? (c.key === "posts" ? `/news/${item.slug}` : c.key === "events" ? `/events/${item.slug}` : null) : null;

  return (
    <>
      <PageHeader back={{ href: `/admin/c/${c.key}`, label: c.label }}
        title={isNew ? `New ${c.singular.toLowerCase()}` : `Edit ${c.singular.toLowerCase()}`}
        action={publicUrl && item?.published ? <a href={publicUrl} target="_blank" className="btn-secondary">View on site ↗</a> : undefined} />
      <Flash searchParams={sp} />
      <form action={saveItem.bind(null, c.key, isNew ? null : id)} className="card p-6 space-y-5">
        {c.fields.map((f) => <FieldRenderer key={f.name} field={f} value={item?.[f.name] ?? (f.type === "boolean" ? true : f.type === "select" ? f.options?.[0]?.value : "")} />)}
        <div className="flex items-center justify-between border-t pt-4">
          <button className="btn-primary">Save</button>
          {!isNew && <DeleteButton action={deleteItem.bind(null, c.key, id)} label={c.singular} />}
        </div>
      </form>
    </>
  );
}
