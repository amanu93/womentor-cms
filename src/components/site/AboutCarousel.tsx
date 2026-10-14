"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/admin/Icon";

type Slide = { id: string; heading: string; title: string; content: string; image: string };

export function AboutCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;
  useEffect(() => {
    if (n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [n]);
  if (n === 0) return null;
  const s = slides[i];
  return (
    <div className="relative">
      <div className="flex items-center gap-2 md:gap-4">
        <button onClick={() => setI((i - 1 + n) % n)} aria-label="Previous" className="hidden md:flex w-12 h-12 shrink-0 items-center justify-center text-brand-600 hover:opacity-70"><Icon name="left" className="w-8 h-8" /></button>
        <div className="flex-1 bg-brand-100 rounded-2xl overflow-hidden grid md:grid-cols-[1fr_minmax(0,420px)] min-h-[320px]">
          <div className="p-6 md:p-10 flex flex-col justify-center gap-3">
            <h3 className="text-3xl font-bold text-gray-900">{s.heading}</h3>
            {s.title && <p className="text-lg font-semibold text-gray-900">{s.title}</p>}
            <div className="text-lg leading-relaxed text-gray-900 whitespace-pre-line">{s.content}</div>
          </div>
          {s.image && (
            <div className="relative min-h-[220px] md:min-h-0 overflow-hidden">
              <Image src={s.image} alt="" fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover transition-transform duration-700 hover:scale-110" />
            </div>
          )}
        </div>
        <button onClick={() => setI((i + 1) % n)} aria-label="Next" className="hidden md:flex w-12 h-12 shrink-0 items-center justify-center text-brand-600 hover:opacity-70"><Icon name="right" className="w-8 h-8" /></button>
      </div>
      {n > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {slides.map((sl, k) => <button key={sl.id} onClick={() => setI(k)} aria-label={`Slide ${k + 1}`} className={`h-2 rounded-full transition-all ${k === i ? "w-6 bg-brand-600" : "w-2 bg-brand-200"}`} />)}
        </div>
      )}
    </div>
  );
}
