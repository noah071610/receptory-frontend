"use client"

import IconBtn from "@/components/IconBtn"
import { queryKey } from "@/config"
import { useEditorStore } from "@/store/editor"
import { saveContentFromEditor } from "@/utils/editor/saveContentFromEditor"
import { faCheck, faSave } from "@fortawesome/free-solid-svg-icons"
import { useQueryClient } from "@tanstack/react-query"
import { useParams } from "next/navigation"
import { useCallback, useState } from "react"
import style from "./style.module.scss"

function SaveBtn() {
  const [isSaving, setIsSaving] = useState(false)
  const queryClient = useQueryClient()
  const { pageId } = useParams()
  const {
    stage,
    homeSections,
    formSections,
    currentUsedImages,
    currentUsedColors,
    setRevert,
    confirmSections,
    pageOptions,
  } = useEditorStore([
    "stage",
    "homeSections",
    "formSections",
    "currentUsedImages",
    "currentUsedColors",
    "setRevert",
    "confirmSections",
    "pageOptions",
  ])

  const onClickSave = useCallback(async () => {
    if (!isSaving) {
      const isOk = await saveContentFromEditor({
        content: {
          stage,
          homeSections,
          formSections,
          confirmSections,
          currentUsedImages,
          currentUsedColors,
          pageOptions,
        },
        pageId,
        lang: pageOptions.lang,
      })

      if (isOk) {
        await queryClient.invalidateQueries({ queryKey: queryKey.save.list })
        setRevert("clear")
      }

      setIsSaving(true)
      setTimeout(() => {
        setIsSaving(false)
      }, 3000)
    }
  }, [
    isSaving,
    stage,
    homeSections,
    formSections,
    confirmSections,
    currentUsedImages,
    currentUsedColors,
    pageOptions,
    pageId,
    queryClient,
    setRevert,
  ])

  return isSaving ? (
    <IconBtn iconClassName={style.saving} icon={faCheck} />
  ) : (
    <IconBtn onclick={onClickSave} icon={faSave} />
  )
}

export default SaveBtn
