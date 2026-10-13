"use client";
export function CopyButton({ text }: { text: string }) {
  return <button type="button" onClick={() => navigator.clipboard.writeText(text)} className="text-xs text-brand-700 hover:underline">Copy URL</button>;
}
