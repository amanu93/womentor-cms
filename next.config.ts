import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow any https image URL to be pasted into image fields.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  experimental: { serverActions: { bodySizeLimit: "10mb" } },
};

export default nextConfig;
