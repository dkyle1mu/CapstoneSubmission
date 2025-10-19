import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['local-origin.dev', '*.local-origin.dev', '192.168.4.100', '*.192.168.4.100']
};

module.exports = {
  output: "standalone",
};

export default nextConfig;

