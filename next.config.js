/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "firebasestorage.googleapis.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig
