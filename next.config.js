/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: true,
  openAnalyzer: true,
  swcMinify: true,
})

module.exports = withBundleAnalyzer({
  compress: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  i18n,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: `${process.env.NEXT_PUBLIC_BUTKET_NAME}.s3.ap-northeast-2.amazonaws.com`,
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: `cdn.jsdelivr.net`,
        port: "",
        pathname: "**",
      },
    ],
  },
  webpack(config) {
    const prod = process.env.NODE_ENV === "production"
    const plugins = [...config.plugins]
    return {
      ...config,
      mode: prod ? "production" : "development",
      plugins: plugins,
    }
  },
})
