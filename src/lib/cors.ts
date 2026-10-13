import { NextResponse } from "next/server";

/* Public API responses allow cross-origin reads so the existing front-end
   (or any other client) can consume the CMS from a different domain. */
export const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function json(data: unknown, init: ResponseInit = {}) {
  return NextResponse.json(data, { ...init, headers: { ...CORS_HEADERS, ...(init.headers ?? {}) } });
}

export function options() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}
