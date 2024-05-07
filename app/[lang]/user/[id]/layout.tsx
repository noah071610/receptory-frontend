import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import { LangParams, LayoutLangParams } from "@/types/Main"

import style from "@/containers/login-page/style.module.scss"
import classNames from "classNames"
const cx = classNames.bind(style)

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
    <div className={cx(style.main)}>
      <div className={cx(style.content)}>{children}</div>
    </div>
  )
}
