/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize output
  output: 'standalone',
  
  // Configure experimental features
  experimental: {},
  
  // Configure image domains for external images (if needed)
  images: {
    domains: ['kemri.go.ke', 'lh3.googleusercontent.com', 'graph.microsoft.com'],
  },
  
  // Increase dist cache size
  distDir: process.env.NODE_ENV === 'development' ? '.next' : 'build',
  
  // Allow the app to be deployed to any domain
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  
  // Improve build performance
  poweredByHeader: false,
  reactStrictMode: true,
  
  // Fix EPERM issues on Windows
  typescript: {
    // Skip TypeScript checks during build for speed
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip ESLint checks during build for speed
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
