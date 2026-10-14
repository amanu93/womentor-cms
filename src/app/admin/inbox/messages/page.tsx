import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { markRead, deleteMessage } from "../actions";

export const metadata = { title: "Messages" };

export default async function MessagesPage() {
  await requireUser();
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Messages" description="Submissions from the contact form on the site." />
      {messages.length === 0 ? <div className="card p-10 text-center text-sm text-gray-500">No messages yet.</div> : (
        <div className="space-y-3">
          {messages.map((m) => (
            <details key={m.id} className={`card ${m.read ? "" : "border-brand-300"}`}>
              <summary className="cursor-pointer px-5 py-3 flex items-center gap-3 list-none">
                {!m.read && <span className="w-2 h-2 rounded-full bg-brand-600" />}
                <span className={`flex-1 truncate ${m.read ? "text-gray-700" : "font-semibold text-gray-900"}`}>{m.subject || "(no subject)"}</span>
                <span className="text-xs text-gray-500 truncate max-w-[40%]">{m.name} · {m.email}</span>
                <span className="text-xs text-gray-400 whitespace-nowrap">{m.createdAt.toLocaleDateString("en-GB")}</span>
              </summary>
              <div className="px-5 pb-4 border-t pt-3">
                <p className="text-sm text-gray-800 whitespace-pre-line">{m.message}</p>
                <div className="mt-3 flex gap-3 text-sm">
                  <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`} className="btn-secondary !py-1">Reply by email</a>
                  <form action={markRead.bind(null, m.id, !m.read)}><button className="btn-secondary !py-1">{m.read ? "Mark unread" : "Mark read"}</button></form>
                  <form action={deleteMessage.bind(null, m.id)}><button className="btn-danger">Delete</button></form>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </>
  );
}
