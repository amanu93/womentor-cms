"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getCollection } from "@/lib/collections";
import { parseFields } from "@/components/admin/FieldRenderer";
import { revalidateSite } from "@/lib/content";
import { slugify } from "@/lib/slug";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function delegate(model: string): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (prisma as any)[model];
}

export async function saveItem(collectionKey: string, id: string | null, formData: FormData) {
  await requireUser();
  const c = getCollection(collectionKey);
  if (!c) throw new Error("Unknown collection");
  const data = parseFields(c.fields, formData);

  const slugField = c.fields.find((f) => f.type === "slug");
  if (slugField) {
    const fromValue = slugField.from ? String(data[slugField.from] ?? "") : "";
    let slug = String(data[slugField.name] || slugify(fromValue)) || `item-${Date.now()}`;
    // ensure uniqueness
    let i = 2;
    while (await delegate(c.model).findFirst({ where: { slug, ...(id ? { NOT: { id } } : {}) } })) slug = `${slugify(fromValue) || "item"}-${i++}`;
    data[slugField.name] = slug;
  }
  if (c.key === "posts" && data.published && !data.publishedAt) data.publishedAt = new Date();

  let saved;
  try {
    if (id) {
      saved = await delegate(c.model).update({ where: { id }, data });
    } else {
      const max = c.orderable ? await delegate(c.model).aggregate({ _max: { order: true } }) : null;
      saved = await delegate(c.model).create({ data: { ...data, order: (max?._max?.order ?? -1) + 1 } });
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message.split("\n").pop() : "Save failed";
    redirect(`/admin/c/${c.key}/${id ?? "new"}?error=${encodeURIComponent(msg ?? "Save failed")}`);
  }
  revalidateSite();
  redirect(`/admin/c/${c.key}/${saved.id}?saved=1`);
}

export async function deleteItem(collectionKey: string, id: string) {
  await requireUser();
  const c = getCollection(collectionKey);
  if (!c) throw new Error("Unknown collection");
  await delegate(c.model).delete({ where: { id } });
  revalidateSite();
  redirect(`/admin/c/${c.key}?deleted=1`);
}

export async function moveItem(collectionKey: string, id: string, direction: "up" | "down") {
  await requireUser();
  const c = getCollection(collectionKey);
  if (!c || !c.orderable) throw new Error("Not orderable");
  const d = delegate(c.model);
  const items: { id: string; order: number }[] = await d.findMany({ orderBy: { order: "asc" }, select: { id: true, order: true } });
  const idx = items.findIndex((i) => i.id === id);
  const swap = direction === "up" ? idx - 1 : idx + 1;
  if (idx < 0 || swap < 0 || swap >= items.length) return;
  // Normalise orders to 0..n-1 then swap the two.
  const ordered = items.map((it, i) => ({ id: it.id, order: i }));
  [ordered[idx].order, ordered[swap].order] = [ordered[swap].order, ordered[idx].order];
  await prisma.$transaction(ordered.map((it) => d.update({ where: { id: it.id }, data: { order: it.order } })));
  revalidateSite();
}

export async function togglePublished(collectionKey: string, id: string, published: boolean) {
  await requireUser();
  const c = getCollection(collectionKey);
  if (!c || !c.publishable) throw new Error("Not publishable");
  await delegate(c.model).update({ where: { id }, data: { published } });
  revalidateSite();
}
