import EditPage from "@/containers/edit-page"
import { useTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"

async function getLang() {
  return await getPreferredLanguage()
}

export async function generateMetadata() {
  const lang = await getLang()
  const { t } = await useTranslation(lang, ["meta"])

  return {
    title: t("edit") + " | " + "Receptory",
  }
}

export default async function EditPageLayout() {
  const lang = await getLang()
  return <EditPage lang={lang} />
}
