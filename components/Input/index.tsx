"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { StyleProperties } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { useParams } from "next/navigation"
import { memo, useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"

function Input({
  className,
  type,
  inputType,
  style,
  value,
  maxLength = 30,
  dataKey,
  lineMax = 4,
  listIndex,
  isOptional,
  displayMode,
}: {
  type: "input" | "textarea"
  className?: string
  inputType: string
  isOptional: boolean
  listIndex?: number
  maxLength?: number
  lineMax?: number
  dataKey?: string
  value: string
  style?: StyleProperties
  displayMode?: boolean | "h1" | "p" | "h2" | "span"
}) {
  if (type === "textarea") {
    maxLength = 100
  }
  const inputRef = useRef(null)
  const { lang } = useParams()
  const { t } = useTranslation(lang, ["new-post-page"])
  const { setValue, setList, setData, saveSectionHistory, selectedSection } = useEditorStore()
  const [isEdit, setIsEdit] = useState(false)

  const onChangeInput = (e: any) => {
    const inputValue = e.target.value
    const lines = inputValue.split("\n")
    if (type === "input") {
      if (inputValue.length > maxLength) return
    } else if (type === "textarea") {
      if (lines.length > lineMax) return
    }

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

  const onBlurInput = () => {
    if (isEdit && selectedSection) {
      saveSectionHistory({ payload: selectedSection })
      setIsEdit(false)
    }
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

  const inputComponent = {
    textarea: (
      <TextareaAutosize
        className={className}
        placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
        value={value ?? ""}
        onChange={onChangeInput}
        onBlur={onBlurInput}
        style={style as any}
      />
    ),
    input: (
      <input
        ref={inputRef}
        className={className}
        placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
        value={value ?? ""}
        onChange={onChangeInput}
        onBlur={onBlurInput}
        style={style as any}
      />
    ),
  }

  return displayMode ? (
    <>{hasString(value) && displayComponent[displayMode === true ? "h1" : displayMode]}</>
  ) : (
    inputComponent[type]
  )
}

export default memo(Input)
