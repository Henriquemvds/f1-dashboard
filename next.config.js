/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "example.com"], // se usar imagens externas
  },
  experimental: {
    appDir: true
  }
};

module.exports = nextConfig;