"use client"

import { refreshUser } from "@/actions/user"
import { selectTemplate } from "@/actions/website"
import PageLoading from "@/components/Loading/LoadingPage"
import { _url, queryKey } from "@/config"
import style from "@/containers/login-page/style.module.scss"
import { useInitTranslation } from "@/i18n/client"
import { Langs } from "@/types/Main"
import { Providers, UserType } from "@/types/User"
import { getAnimation } from "@/utils/styles/getAnimation"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classnames/bind"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
const cx = cs.bind(style)

export default function LoginPage({ lang }: { lang: Langs }) {
  const queryClient = useQueryClient()
  const { t } = useInitTranslation(lang, ["login"])
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const templateId = searchParams.get("templateId")
  const { push } = useRouter()

  const onClickSocialLogin = async (provider: Providers) => {
    setIsLoading(true)
    const newWindow = window.open(`${_url.server}/auth/${provider}`, "_blank", "width=600,height=400")

    window.addEventListener("message", async (event) => {
      // 받은 메시지가 B페이지에서 보낸 것인지 확인합니다.
      if (event.source === newWindow) {
        // B페이지에서 전달받은 정보를 처리하는 함수를 호출합니다.

        if (event.data.userId) {
          const user = await refreshUser()
          if (templateId) {
            const newSave = await selectTemplate(templateId)
            await queryClient.setQueryData(queryKey.user, user)
            if (newSave) {
              await queryClient.invalidateQueries({ queryKey: queryKey.save.list })
              push(`/edit/${event.data.userId}/${newSave.pageId}`)
            }
          } else {
            await queryClient.setQueryData(queryKey.user, user)
            push(`/user/${event.data.userId}`)
          }
        }
      }
    })
  }

  useEffect(() => {
    const focusEvent = async () => {
      const existUser: UserType | null = await refreshUser()
      queryClient.setQueryData(queryKey.user, existUser)
      if (existUser) {
        push(`/user/${existUser.userId}`)
      }
    }
    window.addEventListener("focus", focusEvent)
    return () => {
      window.removeEventListener("focus", focusEvent)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={cx("main")}>
      <PageLoading isLoading={isLoading} />
      <div className={cx("content")}>
        <span style={getAnimation({ type: "fadeUpBig", delay: 100 })} className={cx("label")}>
          {t("login")}
        </span>
        <h1
          style={getAnimation({ type: "fadeUpBig", delay: 320 })}
          dangerouslySetInnerHTML={{ __html: t("title") }}
        ></h1>
        <p style={getAnimation({ type: "fadeUpBig", delay: 600 })}>{t("description")}</p>
        <ul>
          <li>
            <button onClick={() => onClickSocialLogin("google")}>
              <div style={getAnimation({ type: "flip", delay: 1000 })} className={cx("left")}>
                <Image width={25} height={25} src="/images/icons/google.png" alt="google" />
              </div>
              <div style={getAnimation({ type: "fadeInRight", delay: 1200 })} className={cx("right")}>
                <h2>{t("googleLogin")}</h2>
              </div>
            </button>
          </li>
          <li>
            <button className={cx("disabled")} disabled={true} onClick={() => onClickSocialLogin("facebook")}>
              <div style={getAnimation({ type: "flip", delay: 1200 })} className={cx("left")}>
                <Image width={25} height={25} src="/images/icons/facebook.png" alt="facebook" />
              </div>
              <div style={getAnimation({ type: "fadeInRight", delay: 1400 })} className={cx("right")}>
                <h2>{t("facebookLogin")}</h2>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}
