"use client"

import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { useParams } from "next/navigation"
import { memo } from "react"
import TextareaAutosize from "react-textarea-autosize"

function Textarea({
  className,
  inputType,
  targetIndex,
  value,
  isOptional,
  color,
}: {
  className?: string
  inputType: "title" | "description" | "cta"
  targetIndex?: number
  isOptional: boolean
  value: string
  color?: string
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const { setSection } = useEditStore()
  const onChangeInput = (e: any) => {
    if (typeof targetIndex === "number") {
      setSection({ type: "values", payload: e.target.value, arrIndex: targetIndex })
    } else {
      setSection({ type: "value", payload: e.target.value })
    }
  }

  return (
    <TextareaAutosize
      className={className}
      maxRows={3}
      placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
      value={value ?? ""}
      onChange={onChangeInput}
      style={{ color: !!color ? color : "#505056" }}
    />
  )
}

export default memo(Textarea)
