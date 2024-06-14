"use client"

import i18next from "@/i18n/init"
import { Langs } from "@/types/Main"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
export default function PageError({ type, lang }: { type: "notfound" | "inactive"; lang: Langs }) {
  const { back } = useRouter()

  i18next.changeLanguage(lang)
  const { t } = useTranslation(["messages"], {
    lng: lang,
  })

  useEffect(() => {
    switch (type) {
      case "notfound":
        alert(t("error.noFound"))
        break
      case "inactive":
        alert(t("error.inactivePage"))
        break
    }
    back()
  }, [type, lang, t, back])

  return <></>
}
