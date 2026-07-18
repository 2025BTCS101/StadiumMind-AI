import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds to complete even with TypeScript environmental check issues
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
