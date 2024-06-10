import InsightPage from "@/containers/insight-page"
import { useTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"

async function getLang() {
  return await getPreferredLanguage()
}
export async function generateMetadata() {
  const lang = await getLang()
  const { t } = await useTranslation(lang, ["meta"])

  return {
    title: t("insight") + " | " + "Receptory",
  }
}

export default async function InsightPageLayout() {
  const lang = await getLang()

  return <InsightPage lang={lang} />
}
