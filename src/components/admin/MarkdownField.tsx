"use client";
import { useState } from "react";

/* Markdown textarea with a lightweight edit / preview toggle. */
export function MarkdownField({ name, defaultValue = "", rows = 12, required }: { name: string; defaultValue?: string; rows?: number; required?: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const [preview, setPreview] = useState(false);
  const [html, setHtml] = useState("");

  async function togglePreview() {
    if (!preview) {
      const res = await fetch("/api/admin/preview", { method: "POST", body: value });
      setHtml(await res.text());
    }
    setPreview(!preview);
  }

  return (
    <div className="rounded-lg border border-gray-300 overflow-hidden">
      <div className="flex items-center justify-between bg-gray-50 border-b px-3 py-1.5 text-xs text-gray-500">
        <span>Markdown · <b>**bold**</b>, <i>_italic_</i>, lists with &quot;- &quot;, links [text](url)</span>
        <button type="button" onClick={togglePreview} className="font-medium text-brand-700 hover:underline">{preview ? "Edit" : "Preview"}</button>
      </div>
      {preview ? (
        <div className="prose-site p-4 min-h-32 text-sm" dangerouslySetInnerHTML={{ __html: html }} />
      ) : null}
      <textarea name={name} value={value} onChange={(e) => setValue(e.target.value)} rows={rows} required={required}
        className={`w-full px-3 py-2 text-sm font-mono focus:outline-none ${preview ? "hidden" : ""}`} />
    </div>
  );
}
