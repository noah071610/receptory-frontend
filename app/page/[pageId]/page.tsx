import SectionLayout from "@/components/Sections/display"
import { _url, noImageUrl } from "@/config"
import PageHome from "@/containers/page/Home"
import getSection from "@/containers/page/sectionPageMap"
import { ssrTranslation } from "@/i18n"
import { SectionType } from "@/types/Edit"
import { PageType } from "@/types/Page"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import hasString from "@/utils/helpers/hasString"
import PageError from "./error"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params: { pageId }, searchParams: { s } }: any) {
  const data = await getData(pageId)
  if (!data) {
    return {}
  }
  const { t } = await ssrTranslation(data.lang, ["meta"])
  let url = data.thumbnail
  if (hasString(data.thumbnail) && data.thumbnailType === "emoji") {
    const ogUrl = new URL(`${_url.client}/api/og/${encodeURIComponent(data.thumbnail ?? "")}`)
    url = ogUrl.toString()
  }

  return {
    metadataBase: new URL(_url.client),
    title: data.title,
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: `/images/favicon.ico`,
      },
    ],
    description: hasString(data.description) ? data.description : t("description"),

    openGraph: {
      description: hasString(data.description) ? data.description : t("description"),
      images: [
        {
          url: hasString(url) ? url : noImageUrl,
          width: 600,
          height: 315,
          alt: `${data.title}-thumbnail`,
        },
      ],
      type: "website",
      siteName: "receptori",
    },
    twitter: {
      card: "summary_large_image",
      title:
        data.title + (s === "form" ? ` | ${t("form")}` : s === "confirm" ? ` | ${t("confirm")}` : ` | ${t("home")}`),
      description: hasString(data.description) ? data.description : t("description"),
      images: [
        {
          url: hasString(url) ? url : noImageUrl,
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
    cache: "no-cache",
  })

  if (res.status === 404) return undefined
  return res.json()
}

const getSections = (sections: SectionType[]) => {
  return sections.map(async (v, i) => {
    const AwesomeComponent: any = await getSection(v.type)
    return AwesomeComponent ? (
      <SectionLayout
        style={{ paddingBottom: v.style?.paddingBottom }}
        id={v.id}
        index={i}
        isAnimation={true}
        noPadding={v.type === "thumbnail" || v.type === "slider"}
        key={`${v.id}`}
      >
        <AwesomeComponent section={v} text={v.value} isDisplayMode={true} />
      </SectionLayout>
    ) : (
      <section></section>
    )
  })
}

export default async function PageLayout({ params: { pageId }, searchParams: { s, confirmationId } }: any) {
  const initialData = await getData(pageId)
  const siteLang = await getPreferredLanguage()

  if (!initialData) return <PageError lang={siteLang} type="notfound" />
  if (initialData.format === "inactive") return <PageError lang={siteLang} type="inactive" />

  const { pageOptions, ...rest } = initialData.content

  const sections = {
    home: await Promise.all(getSections(rest.homeSections)),
    form: await Promise.all(getSections(rest.formSections)),
    confirm: await Promise.all(getSections(rest.confirmSections)),
  }

  const initialParams = !s?.trim() ? "home" : s === "form" ? "form" : "home"

  return (
    <PageHome
      lang={siteLang}
      confirmationId={confirmationId}
      initialParams={initialParams}
      sections={sections}
      initialData={initialData}
    />
  )
}
