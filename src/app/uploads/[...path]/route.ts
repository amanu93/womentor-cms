import { NextResponse } from "next/server";
import { readFile, stat } from "fs/promises";
import path from "path";
import { UPLOAD_DIR, MIME_BY_EXT } from "@/lib/uploads";

/* Serves files from the uploads directory at /uploads/<name>. */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const file = path.join(UPLOAD_DIR, ...parts);
  if (!file.startsWith(UPLOAD_DIR + path.sep)) return new NextResponse("Not found", { status: 404 });
  try {
    const s = await stat(file);
    if (!s.isFile()) throw new Error("not a file");
    const body = await readFile(file);
    const type = MIME_BY_EXT[path.extname(file).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(body, {
      headers: {
        "content-type": type,
        "content-length": String(s.size),
        "cache-control": "public, max-age=31536000, immutable",
        ...(type === "image/svg+xml" ? { "content-security-policy": "script-src 'none'" } : {}),
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
