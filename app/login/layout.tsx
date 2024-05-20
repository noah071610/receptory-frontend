import { PageParams } from "@/types/Main"

import { _url } from "@/config"
import style from "@/containers/login-page/style.module.scss"
import { getAnimation } from "@/utils/styles/getAnimation"
import cs from "classNames/bind"
import Image from "next/image"
const cx = cs.bind(style)

export default async function LoginPageLayout({ params: { lang } }: Readonly<PageParams>) {
  return (
    <div className={cx("main")}>
      <div className={cx("content")}>
        <span style={getAnimation({ type: "fadeUpBig", delay: 100 })} className={cx("label")}>
          로그인
        </span>
        <h1 style={getAnimation({ type: "fadeUpBig", delay: 320 })}>지금 바로 만들어보세요</h1>
        <p style={getAnimation({ type: "fadeUpBig", delay: 600 })}>사람을 모으는 아름다운 툴</p>
        <ul>
          <li>
            <a href={`${_url.server}/auth/google`}>
              <div style={getAnimation({ type: "flip", delay: 1000 })} className={cx("left")}>
                <Image width={25} height={25} src="/images/icons/google.png" alt="google" />
              </div>
              <div style={getAnimation({ type: "fadeInRight", delay: 1200 })} className={cx("right")}>
                <h2>구글로 로그인</h2>
              </div>
            </a>
          </li>
          <li>
            <a href="#" className={cx("disabled")}>
              <div style={getAnimation({ type: "flip", delay: 1200 })} className={cx("left")}>
                <Image width={25} height={25} src="/images/icons/facebook.png" alt="facebook" />
              </div>
              <div style={getAnimation({ type: "fadeInRight", delay: 1400 })} className={cx("right")}>
                <h2>페이스북으로 로그인</h2>
              </div>
            </a>
          </li>
        </ul>
      </div>
    </div>
  )
}
