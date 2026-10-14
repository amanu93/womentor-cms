"use client";
import { useRef, useState } from "react";

/* Text input holding an image URL, with upload to /api/admin/upload and a live preview. */
export function ImageField({ name, defaultValue = "", required }: { name: string; defaultValue?: string; required?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true); setError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      setValue(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="flex gap-3 items-start">
      <div className="w-24 h-24 shrink-0 rounded-lg border border-dashed border-gray-300 bg-gray-50 overflow-hidden flex items-center justify-center">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="w-full h-full object-contain" />
        ) : (
          <span className="text-[11px] text-gray-400">No image</span>
        )}
      </div>
      <div className="flex-1 space-y-2">
        <input name={name} value={value} onChange={(e) => setValue(e.target.value)} required={required} className="input" placeholder="/images/… or https://…" />
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
          <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="btn-secondary !py-1.5 !px-3">
            {busy ? "Uploading…" : "Upload image"}
          </button>
          {value && <button type="button" onClick={() => setValue("")} className="btn-danger !py-1.5">Remove</button>}
          <a href="/admin/media" target="_blank" className="text-xs text-gray-500 underline">Media library</a>
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
