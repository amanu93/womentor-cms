"use client";
import { useState } from "react";
import { Icon } from "@/components/admin/Icon";
import { JoinButton } from "./JoinModal";

type Tab = { id: string; title: string; html: string };
type Faq = { id: string; question: string; answer: string };

export function ExpectTabs({ tabs, faqs, ctaTitle, ctaBody }: { tabs: Tab[]; faqs: Faq[]; ctaTitle: string; ctaBody: string }) {
  const all = [...tabs, ...(faqs.length ? [{ id: "faqs", title: "FAQs", html: "" }] : [])];
  const [active, setActive] = useState(all[0]?.id);
  const [openFaq, setOpenFaq] = useState<string | null>(faqs[0]?.id ?? null);
  const cur = all.find((t) => t.id === active);
  const cta = (
    <div className="rounded-2xl bg-brand-500 text-white p-5 md:p-6">
      <p className="text-xl md:text-2xl font-bold">{ctaTitle}</p>
      <p className="mt-1 text-sm md:text-base">{ctaBody}</p>
      <JoinButton className="mt-4 inline-flex rounded-lg bg-white px-5 py-2 text-sm font-semibold text-brand-600 hover:bg-orange-50">Join Womentor Africa</JoinButton>
    </div>
  );
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr]">
      <ul className="space-y-2">
        {all.map((t) => {
          const on = t.id === active;
          return (
            <li key={t.id}>
              <button onClick={() => setActive(t.id)} className={`w-full flex items-center justify-between rounded-2xl px-5 py-4 text-left font-medium transition ${on ? "bg-brand-500 text-white" : "bg-white text-gray-900 hover:bg-orange-50"}`}>
                {t.title}<Icon name="right" className="w-4 h-4" />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="space-y-6">
        {cur && cur.id !== "faqs" && (
          <>
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">{cur.title}</h3>
            <div className="prose-site text-base md:text-lg" dangerouslySetInnerHTML={{ __html: cur.html }} />
          </>
        )}
        {cur?.id === "faqs" && (
          <>
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900">Frequently asked questions</h3>
            <div className="divide-y divide-gray-200 rounded-2xl bg-white">
              {faqs.map((f) => {
                const on = openFaq === f.id;
                return (
                  <div key={f.id}>
                    <button onClick={() => setOpenFaq(on ? null : f.id)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-medium text-gray-900">
                      {f.question}<Icon name={on ? "up" : "down"} className="w-4 h-4 shrink-0 text-brand-600" />
                    </button>
                    {on && <p className="px-5 pb-4 text-[#4A5565] leading-relaxed">{f.answer}</p>}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {cta}
      </div>
    </div>
  );
}
