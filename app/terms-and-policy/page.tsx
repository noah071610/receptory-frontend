import GobackBtn from "@/containers/terms-and-policy-page/GobackBtn"
import EnTerms from "@/containers/terms-and-policy-page/en"
import KoTerms from "@/containers/terms-and-policy-page/ko"
import { ssrTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import cs from "classnames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

async function getLang() {
  return await getPreferredLanguage()
}
export async function generateMetadata() {
  const lang = await getLang()
  const { t } = await ssrTranslation(lang, ["meta"])

  return {
    title: t("terms-and-policy") + " | " + "Receptory",
  }
}

export default async function TermsAndPolicyPage() {
  const lang = await getPreferredLanguage()

  return (
    <div className={cx("main")}>
      <div className={cx("content")}>
        {lang === "ko" ? <KoTerms /> : <EnTerms />}
        <GobackBtn lang={lang} />
      </div>
    </div>
  )
}
