import InsightPage from "@/containers/insight-page"
import { ssrTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"

async function getLang() {
  return await getPreferredLanguage()
}

export async function generateMetadata() {
  const lang = await getLang()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await ssrTranslation(lang, ["meta"])

  return {
    title: t("insight") + " | " + "Receptory",
  }
}

export default async function InsightPageLayout() {
  const lang = await getLang()

  return <InsightPage lang={lang} />
}
