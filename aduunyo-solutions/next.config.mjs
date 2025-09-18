import { fileURLToPath } from 'url';
import path from 'path';

// Get the directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Configure image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Enable server-side rendering for all pages
  output: 'standalone',
  
  // Enable experimental features
  experimental: {
    serverActions: {
      // Enable server actions
      enabled: true,
    },
  },
  
  // Configure output file tracing root to handle monorepo structure
  // Using process.cwd() instead of __dirname to avoid ES module issues
  outputFileTracingRoot: process.cwd(),
  
  // Configure redirects if needed
  async redirects() {
    return [];
  },
};

export default nextConfig;
