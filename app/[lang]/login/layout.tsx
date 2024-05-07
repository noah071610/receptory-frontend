import { useTranslation } from "@/i18n"
import { fallbackLng, languages } from "@/i18n/settings"
import { LangParams, LayoutLangParams } from "@/types/Main"

import { _url } from "@/config"
import style from "@/containers/login-page/style.module.scss"
import { getAnimation } from "@/utils/getAnimation"
import classNames from "classNames"
import Image from "next/image"
const cx = classNames.bind(style)

export async function generateMetadata({ params: { lang } }: LangParams) {
  if (languages.indexOf(lang) < 0) lang = fallbackLng
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = await useTranslation(lang, ["meta"])
  return {
    title: t("createNew"),
  }
}

export default async function LoginPageLayout({ children, params: { lang } }: Readonly<LayoutLangParams>) {
  return (
    <div className={cx(style.main)}>
      <div className={cx(style.content)}>
        <span style={getAnimation({ type: "fadeUpBig", delay: 100 })} className={cx(style.label)}>
          로그인
        </span>
        <h1 style={getAnimation({ type: "fadeUpBig", delay: 320 })}>지금 바로 만들어보세요</h1>
        <p style={getAnimation({ type: "fadeUpBig", delay: 600 })}>사람을 모으는 아름다운 툴</p>
        <ul>
          <li>
            <a href={`${_url.server}/auth/google`}>
              <div style={getAnimation({ type: "flip", delay: 1000 })} className={cx(style.left)}>
                <Image width={25} height={25} src="/images/icons/google.png" alt="google" />
              </div>
              <div style={getAnimation({ type: "fadeInRight", delay: 1200 })} className={cx(style.right)}>
                <h2>구글로 로그인</h2>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className={cx(style.disabled)}>
              <div style={getAnimation({ type: "flip", delay: 1200 })} className={cx(style.left)}>
                <Image width={25} height={25} src="/images/icons/facebook.png" alt="facebook" />
              </div>
              <div style={getAnimation({ type: "fadeInRight", delay: 1400 })} className={cx(style.right)}>
                <h2>페이스북으로 로그인</h2>
              </div>
            </a>
          </li>
        </ul>
        {children}
      </div>
    </div>
  )
}
