import Link from "next/link";
import { Icon } from "./Icon";

export function PageHeader({ title, description, action, back }: {
  title: string; description?: string; action?: React.ReactNode; back?: { href: string; label: string };
}) {
  return (
    <div className="mb-6">
      {back && (
        <Link href={back.href} className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-brand-700 mb-2">
          <Icon name="left" className="w-4 h-4" /> {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500 max-w-2xl">{description}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function Flash({ searchParams }: { searchParams: { saved?: string; error?: string; deleted?: string } }) {
  if (searchParams.saved) return <div className="mb-4 rounded-lg bg-green-50 border border-green-200 px-4 py-2 text-sm text-green-800">Saved.</div>;
  if (searchParams.deleted) return <div className="mb-4 rounded-lg bg-gray-100 border border-gray-200 px-4 py-2 text-sm text-gray-700">Deleted.</div>;
  if (searchParams.error) return <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-800">{searchParams.error}</div>;
  return null;
}
