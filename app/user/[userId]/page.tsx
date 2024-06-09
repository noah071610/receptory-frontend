import UserPage from "@/containers/user-page"
import { useTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"

async function getLang() {
  return await getPreferredLanguage()
}

export async function generateMetadata() {
  const lang = await getLang()
  const { t } = await useTranslation(lang, ["meta"])

  return {
    title: t("dashboard") + " | " + "Receptory",
  }
}

export default async function UserPageLayout() {
  const lang = await getLang()
  return <UserPage lang={lang} />
}
