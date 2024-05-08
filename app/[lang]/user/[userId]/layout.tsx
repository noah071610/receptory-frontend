import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import { LangParams, LayoutLangParams } from "@/types/Main"

import style from "@/containers/user-page/style.module.scss"
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

export default async function UserPageLayout({ children, params: { lang } }: Readonly<LayoutLangParams>) {
  return (
    <div className={cx("main")}>
      <div className={cx("content")}>{children}</div>
    </div>
  )
}
