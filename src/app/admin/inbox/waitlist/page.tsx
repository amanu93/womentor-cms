import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { deleteSubscriber } from "../actions";

export const metadata = { title: "Waitlist" };

export default async function WaitlistPage() {
  await requireUser();
  const subs = await prisma.waitlistSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  const mentees = subs.filter((s) => s.role === "mentee").length;
  return (
    <>
      <PageHeader title="Waitlist" description={`${mentees} mentee and ${subs.length - mentees} mentor signups waiting to be notified when spots open.`}
        action={<a href="/api/admin/waitlist.csv" className="btn-secondary">Download CSV</a>} />
      <div className="card overflow-hidden">
        {subs.length === 0 ? <p className="p-8 text-center text-sm text-gray-500">No one on the waitlist yet.</p> : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-3 py-2">Email</th><th className="px-3 py-2">Role</th><th className="px-3 py-2">Date</th><th /></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {subs.map((s) => (
                <tr key={s.id}>
                  <td className="px-3 py-2 text-gray-900">{s.email}</td>
                  <td className="px-3 py-2"><span className="text-xs rounded-full bg-brand-100 text-brand-700 px-2 py-0.5 capitalize">{s.role}</span></td>
                  <td className="px-3 py-2 text-gray-500">{s.createdAt.toLocaleDateString("en-GB")}</td>
                  <td className="px-3 py-2 text-right"><form action={deleteSubscriber.bind(null, s.id)}><button className="text-xs text-red-600 hover:underline">Remove</button></form></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
