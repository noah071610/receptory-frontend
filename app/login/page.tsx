import { _url } from "@/config"
import style from "@/containers/login-page/style.module.scss"
import { ssrTranslation } from "@/i18n"
import getPreferredLanguage from "@/utils/helpers/getPreferredLanguage"
import { getAnimation } from "@/utils/styles/getAnimation"
import cs from "classNames/bind"
import Image from "next/image"
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
  const { t } = await ssrTranslation(lang, ["login"])

  return (
    <div className={cx("main")}>
      <div className={cx("content")}>
        <span style={getAnimation({ type: "fadeUpBig", delay: 100 })} className={cx("label")}>
          {t("login")}
        </span>
        <h1 style={getAnimation({ type: "fadeUpBig", delay: 320 })}>{t("title")}</h1>
        <p style={getAnimation({ type: "fadeUpBig", delay: 600 })}>{t("description")}</p>
        <ul>
          <li>
            <a href={`${_url.server}/auth/google`}>
              <div style={getAnimation({ type: "flip", delay: 1000 })} className={cx("left")}>
                <Image width={25} height={25} src="/images/icons/google.png" alt="google" />
              </div>
              <div style={getAnimation({ type: "fadeInRight", delay: 1200 })} className={cx("right")}>
                <h2>{t("googleLogin")}</h2>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className={cx("disabled")}>
              <div style={getAnimation({ type: "flip", delay: 1200 })} className={cx("left")}>
                <Image width={25} height={25} src="/images/icons/facebook.png" alt="facebook" />
              </div>
              <div style={getAnimation({ type: "fadeInRight", delay: 1400 })} className={cx("right")}>
                <h2>{t("facebookLogin")}</h2>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
