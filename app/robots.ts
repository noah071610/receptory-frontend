import { _url } from "@/config"
import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      disallow: ["/$", "/edit", "/insight", "/user", "/admin"],
      allow: ["/page", "/template", "/login"],
    },
    sitemap: [`${_url.client}/sitemap.xml`],
  }
}
