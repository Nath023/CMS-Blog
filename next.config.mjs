/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'date-fns', 'motion'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/blog',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
