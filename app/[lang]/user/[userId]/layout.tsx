import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import { LangParams, LayoutLangParams } from "@/types/Main"

export async function generateMetadata({ params: { lang } }: LangParams) {
  if (languages.indexOf(lang) < 0) lang = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang, ["meta"])
  return {
    title: t("createNew"),
  }
}

export default async function UserPageLayout({ children, params: { lang } }: Readonly<LayoutLangParams>) {
  return <>{children}</>
}
