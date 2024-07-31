import { _url, thumbnailUrl } from "@/config"
import LoginPage from "@/containers/login-page"
import { ssrTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"

async function getLang() {
  return await getPreferredLanguage()
}
export async function generateMetadata() {
  const lang = await getLang()
  const { t } = await ssrTranslation(lang, ["meta"])

  return {
    metadataBase: new URL(_url.client),
    title: t("login") + " | " + t("receptori"),
    icons: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: `/images/favicon.ico`,
      },
    ],
    description: t("description"),
    openGraph: {
      title: t("login") + " | " + t("receptori"),
      description: t("description"),
      images: {
        url: thumbnailUrl,
        width: 600,
        height: 315,
        alt: `receptori-thumbnail`,
      },
      type: "website",
      siteName: "receptori",
    },
    twitter: {
      card: "summary_large_image",
      title: t("login") + " | " + t("receptori"),
      description: t("description"),
      images: {
        url: thumbnailUrl,
        width: 600,
        height: 315,
        alt: `receptori-thumbnail`,
      },
    },
  }
}

export default async function LoginPageLayout() {
  const lang = await getLang()
  return <LoginPage lang={lang} />
}
