import { getSiteContent, getPublishedPosts, getUpcomingEvents } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { json, options } from "@/lib/cors";

/* Full site content as JSON, for headless use by another front-end. */
export async function GET() {
  const content = await getSiteContent();
  const [posts, events] = await Promise.all([getPublishedPosts(), getUpcomingEvents()]);
  return json({
    ...content,
    expectTabs: content.expectTabs.map((t) => ({ ...t, html: renderMarkdown(t.body) })),
    posts: posts.map((p) => ({ ...p, html: renderMarkdown(p.body) })),
    events: events.map((e) => ({ ...e, html: renderMarkdown(e.body) })),
  });
}
export const OPTIONS = options;
