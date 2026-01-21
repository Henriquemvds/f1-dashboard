/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Se você usava domains, substitua por remotePatterns
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ou especifique os domínios confiáveis
      },
    ],
  },
  experimental: {
    // Remova appDir se estiver definido
    // appDir: true
  },
};

module.exports = nextConfig;