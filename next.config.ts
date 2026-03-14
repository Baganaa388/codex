import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg'],
  reactCompiler: true,
  experimental: {
    useCache: true,
  },
  cacheLife: {
    seconds: { stale: 5, revalidate: 1, expire: 60 },
    minutes: { stale: 300, revalidate: 60, expire: 3600 },
    hours: { stale: 3600, revalidate: 900, expire: 86400 },
  },
};

export default nextConfig;
