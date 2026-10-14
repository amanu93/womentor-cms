import { getCurrentUser } from "@/lib/auth";
import { renderMarkdown } from "@/lib/markdown";

export async function POST(req: Request) {
  if (!(await getCurrentUser())) return new Response("Unauthorized", { status: 401 });
  return new Response(renderMarkdown(await req.text()), { headers: { "content-type": "text/html; charset=utf-8" } });
}
