import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // For direct pixel access
  },
};

export default nextConfig;
