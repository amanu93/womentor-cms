import { z } from "zod";
import { prisma } from "@/lib/db";
import { json, options } from "@/lib/cors";

const Body = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  website: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "Name, email and message are required." }, { status: 400 });
  const { website, ...data } = parsed.data;
  if (website) return json({ ok: true }); // bot filled the honeypot; pretend success
  await prisma.contactMessage.create({ data });
  return json({ ok: true });
}
export const OPTIONS = options;
