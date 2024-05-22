const { prependListener } = require("process")

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false, // todo:
  openAnalyzer: true,
  swcMinify: true,
})

module.exports = withBundleAnalyzer({
  compress: true,
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
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
