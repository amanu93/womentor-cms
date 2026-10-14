import Image from "next/image";
import Link from "next/link";
import { getSiteContent, getPublishedPosts, getUpcomingEvents } from "@/lib/content";
import { renderMarkdown } from "@/lib/markdown";
import { Icon } from "@/components/admin/Icon";
import { AboutCarousel } from "@/components/site/AboutCarousel";
import { ExpectTabs } from "@/components/site/ExpectTabs";
import { PartnersCarousel } from "@/components/site/PartnersCarousel";
import { JoinButton } from "@/components/site/JoinModal";
import { ContactSection } from "@/components/site/Footer";

const PILLAR_COLORS: Record<string, string> = {
  orange: "bg-orange-100", amber: "bg-amber-100", pink: "bg-pink-100", emerald: "bg-emerald-100",
};

function Paragraphs({ text, className = "" }: { text: string; className?: string }) {
  return <>{text.split(/\n\s*\n/).filter(Boolean).map((p, i) => <p key={i} className={className}>{p}</p>)}</>;
}

export default async function HomePage() {
  const { settings, home, aboutSlides, pillars, features, expectTabs, faqs, stats, partners } = await getSiteContent();
  const [posts, events] = await Promise.all([settings.showNews ? getPublishedPosts(3) : [], settings.showEvents ? getUpcomingEvents(3) : []]);
  const tabs = expectTabs.map((t) => ({ id: t.id, title: t.title, html: renderMarkdown(t.body) }));
  // Impact stats are laid out as a pyramid (1, 2, 3 …) like the original site.
  const rows: typeof stats[] = [];
  for (let size = 1, i = 0; i < stats.length; size++) { rows.push(stats.slice(i, i + size)); i += size; }

  return (
    <main>
      {/* Hero */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-r from-orange-800 via-orange-600 to-orange-300 text-brand-300">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center min-h-[520px]">
          <div className="flex flex-col gap-5 text-center md:text-left items-center md:items-start">
            <h1 className="text-5xl md:text-6xl font-bold leading-tight whitespace-pre-line">{home.heroTitle}</h1>
            <p className="max-w-[520px] text-base md:text-lg font-semibold">{home.heroSubtitle}</p>
            {home.heroQuote && <p className="max-w-[520px] text-sm md:text-base font-medium italic" style={{ fontFamily: "var(--font-playfair)" }}>{home.heroQuote}</p>}
            <div className="mt-2 flex flex-col sm:flex-row gap-4">
              <a href={`#${home.heroCtaTarget}`} className="inline-flex justify-center rounded-lg border border-brand-300 px-6 py-2.5 font-semibold text-brand-300 hover:bg-white/10 transition">{home.heroCtaLabel}</a>
              <JoinButton className="inline-flex justify-center rounded-lg bg-white px-6 py-2.5 font-semibold text-brand-600 hover:bg-orange-50 transition">Join the movement</JoinButton>
            </div>
          </div>
          <div className="relative h-72 md:h-[420px]">
            {home.heroImage && <Image src={home.heroImage} alt="" fill priority className="object-contain object-right" sizes="(max-width: 768px) 100vw, 50vw" />}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-24 bg-brand-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col gap-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">{home.aboutTitle}</h2>
          <AboutCarousel slides={aboutSlides} />
        </div>
      </section>

      {/* Approach */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col items-center gap-8 md:gap-10">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900">{home.approachTitle}</h2>
          <div className="max-w-3xl text-center text-gray-700 leading-relaxed whitespace-pre-line">{home.approachIntro}</div>
          <div className="w-full flex flex-wrap justify-center gap-6 md:gap-8">
            {pillars.map((p) => (
              <div key={p.id} className={`group w-full sm:w-[calc(50%-1rem)] lg:w-[380px] rounded-2xl ${PILLAR_COLORS[p.color] ?? "bg-orange-100"} p-8 flex flex-col items-center text-center gap-4 transition hover:shadow-md`}>
                <div className="w-14 h-14 rounded-full bg-brand-600 text-white flex items-center justify-center transition-transform duration-700 group-hover:translate-y-1"><Icon name={p.icon || "spark"} className="w-7 h-7" /></div>
                <h3 className="text-xl font-bold text-brand-800">{p.title}</h3>
                <p className="text-gray-800 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship */}
      <section id="mentorship" className="scroll-mt-24 bg-gray-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col gap-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{home.mentorshipTitle}</h2>
              <div className="space-y-4 text-base md:text-lg text-gray-700 leading-relaxed"><Paragraphs text={home.mentorshipBody} /></div>
            </div>
            {home.mentorshipImage && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <Image src={home.mentorshipImage} alt="Women in mentorship program" fill className="object-cover transition-transform duration-700 hover:scale-110" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            )}
          </div>
          <div className="grid md:grid-cols-2 gap-8 md:gap-20 items-center">
            {home.featuresImage && (
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden order-2 md:order-1">
                <Image src={home.featuresImage} alt="Mentorship program participants" fill className="object-cover transition-transform duration-700 hover:scale-110" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            )}
            <div className="flex flex-col gap-5 order-1 md:order-2">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900">{home.featuresTitle}</h3>
              {features.map((f) => (
                <div key={f.id} className="flex flex-col gap-1">
                  <p className="text-lg md:text-xl font-semibold text-gray-900">{f.title}</p>
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-brand-50 py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold text-[#101828]">{home.expectTitle}</h2>
            <p className="mt-2 text-xl text-gray-600">{home.expectIntro}</p>
          </div>
          <ExpectTabs tabs={tabs} faqs={faqs} ctaTitle={home.expectCtaTitle} ctaBody={home.expectCtaBody} />
        </div>
      </section>

      {/* Quote */}
      {home.quoteText && (
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full pointer-events-none opacity-90">
            <Image src="/images/illustrations/africa.svg" alt="" fill className="object-contain object-right" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 md:px-8">
            <p className="max-w-4xl text-xl md:text-2xl lg:text-[36px] lg:leading-[54px] font-bold italic text-gold text-center md:text-left" style={{ fontFamily: "var(--font-playfair)" }}>{home.quoteText}</p>
          </div>
        </section>
      )}

      {/* Impact */}
      <section id="community" className="scroll-mt-24 relative bg-gray-50 py-16 md:py-20 overflow-hidden">
        <div className="hidden lg:block absolute right-0 top-0 w-1/3 h-full pointer-events-none">
          <Image src="/images/illustrations/circularIllustration.svg" alt="" fill className="object-contain object-right" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900">{home.impactTitle}</h2>
          <p className="mt-3 max-w-2xl text-base md:text-xl text-gray-700">{home.impactIntro}</p>
          <div className="mt-10 flex flex-col gap-5">
            {rows.map((row, r) => (
              <div key={r} className="flex flex-wrap gap-5">
                {row.map((s) => (
                  <div key={s.id} className="card w-full sm:w-[300px] p-5 flex gap-4 items-start">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-brand-600"><Icon name={s.icon} className="w-6 h-6" /></div>
                    <div>
                      <p className="text-3xl md:text-4xl font-extrabold text-brand-800">{s.value}</p>
                      <p className="text-lg md:text-xl font-bold text-brand-800">{s.label}</p>
                      <p className="text-sm md:text-base font-semibold text-[#6A7282]">{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News & events (only when content exists) */}
      {(posts.length > 0 || events.length > 0) && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8 grid gap-12 lg:grid-cols-2">
            {posts.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-6"><h2 className="text-2xl md:text-3xl font-bold text-gray-900">Latest news</h2><Link href="/news" className="text-brand-700 font-medium hover:underline">All news</Link></div>
                <ul className="space-y-4">
                  {posts.map((p) => (
                    <li key={p.id}><Link href={`/news/${p.slug}`} className="card flex gap-4 p-4 hover:border-brand-300 transition">
                      {p.coverImage && <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden"><Image src={p.coverImage} alt="" fill className="object-cover" sizes="96px" /></div>}
                      <div><p className="font-semibold text-gray-900">{p.title}</p><p className="text-sm text-gray-600 line-clamp-2">{p.excerpt}</p></div>
                    </Link></li>
                  ))}
                </ul>
              </div>
            )}
            {events.length > 0 && (
              <div>
                <div className="flex items-end justify-between mb-6"><h2 className="text-2xl md:text-3xl font-bold text-gray-900">Events</h2><Link href="/events" className="text-brand-700 font-medium hover:underline">All events</Link></div>
                <ul className="space-y-4">
                  {events.map((e) => (
                    <li key={e.id}><Link href={`/events/${e.slug}`} className="card flex gap-4 p-4 hover:border-brand-300 transition">
                      <div className="w-16 shrink-0 rounded-lg bg-brand-100 text-brand-800 flex flex-col items-center justify-center py-2"><span className="text-2xl font-extrabold leading-none">{e.startsAt.getDate()}</span><span className="text-xs font-semibold uppercase">{e.startsAt.toLocaleString("en-GB", { month: "short" })}</span></div>
                      <div><p className="font-semibold text-gray-900">{e.title}</p><p className="text-sm text-gray-600">{e.location}</p></div>
                    </Link></li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Partners */}
      {partners.length > 0 && (
        <section className="py-16 md:py-20">
          <div className="mx-auto max-w-7xl px-4 md:px-8 flex flex-col gap-10">
            <div className="text-center"><h2 className="text-2xl md:text-3xl font-bold text-gray-900">{home.partnersTitle}</h2><p className="mt-2 text-base md:text-xl text-gray-700">{home.partnersSubtitle}</p></div>
            <PartnersCarousel partners={partners} />
          </div>
        </section>
      )}

      {/* Community banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-300 via-orange-500 to-orange-700 min-h-80">
        <div className="mx-auto max-w-7xl px-4 md:px-8 pt-16 md:pt-20 grid md:grid-cols-2 gap-8 items-end">
          <div className="pb-16 md:pb-20 flex flex-col gap-4">
            <h2 className="text-3xl font-bold text-gray-900">{home.communityTitle}</h2>
            <p className="text-xl md:text-2xl text-gray-800 leading-relaxed">{home.communityBody}</p>
            <JoinButton className="mt-2 w-fit rounded-lg bg-white px-6 py-2.5 font-semibold text-brand-600 hover:bg-orange-50 transition">Join the movement</JoinButton>
          </div>
          {home.communityImage && <div className="relative h-64 md:h-80"><Image src={home.communityImage} alt="Women holding hands together" fill className="object-contain object-bottom" sizes="(max-width: 768px) 100vw, 50vw" /></div>}
        </div>
      </section>

      <ContactSection settings={settings} home={home} />
    </main>
  );
}
