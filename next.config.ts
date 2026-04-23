import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'airbnbnew.cybersoft.edu.vn', // Tên miền chứa ảnh của bạn
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'www.w3.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
