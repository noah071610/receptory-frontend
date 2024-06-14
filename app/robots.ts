import { _url } from "@/config"
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/page", "/template", "/login"],
      disallow: "*",
    },
    sitemap: [`${_url.client}/sitemap.xml`],
  }
}
