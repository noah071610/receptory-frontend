import { _url } from "@/config"
import PageHome from "@/containers/page/Home"
import { ssrTranslation } from "@/i18n"
import { PageParams } from "@/types/Main"
import { PageType } from "@/types/Page"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import hasString from "@/utils/helpers/hasString"
import PageError from "./error"

export async function generateMetadata({ params: { pageId }, searchParams: { s } }: Readonly<PageParams>) {
  const data = await getData(pageId)
  if (!data) {
    return {}
  }
  const { t } = await ssrTranslation(data.lang, ["meta"])

  return {
    title: data.title + (s === "form" ? ` | ${t("form")}` : s === "confirm" ? ` | ${t("confirm")}` : ` | ${t("home")}`),
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
      title:
        data.title + (s === "form" ? ` | ${t("form")}` : s === "confirm" ? ` | ${t("confirm")}` : ` | ${t("home")}`),
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

async function getData(pageId: string): Promise<PageType | undefined> {
  const res = await fetch(`${_url.server}/page?pageId=${pageId}`, {
    method: "GET",
  })

  if (res.status === 404) return undefined
  return res.json()
}

export default async function PageLayout({ params: { pageId }, searchParams: { s } }: Readonly<PageParams>) {
  const initialData = await getData(pageId)
  const siteLang = await getPreferredLanguage()

  if (!initialData) return <PageError lang={siteLang} type="notfound" />
  if (initialData.format === "inactive") return <PageError lang={siteLang} type="inactive" />

  const { pageOptions, ...rest } = initialData.content
  const sections = s === "form" ? rest.formSections : s === "confirm" ? rest.confirmSections : rest.homeSections

  return <PageHome initialParams={!s?.trim() ? "home" : s} sections={sections} initialData={initialData} />
}
