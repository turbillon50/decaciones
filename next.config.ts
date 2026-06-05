import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return ["/decades", "/genres", "/player", "/search", "/favorites", "/spotify"].map(
      (source) => ({ source, destination: "/", permanent: false }),
    );
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "i.scdn.co" },
      { protocol: "https", hostname: "mosaic.scdn.co" },
      { protocol: "https", hostname: "**.scdn.co" },
      { protocol: "https", hostname: "**.spotifycdn.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default nextConfig;
