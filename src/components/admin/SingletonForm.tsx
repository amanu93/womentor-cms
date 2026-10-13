import type { FieldGroup } from "@/lib/collections";
import { FieldRenderer } from "./FieldRenderer";

export function SingletonForm({ groups, values, action }: { groups: FieldGroup[]; values: Record<string, unknown>; action: (fd: FormData) => Promise<void> }) {
  return (
    <form action={action} className="space-y-6">
      <div className="sticky top-0 md:top-0 z-10 -mx-4 md:-mx-8 px-4 md:px-8 py-2 bg-gray-50/90 backdrop-blur border-b flex items-center justify-between">
        <nav className="hidden md:flex gap-3 text-xs text-gray-500 overflow-x-auto">
          {groups.map((g) => <a key={g.title} href={`#${g.title.replace(/\s+/g, "-").toLowerCase()}`} className="hover:text-brand-700 whitespace-nowrap">{g.title}</a>)}
        </nav>
        <button className="btn-primary">Save changes</button>
      </div>
      {groups.map((g) => (
        <section key={g.title} id={g.title.replace(/\s+/g, "-").toLowerCase()} className="card p-6 scroll-mt-20">
          <h2 className="text-base font-semibold text-gray-900">{g.title}</h2>
          {g.description && <p className="text-xs text-gray-500 mt-0.5 mb-4">{g.description}</p>}
          <div className="mt-4 space-y-4">
            {g.fields.map((f) => <FieldRenderer key={f.name} field={f} value={values[f.name]} />)}
          </div>
        </section>
      ))}
      <div className="flex justify-end"><button className="btn-primary">Save changes</button></div>
    </form>
  );
}
