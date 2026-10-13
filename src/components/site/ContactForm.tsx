"use client";
import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "busy" | "sent" | "error">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("busy");
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/public/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(fd)) });
    setState(res.ok ? "sent" : "error");
  }
  if (state === "sent") return <div className="rounded-2xl bg-white p-6 md:p-8 shadow-sm"><p className="text-lg font-semibold text-gray-900">Thank you!</p><p className="text-gray-700 mt-1">Your message has been received. We will get back to you shortly.</p></div>;
  return (
    <form onSubmit={onSubmit} className="rounded-2xl bg-white p-6 md:p-8 shadow-sm space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Send us a message</h3>
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
      <div className="grid gap-3 md:grid-cols-2">
        <input name="name" required placeholder="Your name" className="input" />
        <input name="email" type="email" required placeholder="Email address" className="input" />
      </div>
      <input name="subject" placeholder="Subject" className="input" />
      <textarea name="message" required rows={4} placeholder="How can we help?" className="input" />
      {state === "error" && <p className="text-sm text-red-600">Something went wrong. Please try again or email us directly.</p>}
      <button disabled={state === "busy"} className="btn-primary w-full md:w-auto">{state === "busy" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
