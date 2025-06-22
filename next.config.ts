/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors and warnings during build
  },
  webpack(config: any, { isServer }: { isServer: boolean }) {
    // Suppress warnings in the client-side build (only for production)
    if (!isServer) {
      config.stats = "errors-only"; // Show only errors in the client build
    }
    return config;
  },
};

module.exports = nextConfig;
