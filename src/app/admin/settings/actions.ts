"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { SETTINGS_GROUPS, HOME_GROUPS } from "@/lib/collections";
import { parseFields } from "@/components/admin/FieldRenderer";
import { revalidateSite } from "@/lib/content";

export async function saveSettings(formData: FormData) {
  await requireUser();
  const data = parseFields(SETTINGS_GROUPS.flatMap((g) => g.fields), formData);
  await prisma.siteSettings.update({ where: { id: 1 }, data });
  revalidateSite();
  redirect("/admin/settings?saved=1");
}

export async function saveHome(formData: FormData) {
  await requireUser();
  const data = parseFields(HOME_GROUPS.flatMap((g) => g.fields), formData);
  await prisma.homeContent.update({ where: { id: 1 }, data });
  revalidateSite();
  redirect("/admin/home?saved=1");
}
