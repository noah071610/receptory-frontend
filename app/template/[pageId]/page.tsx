import { _url } from "@/config"
import TemplatePageHome from "@/containers/template-page/TemplatePage"
import { PageParams } from "@/types/Main"
import { TemplatePage } from "@/types/Template"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import PageError from "./error"

export async function generateMetadata({ params: { pageId }, searchParams: { s } }: PageParams) {
  const data = await getData(pageId)
  if (!data) {
    return {}
  }

  return {
    title: data.title + " | Receptory",
    icons: {
      icon: `/images/favicon.png`, // /public path
    },
    description: data.description ?? "",
    // openGraph: {
    //   description: data.description ?? "",
    //   images: [
    //     {
    //       url: hasString(data.thumbnail) ? data.thumbnail : "./images/thumbnail.jpg",
    //       width: 600,
    //       height: 315,
    //       alt: `${data.title}-thumbnail`,
    //     },
    //   ],
    //   type: "website",
    //   siteName: "receptory",
    // },
    // twitter: {
    //   card: "summary_large_image",
    //   title:
    //     data.title + (s === "form" ? ` | ${t("form")}` : s === "confirm" ? ` | ${t("confirm")}` : ` | ${t("home")}`),
    //   description: data.description ?? "",
    //   images: [
    //     {
    //       url: hasString(data.thumbnail) ? data.thumbnail : "./images/thumbnail.jpg",
    //       width: 600,
    //       height: 315,
    //       alt: `${data.title}-thumbnail`,
    //     },
    //   ],
    // },
  }
}

async function getData(pageId: string): Promise<TemplatePage | undefined> {
  const res = await fetch(`${_url.server}/website/template?pageId=${pageId}`, {
    method: "GET",
  })

  if (res.status === 404) return undefined
  return res.json()
}

export default async function TemplatePageLayout({ params: { pageId }, searchParams: { s } }: PageParams) {
  const initialData = await getData(pageId)
  const siteLang = await getPreferredLanguage()

  if (!initialData) return <PageError lang={siteLang} type="notfound" />
  if (initialData.isSecret === 1) return <PageError lang={siteLang} type="inactive" />

  const { pageOptions, ...rest } = initialData.content
  const sections = s === "form" ? rest.formSections : s === "confirm" ? rest.confirmSections : rest.homeSections

  return <TemplatePageHome initialParams={!s?.trim() ? "home" : s} sections={sections} initialData={initialData} />
}
