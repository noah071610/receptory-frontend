import { getSitemapPages } from "@/actions/page"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getSitemapPages()
  return [
    {
      url: `https://${process.env.NEXT_PUBLIC_DOMAIN}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `https://${process.env.NEXT_PUBLIC_DOMAIN}/template`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...pages.map((page: any) => {
      return {
        url: `https://${process.env.NEXT_PUBLIC_DOMAIN}/page/${page.customLink}`,
        lastModified: page.createdAt,
        priority: 0.8,
        changeFrequency: "always",
      }
    }),
  ]
}
