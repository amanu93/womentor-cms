"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";

export async function markRead(id: string, read: boolean) {
  await requireUser();
  await prisma.contactMessage.update({ where: { id }, data: { read } });
  revalidatePath("/admin/inbox/messages");
}
export async function deleteMessage(id: string) {
  await requireUser();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/inbox/messages");
}
export async function deleteSubscriber(id: string) {
  await requireUser();
  await prisma.waitlistSubscriber.delete({ where: { id } });
  revalidatePath("/admin/inbox/waitlist");
}
