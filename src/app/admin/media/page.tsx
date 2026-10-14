import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { PageHeader } from "@/components/admin/PageHeader";
import { Uploader } from "./Uploader";
import { CopyButton } from "./CopyButton";
import { deleteMedia } from "./actions";

export const metadata = { title: "Media" };

export default async function MediaPage() {
  await requireUser();
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <>
      <PageHeader title="Media library" description="Uploaded images and files. Copy a URL to use it in any image field." action={<Uploader />} />
      {media.length === 0 ? (
        <div className="card p-10 text-center text-sm text-gray-500">No uploads yet. Images bundled with the site live under <code>/images/…</code>.</div>
      ) : (
        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <div key={m.id} className="card overflow-hidden">
              <div className="aspect-square bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px] flex items-center justify-center">
                {m.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.alt} className="w-full h-full object-contain" />
                ) : <span className="text-xs text-gray-500">{m.mimeType}</span>}
              </div>
              <div className="p-2.5">
                <p className="text-xs font-medium text-gray-900 truncate" title={m.filename}>{m.filename}</p>
                <p className="text-[11px] text-gray-500">{(m.size / 1024).toFixed(0)} KB</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <CopyButton text={m.url} />
                  <form action={deleteMedia.bind(null, m.id)}><button className="text-xs text-red-600 hover:underline">Delete</button></form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
