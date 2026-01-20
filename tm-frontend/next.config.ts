import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable Turbopack file system cache for faster development builds
    turbopackFileSystemCacheForDev: true,
  },
  reactCompiler: true,
};

export default nextConfig;
