"use client";
import { useEffect, useState } from "react";
import { Icon } from "@/components/admin/Icon";

type Partner = { id: string; name: string; logo: string; website: string };

export function PartnersCarousel({ partners }: { partners: Partner[] }) {
  const [per, setPer] = useState(3);
  const [page, setPage] = useState(0);
  useEffect(() => {
    const f = () => setPer(window.innerWidth >= 768 ? 3 : 2);
    f(); window.addEventListener("resize", f); return () => window.removeEventListener("resize", f);
  }, []);
  const pages = Math.max(1, Math.ceil(partners.length / per));
  const p = Math.min(page, pages - 1);
  const visible = partners.slice(p * per, p * per + per);
  if (partners.length === 0) return null;
  return (
    <div className="relative">
      <div className="flex items-center gap-3 md:gap-6">
        <button onClick={() => setPage((p - 1 + pages) % pages)} aria-label="Previous" className="w-12 h-12 shrink-0 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-600 hover:opacity-80"><Icon name="left" /></button>
        <div className="flex-1 grid gap-4 md:gap-6" style={{ gridTemplateColumns: `repeat(${per}, minmax(0, 1fr))` }}>
          {visible.map((pt) => {
            const inner = (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pt.logo} alt={pt.name} className="max-h-20 md:max-h-24 w-auto max-w-full object-contain" />
            );
            const cls = "h-32 md:h-40 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center p-5 hover:shadow transition";
            return pt.website ? <a key={pt.id} href={pt.website} target="_blank" rel="noopener noreferrer" title={pt.name} className={cls}>{inner}</a> : <div key={pt.id} title={pt.name} className={cls}>{inner}</div>;
          })}
        </div>
        <button onClick={() => setPage((p + 1) % pages)} aria-label="Next" className="w-12 h-12 shrink-0 rounded-full bg-white shadow-lg flex items-center justify-center text-brand-600 hover:opacity-80"><Icon name="right" /></button>
      </div>
      {pages > 1 && <div className="mt-6 flex justify-center gap-2">{Array.from({ length: pages }).map((_, k) => <button key={k} onClick={() => setPage(k)} aria-label={`Page ${k + 1}`} className={`h-1.5 rounded-full transition-all ${k === p ? "w-8 bg-gray-900" : "w-3 bg-gray-300"}`} />)}</div>}
    </div>
  );
}
