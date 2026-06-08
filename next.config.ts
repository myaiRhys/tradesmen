import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Specify the root directory for Turbopack
  turbopack: {
    root: ".",
  },
};

export default nextConfig;
