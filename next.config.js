/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    // Enable image optimization improvements in Next.js 15
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Enable bundler optimizations
  bundlePagesRouterDependencies: true,
  // Optimize package imports
  transpilePackages: ['next-themes'],
  // Enable compiler optimizations
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = nextConfig;