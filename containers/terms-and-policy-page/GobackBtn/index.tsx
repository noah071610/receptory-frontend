"use client"

import i18next from "@/i18n/init"
import { Langs } from "@/types/Main"
import cs from "classnames/bind"
import { useLayoutEffect } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function GobackBtn({ lang }: { lang: Langs }) {
  const { t } = useTranslation(["meta"])
  const onClickBack = () => {
    if (typeof window === "object") {
      window.close()
    }
  }

  useLayoutEffect(() => {
    if (i18next) {
      i18next.changeLanguage(lang)
    }
  }, [lang])

  return (
    <div className={cx("btn-wrapper")}>
      <button onClick={onClickBack}>
        <span>{t("close")}</span>
      </button>
    </div>
  )
}
