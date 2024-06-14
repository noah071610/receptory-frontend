import EditPage from "@/containers/edit-page"
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
    title: t("edit") + " | " + "Receptory",
  }
}

export default async function EditPageLayout() {
  const lang = await getLang()
  return <EditPage lang={lang} />
}