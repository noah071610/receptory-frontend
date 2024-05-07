import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import { LangParams, LayoutLangParams } from "@/types/Main"

import EditorFooter from "@/containers/edit-page/EditorFooter"
import PageLayout from "@/containers/edit-page/PageLayout"
import Preview from "@/containers/edit-page/Preview"
import style from "@/containers/edit-page/style.module.scss"
import Header from "@/containers/global/Header"
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

export default async function EditPageLayout({ children, params: { lang } }: Readonly<LayoutLangParams>) {
  return (
    <>
      <Header />
      <PageLayout>
        <div className={cx(style.main)}>
          <div className={cx(style.editor)}>
            {children}
            <EditorFooter />
          </div>
          <Preview />
        </div>
      </PageLayout>
    </>
  )
}
