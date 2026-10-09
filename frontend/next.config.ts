import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/categories/:category", destination: "/auctions?category=:category", permanent: true },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://bidora-api.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
