"use client"

import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { AlignTypes } from "@/types/Edit"
import { useParams } from "next/navigation"
import { memo } from "react"

function Input({
  className,
  inputType,
  value,
  listIndex,
  isOptional,
  color,
  textAlign,
}: {
  className?: string
  inputType: "title" | "description" | "cta" | "label" | "map"
  isOptional: boolean
  listIndex?: number
  value: string
  color?: string
  textAlign?: AlignTypes
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const { setTitle, setDescription, setValues, setValue, setList, setLabel } = useEditStore()

  const onChangeInput = (e: any) => {
    const map = {
      title: () => {
        if (typeof listIndex === "number") return setList({ payload: e.target.value, index: listIndex, key: "title" })
        setTitle({ payload: e.target.value })
      },
      description: () => {
        if (typeof listIndex === "number")
          return setList({ payload: e.target.value, index: listIndex, key: "description" })
        setDescription({ payload: e.target.value })
      },
      label: () => {
        if (typeof listIndex === "number") return setList({ payload: e.target.value, index: listIndex, key: "label" })
        setLabel({ payload: e.target.value })
      },
      cta: () => {
        setValues({ payload: e.target.value, key: "ctaText" })
      },
      map: () => {
        setValue({ payload: e.target.value })
      },
    }
    map[inputType]()
  }

  return (
    <input
      className={className}
      placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
      value={value ?? ""}
      onChange={onChangeInput}
      style={{ color: !!color ? color : "#505056", textAlign }}
    />
  )
}

export default memo(Input)
