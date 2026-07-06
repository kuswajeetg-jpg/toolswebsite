import withPWAInit from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const withPWA = withPWAInit({
  dest: "public",
  disable: true, // Temporarily disabled to bypass VPS build hang
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable linting and type checking during builds to save memory
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable worker threads to run everything in a single process and prevent hangs
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default withNextIntl(withPWA(nextConfig));
