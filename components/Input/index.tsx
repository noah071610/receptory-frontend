"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType, StyleProperties } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { useParams } from "next/navigation"
import { memo, useState } from "react"

function Input({
  className,
  inputType,
  style,
  value,
  maxLength = 30,
  dataKey,
  listIndex,
  isOptional,
  displayMode,
  section,
}: {
  className?: string
  inputType: string
  isOptional: boolean
  listIndex?: number
  maxLength?: number
  dataKey?: "title" | "description"
  value: string
  style?: StyleProperties
  displayMode?: boolean | "h1" | "p" | "h2" | "span"
  section: SectionType
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const { setValue, setList, setData, saveSectionHistory } = useEditorStore()
  const [isEdit, setIsEdit] = useState(false)
  const onChangeInput = (e: any) => {
    const inputValue = e.target.value
    if (inputValue.length > maxLength) return

    if (dataKey) {
      if (typeof listIndex === "number") {
        setList({ payload: inputValue, index: listIndex, key: "data", dataKey })
      } else {
        setData({ payload: inputValue, key: dataKey })
      }
    } else {
      if (typeof listIndex === "number") {
        setList({ payload: inputValue, index: listIndex, key: "value" })
      } else {
        setValue({ payload: inputValue })
      }
    }
    setIsEdit(true)
  }

  const displayComponent = {
    h1: (
      <h1 className={className} style={style as any}>
        {value}
      </h1>
    ),
    h2: (
      <h2 className={className} style={style as any}>
        {value}
      </h2>
    ),
    p: (
      <p className={className} style={style as any}>
        {value}
      </p>
    ),
    span: (
      <span className={className} style={style as any}>
        {value}
      </span>
    ),
  }

  const onBlurInput = () => {
    if (isEdit) {
      saveSectionHistory({ payload: section })
      setIsEdit(false)
    }
  }

  return displayMode ? (
    <>{hasString(value) && displayComponent[displayMode === true ? "h1" : displayMode]}</>
  ) : (
    <input
      className={className}
      placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
      value={value ?? ""}
      onChange={onChangeInput}
      onBlur={onBlurInput}
      style={style as any}
    />
  )
}

export default memo(Input)
