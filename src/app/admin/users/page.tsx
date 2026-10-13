import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PageHeader, Flash } from "@/components/admin/PageHeader";
import { createUser, resetPassword, setRole, deleteUser } from "./actions";

export const metadata = { title: "Users" };

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string; deleted?: string }> }) {
  const me = await requireAdmin();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  return (
    <>
      <PageHeader title="Users" description="Who can sign in to the CMS. Admins can manage users; editors can edit all content." />
      <Flash searchParams={await searchParams} />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-3 py-2">User</th><th className="px-3 py-2">Role</th><th className="px-3 py-2">Actions</th></tr></thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="align-top">
                  <td className="px-3 py-3"><p className="font-medium text-gray-900">{u.name}{u.id === me.id && <span className="text-xs text-gray-400"> (you)</span>}</p><p className="text-xs text-gray-500">{u.email}</p></td>
                  <td className="px-3 py-3"><span className={`text-xs rounded-full px-2 py-0.5 ${u.role === "ADMIN" ? "bg-brand-100 text-brand-700" : "bg-gray-100 text-gray-700"}`}>{u.role}</span></td>
                  <td className="px-3 py-3">
                    {u.id !== me.id && (
                      <div className="flex flex-col gap-2">
                        <form action={resetPassword.bind(null, u.id)} className="flex gap-1">
                          <input name="password" type="password" placeholder="New password" minLength={8} required className="input !py-1 !text-xs" />
                          <button className="btn-secondary !py-1 !px-2 !text-xs whitespace-nowrap">Reset</button>
                        </form>
                        <div className="flex gap-3 text-xs">
                          <form action={setRole.bind(null, u.id, u.role === "ADMIN" ? "EDITOR" : "ADMIN")}><button className="text-brand-700 hover:underline">Make {u.role === "ADMIN" ? "editor" : "admin"}</button></form>
                          <form action={deleteUser.bind(null, u.id)}><button className="text-red-600 hover:underline">Delete</button></form>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form action={createUser} className="card p-5 space-y-3 h-fit">
          <h2 className="font-semibold text-gray-900">Add user</h2>
          <input name="name" placeholder="Full name" required className="input" />
          <input name="email" type="email" placeholder="Email" required className="input" />
          <input name="password" type="password" placeholder="Password (min 8 chars)" minLength={8} required className="input" />
          <select name="role" className="input"><option value="EDITOR">Editor</option><option value="ADMIN">Admin</option></select>
          <button className="btn-primary w-full">Create user</button>
        </form>
      </div>
    </>
  );
}
