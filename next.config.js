/** @type {import('next').NextConfig} */

const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "firebasestorage.googleapis.com"],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig
