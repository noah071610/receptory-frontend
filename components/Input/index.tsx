"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { StyleProperties } from "@/types/Edit"
import { useParams } from "next/navigation"
import { memo } from "react"

function Input({
  className,
  inputType,
  style,
  value,
  dataKey,
  listIndex,
  isOptional,
}: {
  className?: string
  inputType: string
  isOptional: boolean
  listIndex?: number
  dataKey?: "title" | "description"
  value: string
  style?: StyleProperties
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const { setValue, setList, setData } = useEditorStore()
  const onChangeInput = (e: any) => {
    if (dataKey) {
      if (typeof listIndex === "number")
        return setList({ payload: e.target.value, index: listIndex, key: "data", dataKey })
      setData({ payload: e.target.value, key: dataKey })
    } else {
      if (typeof listIndex === "number") return setList({ payload: e.target.value, index: listIndex, key: "value" })
      setValue({ payload: e.target.value })
    }
  }

  return (
    <input
      className={className}
      placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
      value={value ?? ""}
      onChange={onChangeInput}
      style={style as any}
    />
  )
}

export default memo(Input)
