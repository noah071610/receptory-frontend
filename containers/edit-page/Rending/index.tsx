"use client"

import { deploy } from "@/actions/page"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { Langs } from "@/types/Main"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useState } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Rending({}: {}) {
  const { lang, pageId } = useParams()
  const { t } = useTranslation()
  const {
    stage,
    initSections,
    formSections,
    currentUsedImages,
    currentUsedColors,
    rendingSections,
    pageOptions,
    setPageOptions,
  } = useEditorStore()
  const { format, customLink } = pageOptions
  const isActive = format === "active"
  const [isSaving, setIsSaving] = useState(false)

  const onChangeFormat = async (value: "inactive" | "active" | "save") => {
    if (typeof pageId !== "string") return

    if (value === "save") {
      if (!isSaving) {
        await deploy({
          content: {
            stage,
            initSections,
            formSections,
            rendingSections,
            currentUsedImages,
            currentUsedColors,
            pageOptions,
          },
          pageId,
          lang: lang as Langs,
        })
        setIsSaving(true)
        setTimeout(() => {
          setIsSaving(false)
        }, 3000)
      }
    }
    if (value === "active") {
    }
    setPageOptions({ type: "format", payload: value })
  }
  return (
    <div className={cx("layout")}>
      <div className={cx("deploy-wrapper")}>
        <div className={cx("float-message", { active: isActive })}>
          <p>{isActive ? "현재 배포중이에요!" : "거의 다 왔어요!"}</p>
        </div>
        <button onClick={() => onChangeFormat(isActive ? "save" : "active")} className={cx("deploy")}>
          <span>{isActive ? "저장하기" : "배포하기"}</span>
        </button>
      </div>
      {isActive && (
        <button onClick={() => onChangeFormat("inactive")} className={cx("undeploy")}>
          <span>배포중지</span>
        </button>
      )}
    </div>
  )
}
