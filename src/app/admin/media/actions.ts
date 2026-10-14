"use server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { UPLOAD_DIR } from "@/lib/uploads";

export async function deleteMedia(id: string) {
  await requireUser();
  const m = await prisma.media.findUnique({ where: { id } });
  if (!m) return;
  await prisma.media.delete({ where: { id } });
  if (m.url.startsWith("/uploads/")) {
    try { await unlink(path.join(UPLOAD_DIR, path.basename(m.url))); } catch { /* already gone */ }
  }
  revalidatePath("/admin/media");
}
