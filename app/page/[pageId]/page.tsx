import PageHome from "@/containers/page/Home"
import { PageParams } from "@/types/Main"
import { PageType } from "@/types/Page"
import hasString from "@/utils/helpers/hasString"

export async function generateMetadata({ params: { pageId }, searchParams: { s } }: Readonly<PageParams>) {
  const data = await getData(pageId)

  return {
    // todo: 번역 필요
    title: data.title + (s === "form" ? " | form" : s === "confirm" ? " | confirm" : " | home"),
    icons: {
      icon: `/images/favicon.png`, // /public path
    },
    description: data.description ?? "",
    openGraph: {
      description: data.description ?? "",
      images: [
        {
          url: hasString(data.thumbnail) ? data.thumbnail : "./images/thumbnail.jpg",
          width: 600,
          height: 315,
          alt: `${data.title}-thumbnail`,
        },
      ],
      type: "website",
      siteName: "receptory",
    },
    twitter: {
      card: "summary_large_image",
      title: data.title + (s === "form" ? " | form" : s === "confirm" ? " | confirm" : " | home"),
      description: data.description ?? "",
      images: [
        {
          url: hasString(data.thumbnail) ? data.thumbnail : "./images/thumbnail.jpg",
          width: 600,
          height: 315,
          alt: `${data.title}-thumbnail`,
        },
      ],
    },
  }
}

async function getData(pageId: string): Promise<PageType> {
  const res = await fetch(`http://localhost:5555/api/page?pageId=${pageId}`, {
    method: "GET",
  })
  return res.json()
}

export default async function PageLayout({ children, params: { pageId }, searchParams: { s } }: Readonly<PageParams>) {
  const initialData = await getData(pageId)

  return <PageHome initialParams={s} initialData={initialData} />
}
