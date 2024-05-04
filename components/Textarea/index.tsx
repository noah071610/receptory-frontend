"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType, StyleProperties } from "@/types/Edit"
import hasString from "@/utils/hasString"
import { useParams } from "next/navigation"
import { memo, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

function Textarea({
  className,
  inputType,
  style,
  value,
  dataKey,
  listIndex,
  isOptional,
  lineMax = 4,
  maxLength = 100,
  displayMode,
  section,
}: {
  className?: string
  inputType: "title" | "description" | "label" | "cta" | "map"
  dataKey?: "title" | "description"
  isOptional: boolean
  listIndex?: number
  value: string
  style?: StyleProperties
  lineMax?: number
  maxLength?: number
  displayMode?: false | "p"
  section: SectionType
}) {
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const { setValue, setList, setData, saveSectionHistory } = useEditorStore()
  const [isEdit, setIsEdit] = useState(false)

  const onChangeInput = (e: any) => {
    const inputValue = e.target.value
    const lines = inputValue.split("\n")

    if (lines.length <= lineMax) {
      let newText = ""
      lines.forEach((line: string, index: number) => {
        if (line.length <= maxLength) {
          newText += line
          if (index !== lines.length - 1) {
            newText += "\n"
          }
        }
      })

      if (dataKey) {
        if (typeof listIndex === "number") {
          setList({ payload: newText, index: listIndex, key: "data", dataKey })
        } else {
          setData({ payload: newText, key: dataKey })
        }
      } else {
        if (typeof listIndex === "number") {
          setList({ payload: newText, index: listIndex, key: "value" })
        } else {
          setValue({ payload: newText })
        }
      }

      setIsEdit(true)
    }
  }

  const onBlurInput = () => {
    if (isEdit) {
      saveSectionHistory({ payload: section })
      setIsEdit(false)
    }
  }

  return displayMode ? (
    hasString(value) && (
      <p className={className} style={style as any}>
        {value}
      </p>
    )
  ) : (
    <TextareaAutosize
      className={className}
      placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
      value={value ?? ""}
      onChange={onChangeInput}
      onBlur={onBlurInput}
      style={style as any}
    />
  )
}

export default memo(Textarea)
