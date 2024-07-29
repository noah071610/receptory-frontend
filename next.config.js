/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
  openAnalyzer: true,
  swcMinify: true,
})

module.exports = withBundleAnalyzer({
  compress: true,
  output: "standalone",
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  async redirects() {
    // todo: 너무 이상하다
    return [
      {
        source: "/en",
        destination: "/login",
        permanent: false,
        locale: false,
      },
      {
        source: "/ko",
        destination: "/login",
        permanent: false,
        locale: false,
      },
      {
        source: "/th",
        destination: "/login",
        permanent: false,
        locale: false,
      },
      {
        source: "/ja",
        destination: "/login",
        permanent: false,
        locale: false,
      },
    ]
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
      // todo:
      // {
      //   protocol: "https",
      //   hostname: `${process.env.NEXT_PUBLIC_BUCKET_NAME}.s3.`,
      //   port: "",
      //   pathname: "/images/**",
      // },
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
