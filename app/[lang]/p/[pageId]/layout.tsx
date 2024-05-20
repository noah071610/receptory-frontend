import style from "@/containers/page/style.module.scss"
import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import { LangParams, LayoutLangParams } from "@/types/Main"
import cs from "classNames/bind"
const cx = cs.bind(style)

export async function generateMetadata({ params: { lang } }: LangParams) {
  if (languages.indexOf(lang) < 0) lang = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang, ["meta"])
  return {
    title: t("createNew"),
  }
}

export default async function PageLayout({ children, params: { lang } }: Readonly<LayoutLangParams>) {
  return (
    <>
      <div className={cx("body")}>
        <main className={cx("main")}>{children}</main>
      </div>
    </>
  )
}
