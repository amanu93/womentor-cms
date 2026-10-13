import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });
  const subs = await prisma.waitlistSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  const csv = ["email,role,created_at", ...subs.map((s) => `${s.email},${s.role},${s.createdAt.toISOString()}`)].join("\n");
  return new Response(csv, { headers: { "content-type": "text/csv", "content-disposition": "attachment; filename=waitlist.csv" } });
}
