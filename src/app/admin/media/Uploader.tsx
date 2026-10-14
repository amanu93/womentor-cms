"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function Uploader() {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  async function onChange(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true); setError(null);
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) setError((await res.json()).error ?? "Upload failed");
    }
    setBusy(false); if (ref.current) ref.current.value = ""; router.refresh();
  }
  return (
    <div>
      <input ref={ref} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => onChange(e.target.files)} />
      <button onClick={() => ref.current?.click()} disabled={busy} className="btn-primary">{busy ? "Uploading…" : "Upload files"}</button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}
