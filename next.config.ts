/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Ignore TypeScript errors during build
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.stats = "errors-only"; // ✅ Suppress Webpack client warnings
    }
    return config;
  },
};

module.exports = nextConfig;
