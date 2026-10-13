"use client";
import { createContext, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/admin/Icon";

export type SignupStatus = { menteeSignup: boolean; menteeWaitlist: boolean; mentorSignup: boolean; mentorWaitlist: boolean };
export type JoinCopy = { welcome: string; prompt: string; menteeBenefits: string[]; mentorBenefits: string[]; appUrl: string };

const Ctx = createContext<{ open: () => void }>({ open: () => {} });
export const useJoin = () => useContext(Ctx);

export function JoinProvider({ status, copy, children }: { status: SignupStatus; copy: JoinCopy; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open]);
  return (
    <Ctx.Provider value={{ open: () => setOpen(true) }}>
      {children}
      {open && <Modal status={status} copy={copy} onClose={() => setOpen(false)} />}
    </Ctx.Provider>
  );
}

export function JoinButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open } = useJoin();
  return <button type="button" onClick={open} className={className}>{children}</button>;
}

function Modal({ status, copy, onClose }: { status: SignupStatus; copy: JoinCopy; onClose: () => void }) {
  const roles = [
    { key: "mentee", title: "Join as a Mentee", avatar: "/images/avatars/menteeAvatar.svg", bg: "bg-emerald-100", benefits: copy.menteeBenefits, open: status.menteeSignup, waitlist: status.menteeWaitlist },
    { key: "mentor", title: "Join as a Mentor", avatar: "/images/avatars/mentorAvatar.svg", bg: "bg-pink-100", benefits: copy.mentorBenefits, open: status.mentorSignup, waitlist: status.mentorWaitlist },
  ] as const;
  const [selected, setSelected] = useState<"mentee" | "mentor" | null>(null);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const sel = roles.find((r) => r.key === selected);
  const anyOpen = roles.some((r) => r.open);

  async function joinWaitlist(role: string) {
    setBusy(true);
    try {
      const res = await fetch("/api/public/configuration/signup/waitlist/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, role }) });
      if (res.ok) setDone(role);
    } finally { setBusy(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/50 backdrop-blur-sm p-3 md:p-4 overflow-y-auto" onClick={onClose}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-5 md:p-8 my-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 text-center">
            <p className="text-lg md:text-2xl font-semibold text-gray-700">{copy.welcome}</p>
            <p className="text-xl md:text-3xl font-semibold text-gray-900">{copy.prompt}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:opacity-70"><Icon name="x" /></button>
        </div>
        <div className="mt-6 space-y-4">
          {roles.map((r) => {
            const active = selected === r.key;
            return (
              <div key={r.key} className={`rounded-xl border p-3 md:p-4 cursor-pointer transition ${active ? "border-brand-500 ring-2 ring-brand-500/30" : "border-gray-200 hover:border-brand-300"}`} onClick={() => setSelected(r.key)}>
                <div className="flex gap-3 md:gap-6 items-start">
                  <div className={`w-4 h-4 mt-1 rounded outline outline-1 ${active ? "bg-brand-500 outline-brand-500" : "outline-gray-400"} flex items-center justify-center shrink-0`}>{active && <Icon name="check" className="w-3 h-3 text-white" />}</div>
                  <div className={`w-20 h-20 md:w-32 md:h-32 ${r.bg} rounded-xl flex items-center justify-center shrink-0`}><Image src={r.avatar} alt="" width={64} height={64} className="w-10 h-10 md:w-16 md:h-16" /></div>
                  <div className="flex-1">
                    <p className="text-lg md:text-2xl font-bold text-gray-900">{r.title}</p>
                    <ul className="mt-2 space-y-1">
                      {r.benefits.map((b) => <li key={b} className="flex gap-2 text-sm md:text-base text-gray-700"><Icon name="check" className="w-4 h-4 mt-1 text-brand-600 shrink-0" />{b}</li>)}
                    </ul>
                    {!r.open && active && r.waitlist && (
                      <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                        {done === r.key ? <p className="text-sm text-green-600 font-medium">We will notify you when slots are open!</p> : (
                          <>
                            <p className="text-sm text-gray-600 mb-2">Sorry, we are currently full for this role! Drop your email to be notified when a spot opens.</p>
                            <div className="flex flex-col md:flex-row gap-2">
                              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input" />
                              <button disabled={busy || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)} onClick={() => joinWaitlist(r.key)} className="btn-primary whitespace-nowrap">Notify me</button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    {!r.open && !r.waitlist && active && <p className="mt-3 text-sm text-gray-600">Sorry, we are currently full for this role.</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-gray-700">Already have an account? <a href={`${copy.appUrl}/login`} className="text-brand-500 font-medium hover:text-brand-600">Log in</a></p>
          {anyOpen && (
            <a href={sel?.open ? `${copy.appUrl}/signup?track=${sel.key}` : undefined} aria-disabled={!sel?.open}
              className={`btn-primary w-full md:w-auto ${!sel?.open ? "pointer-events-none opacity-50" : ""}`}>Continue</a>
          )}
        </div>
      </div>
    </div>
  );
}
