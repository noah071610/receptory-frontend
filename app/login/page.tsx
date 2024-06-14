import LoginPage from "@/containers/login-page"
import style from "@/containers/login-page/style.module.scss"
import { ssrTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import cs from "classnames/bind"
const cx = cs.bind(style)

async function getLang() {
  return await getPreferredLanguage()
}
export async function generateMetadata() {
  const lang = await getLang()
  const { t } = await ssrTranslation(lang, ["login"])

  return {
    title: t("login") + " | " + "Receptory",
  }
}

export default async function LoginPageLayout() {
  const lang = await getLang()

  return <LoginPage lang={lang} />
}
