import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimized for Vercel deployment (Node.js runtime)
  images: {
    domains: ['localhost', 'harees-ahmed.github.io'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Enable experimental features for better performance
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
