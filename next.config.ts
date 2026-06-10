import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  serverExternalPackages: ["@neondatabase/serverless"],
  turbopack: { root: "/root/decaciones" },
};
export default nextConfig;
