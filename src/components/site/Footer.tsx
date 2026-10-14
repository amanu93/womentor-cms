import type { SiteContent } from "@/lib/content";
import { Icon } from "@/components/admin/Icon";
import { ContactForm } from "./ContactForm";

export function ContactSection({ settings, home }: Pick<SiteContent, "settings" | "home">) {
  return (
    <section id="contact" className="bg-brand-100 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-20 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-5 lg:border-r lg:border-gray-200 lg:pr-10">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">{home.partnerTitle}</h3>
          <p className="text-base font-semibold text-gray-900">{home.partnerBody}</p>
          <a href={`mailto:${settings.partnershipsEmail}`} className="text-brand-700 font-medium underline hover:text-brand-800">{settings.partnershipsEmail}</a>
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">{home.followTitle}</h3>
          <p className="text-base font-semibold text-gray-900">{home.followBody}</p>
          <div className="flex items-center gap-4 text-brand-700">
            {settings.linkedinUrl && <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-brand-800"><LinkedIn /></a>}
            {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-800"><Instagram /></a>}
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 md:px-8 pb-16 md:pb-20 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-semibold text-gray-900">{home.contactTitle}</h3>
          <p className="text-base font-semibold text-gray-900 leading-relaxed">
            {settings.organisationName}<br />{settings.addressLine1}<br />{settings.addressLine2}<br />{settings.addressCountry}
          </p>
          <a href={`mailto:${settings.infoEmail}`} className="inline-flex items-center gap-3 text-brand-700 underline font-medium hover:text-brand-800">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><Icon name="mail" className="w-5 h-5" /></span>{settings.infoEmail}
          </a>
          <a href={`tel:${settings.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-3 text-brand-700 underline font-medium hover:text-brand-800">
            <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center"><Icon name="phone" className="w-5 h-5" /></span>Tel: {settings.phone}
          </a>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}

export function Footer({ copyright }: { copyright: string }) {
  return (
    <footer className="bg-brand-600 text-white text-center text-sm md:text-base font-semibold py-6 px-4 leading-7">
      {copyright}<br />All rights reserved
    </footer>
  );
}

function LinkedIn() {
  return <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden><path d="M20.4 2H3.6A1.6 1.6 0 002 3.6v16.8A1.6 1.6 0 003.6 22h16.8a1.6 1.6 0 001.6-1.6V3.6A1.6 1.6 0 0020.4 2zM8 19H5V9h3zM6.5 7.7a1.7 1.7 0 110-3.4 1.7 1.7 0 010 3.4zM19 19h-3v-4.8c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6V19h-3V9h2.9v1.4a3.2 3.2 0 012.9-1.6c3 0 3.6 2 3.6 4.6z" /></svg>;
}
function Instagram() {
  return <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>;
}
