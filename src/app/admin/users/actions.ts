"use server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdmin, hashPassword } from "@/lib/auth";

export async function createUser(formData: FormData) {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "EDITOR") === "ADMIN" ? "ADMIN" : "EDITOR";
  if (!email || !name || password.length < 8) redirect("/admin/users?error=" + encodeURIComponent("Name, email and a password of at least 8 characters are required."));
  if (await prisma.user.findUnique({ where: { email } })) redirect("/admin/users?error=" + encodeURIComponent("A user with that email already exists."));
  await prisma.user.create({ data: { email, name, role, passwordHash: await hashPassword(password) } });
  redirect("/admin/users?saved=1");
}

export async function resetPassword(id: string, formData: FormData) {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) redirect("/admin/users?error=" + encodeURIComponent("Password must be at least 8 characters."));
  await prisma.user.update({ where: { id }, data: { passwordHash: await hashPassword(password) } });
  await prisma.session.deleteMany({ where: { userId: id } });
  redirect("/admin/users?saved=1");
}

export async function setRole(id: string, role: string) {
  const me = await requireAdmin();
  if (me.id === id) redirect("/admin/users?error=" + encodeURIComponent("You cannot change your own role."));
  await prisma.user.update({ where: { id }, data: { role: role === "ADMIN" ? "ADMIN" : "EDITOR" } });
  redirect("/admin/users?saved=1");
}

export async function deleteUser(id: string) {
  const me = await requireAdmin();
  if (me.id === id) redirect("/admin/users?error=" + encodeURIComponent("You cannot delete yourself."));
  await prisma.user.delete({ where: { id } });
  redirect("/admin/users?deleted=1");
}
