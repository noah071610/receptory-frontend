import UserPage from "@/containers/user-page"
import { ssrTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"

async function getLang() {
  return await getPreferredLanguage()
}

export async function generateMetadata() {
  const lang = await getLang()

  const { t } = await ssrTranslation(lang, ["meta"])

  return {
    title: t("dashboard") + " | " + "Receptori",
    description: t("description"),
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: `/images/favicon.ico`,
      },
    ],
  }
}

export default async function UserPageLayout() {
  const lang = await getLang()
  return <UserPage lang={lang} />
}
