import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: "brown-glamorous-bear-418.mypinata.cloud",
      },
      {
        hostname: "gateway.pinata.cloud",
      },
      {
        hostname: "raw.githubusercontent.com",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
