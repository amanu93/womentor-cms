"use client";
import { useEffect, useState } from "react";

function slugify(s: string) {
  return s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}

/* Slug input that auto-fills from a sibling field until the user edits it manually. */
export function SlugField({ name, from, defaultValue = "" }: { name: string; from?: string; defaultValue?: string }) {
  const [value, setValue] = useState(defaultValue);
  const [touched, setTouched] = useState(Boolean(defaultValue));
  useEffect(() => {
    if (!from) return;
    const src = document.querySelector<HTMLInputElement>(`[name="${from}"]`);
    if (!src) return;
    const h = () => { if (!touched) setValue(slugify(src.value)); };
    src.addEventListener("input", h);
    return () => src.removeEventListener("input", h);
  }, [from, touched]);
  return (
    <input name={name} value={value} onChange={(e) => { setTouched(true); setValue(slugify(e.target.value)); }} className="input font-mono text-xs" placeholder="auto-generated" />
  );
}
