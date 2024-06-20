import { getTemplates } from "@/actions/website"
import { _url, thumbnailUrl } from "@/config"
import TemplateCards from "@/containers/template-page/TemplateCards"
import { ssrTranslation } from "@/i18n"
import { TemplateCategoryType } from "@/types/Template"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import cs from "classnames/bind"
import PageError from "./error"
import style from "./style.module.scss"
const cx = cs.bind(style)

async function getLang() {
  return await getPreferredLanguage()
}
export async function generateMetadata() {
  const lang = await getLang()
  const { t } = await ssrTranslation(lang, ["meta"])

  return {
    metadataBase: new URL(_url.client),
    title: t("template") + " | " + t("receptori"),
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: `/images/favicon.ico`,
      },
    ],
    description: t("description"),
    openGraph: {
      description: t("description"),
      images: [
        {
          url: thumbnailUrl,
          width: 600,
          height: 315,
          alt: `receptori-thumbnail`,
        },
      ],
      type: "website",
      siteName: "receptori",
    },
    twitter: {
      card: "summary_large_image",
      title: t("template") + " | " + t("receptori"),
      description: t("description"),
      images: [
        {
          url: thumbnailUrl,
          width: 600,
          height: 315,
          alt: `receptori-thumbnail`,
        },
      ],
    },
  }
}

export default async function TemplatePageLayout() {
  const lang = await getLang()
  const { t } = await ssrTranslation(lang, ["template-page"])

  const data: TemplateCategoryType[] = await getTemplates(lang)
  if (!data) return <PageError lang={lang} type="notfound" />

  return (
    <div className={cx("main")}>
      <div className={cx("content")}>
        <div className={cx("banner")}>
          <h1>{t("template")}</h1>
          <p>{t("templateDescription")}</p>
        </div>
        {data.map(({ category, cards }, i) => (
          <div className={cx("category-wrapper")} key={`ct-${i}`}>
            <h1 className={cx("category-title")}>
              <span>{category}</span>
            </h1>
            <TemplateCards cards={cards} data={data} i={i} />
          </div>
        ))}
      </div>
    </div>
  )
}
