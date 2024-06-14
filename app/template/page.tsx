import { getTemplates } from "@/actions/website"
import TemplateCards from "@/containers/template-page/TemplateCards"
import { ssrTranslation } from "@/i18n"
import { TemplateCategoryType } from "@/types/Template"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import cs from "classNames/bind"
import PageError from "./error"
import style from "./style.module.scss"
const cx = cs.bind(style)

async function getLang() {
  return await getPreferredLanguage()
}
export async function generateMetadata() {
  const lang = await getLang()
  const { t } = await ssrTranslation(lang, ["login"])

  return {
    title: t("template") + " | " + "Receptory",
  }
}

export default async function TemplatePageLayout() {
  const lang = await getLang()
  const { t } = await ssrTranslation(lang, ["login"])

  const data: TemplateCategoryType[] = await getTemplates(lang)
  if (!data) return <PageError lang={lang} type="notfound" />

  return (
    <div className={cx("main")}>
      <div className={cx("content")}>
        <div className={cx("banner")}>
          <h1>템플릿</h1>
          <p>템플릿으로 3초만에 나만의 홈페이지 제작</p>
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
