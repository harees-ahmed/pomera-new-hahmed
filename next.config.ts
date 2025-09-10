import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure basePath and assetPrefix for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/pomera-new-hahmed' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/pomera-new-hahmed' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
