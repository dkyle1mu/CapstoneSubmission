import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Kind of gave up on this but hopefully it works? 
  allowedDevOrigins: ['localhost', 'local-origin.dev', '*.local-origin.dev', '192.168.4.100', '*.192.168.4.100', '*', '*.127.0.0.1', 'http://127.0.0.1:3000', 'https://127.0.0.1:3000'],
  //It does not.
};

module.exports = {
  output: "standalone",
};

export default nextConfig;

