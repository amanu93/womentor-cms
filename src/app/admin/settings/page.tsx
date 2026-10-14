import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { SETTINGS_GROUPS } from "@/lib/collections";
import { PageHeader, Flash } from "@/components/admin/PageHeader";
import { SingletonForm } from "@/components/admin/SingletonForm";
import { saveSettings } from "./actions";

export const metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireUser();
  const settings = await prisma.siteSettings.findUniqueOrThrow({ where: { id: 1 } });
  return (
    <>
      <PageHeader title="Settings & contact" description="Site-wide details: contact information, social links, member app URL and signup availability." />
      <Flash searchParams={await searchParams} />
      <SingletonForm groups={SETTINGS_GROUPS} values={settings} action={saveSettings} />
    </>
  );
}
