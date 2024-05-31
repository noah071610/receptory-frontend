"use client"

import { deploy, inactivePage } from "@/actions/page"
import { queryKey } from "@/config"
import { toastError, toastSuccess } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { Langs } from "@/types/Main"
import { SaveContentType } from "@/types/Page"
import { useQueryClient } from "@tanstack/react-query"
import cs from "classNames/bind"
import { useParams } from "next/navigation"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Rending({}: {}) {
  const queryClient = useQueryClient()
  const { pageId } = useParams()
  const { t } = useTranslation()
  const {
    stage,
    homeSections,
    formSections,
    currentUsedImages,
    currentUsedColors,
    rendingSections,
    pageOptions,
    setPageOptions,
    saveSectionHistory,
  } = useEditorStore()
  const { format, customLink } = pageOptions
  const isActive = format === "active"
  const [isSaving, setIsSaving] = useState(false)

  const clearQueryCached = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKey.page(pageId as string) })
    await queryClient.invalidateQueries({ queryKey: queryKey.save.list })
  }

  const onChangeFormat = async (value: "inactive" | "active" | "save") => {
    if (typeof pageId !== "string") return
    if (formSections.length <= 1) return toastError("폼에 적어도 한개 이상의 섹션이 필요합니다")

    const payload = {
      content: {
        stage,
        homeSections,
        formSections,
        rendingSections,
        currentUsedImages,
        currentUsedColors,
        pageOptions: {
          ...pageOptions,
          format: "active",
        },
      },
      pageId,
      lang: pageOptions.lang as Langs,
    } as { content: SaveContentType; pageId: string; lang: Langs }

    if (value === "active" || value === "save") {
      if (!isSaving) {
        const isOk = await deploy(payload) // action에서 자동으로 backend용 input 타입으로 변환 해줌.
        setIsSaving(true)
        setTimeout(() => {
          setIsSaving(false)
        }, 3000)

        if (isOk) {
          toastSuccess(value === "save" ? "저장 후 적용했어요!" : "포스팅 성공!")
          await clearQueryCached()
        }
      }
      setPageOptions({ type: "format", payload: "active" })
    }
    if (value === "inactive") {
      payload.content.pageOptions.format = "inactive"
      const isOk = await inactivePage({ pageId })
      if (isOk) {
        toastSuccess("페이지를 비활성화 했어요.")
      }
      setPageOptions({ type: "format", payload: "inactive" })
    }
    saveSectionHistory()
  }
  return (
    <div className={cx("layout")}>
      <div className={cx("deploy-wrapper")}>
        <div className={cx("float-message", { active: isActive })}>
          <p>{isActive ? "현재 배포중이에요!" : "거의 다 왔어요!"}</p>
        </div>
        <button onClick={() => onChangeFormat(isActive ? "save" : "active")} className={cx("deploy")}>
          <span>{isActive ? "저장하고 적용하기" : "배포하기"}</span>
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
