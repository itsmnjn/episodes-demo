import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  outputFileTracingIncludes: {
    "/**": ["./content/**/*.json"],
  },
};

export default nextConfig;
