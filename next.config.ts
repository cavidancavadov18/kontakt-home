import type { NextConfig } from "next";

const apiOrigin =
  process.env.API_INTERNAL_URL ||
  process.env.API_URL ||
  "http://127.0.0.1:8010";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.kontakt.az", pathname: "/**" },
      { protocol: "https", hostname: "kontakt.az", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
