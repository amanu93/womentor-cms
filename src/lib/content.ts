import "server-only";
import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "./db";

export const SITE_TAG = "site-content";

/** Everything the public site needs, in one cached read. */
export const getSiteContent = unstable_cache(
  async () => {
    const [settings, home, aboutSlides, pillars, features, expectTabs, faqs, stats, partners] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 1 } }),
      prisma.homeContent.findUnique({ where: { id: 1 } }),
      prisma.aboutSlide.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.pillar.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.feature.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.expectTab.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.faq.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.stat.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
      prisma.partner.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
    ]);
    if (!settings || !home) throw new Error("Database not seeded. Run `npm run db:seed`.");
    return { settings, home, aboutSlides, pillars, features, expectTabs, faqs, stats, partners };
  },
  ["site-content"],
  { tags: [SITE_TAG] },
);

export type SiteContent = Awaited<ReturnType<typeof getSiteContent>>;

export function revalidateSite() {
  revalidateTag(SITE_TAG);
}

export async function getPublishedPosts(limit?: number) {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
}

export async function getUpcomingEvents(limit?: number) {
  return prisma.event.findMany({ where: { published: true }, orderBy: { startsAt: "desc" }, take: limit });
}
