import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { HOME_GROUPS } from "@/lib/collections";
import { PageHeader, Flash } from "@/components/admin/PageHeader";
import { SingletonForm } from "@/components/admin/SingletonForm";
import { saveHome } from "../settings/actions";

export const metadata = { title: "Home page" };

export default async function HomePage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireUser();
  const home = await prisma.homeContent.findUniqueOrThrow({ where: { id: 1 } });
  return (
    <>
      <PageHeader title="Home page text" description="Headings, intros and images for every section of the home page. Lists (slides, pillars, FAQs…) are edited in their own sections." />
      <Flash searchParams={await searchParams} />
      <SingletonForm groups={HOME_GROUPS} values={home} action={saveHome} />
    </>
  );
}
