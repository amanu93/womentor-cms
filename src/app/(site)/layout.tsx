import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { JoinProvider } from "@/components/site/JoinModal";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteContent();
  return { title: { default: settings.metaTitle, template: `%s · ${settings.siteName}` }, description: settings.metaDescription };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings, home } = await getSiteContent();
  const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
  return (
    <JoinProvider
      status={{ menteeSignup: settings.menteeSignup, menteeWaitlist: settings.menteeWaitlist, mentorSignup: settings.mentorSignup, mentorWaitlist: settings.mentorWaitlist }}
      copy={{ welcome: home.signupWelcome, prompt: home.signupPrompt, menteeBenefits: lines(home.menteeBenefits), mentorBenefits: lines(home.mentorBenefits), appUrl: settings.appUrl.replace(/\/$/, "") }}
    >
      <Header logoUrl={settings.logoUrl} siteName={settings.siteName} appUrl={settings.appUrl} loginLabel={settings.loginLabel} showNews={settings.showNews} showEvents={settings.showEvents} />
      {children}
      <Footer copyright={settings.copyrightText} />
    </JoinProvider>
  );
}
