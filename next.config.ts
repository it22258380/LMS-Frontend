import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests from your local network during development
  allowedDevOrigins: [
    'http://192.168.43.254:3000',
    'http://localhost:3000',
  ],
  
  // Optional: Add experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

export default nextConfig;