import { z } from "zod";
import { prisma } from "@/lib/db";
import { json, options } from "@/lib/cors";

const Body = z.object({ email: z.string().email().max(200), role: z.enum(["mentee", "mentor"]) });

// Same contract as api.womentorafrica.com/public/configuration/signup/waitlist/subscribe
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: "A valid email and role (mentee | mentor) are required." }, { status: 400 });
  const { email, role } = parsed.data;
  await prisma.waitlistSubscriber.upsert({
    where: { email_role: { email: email.toLowerCase(), role } },
    update: {},
    create: { email: email.toLowerCase(), role },
  });
  return json({ ok: true });
}
export const OPTIONS = options;
