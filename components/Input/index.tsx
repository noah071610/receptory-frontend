"use client"

import { useError } from "@/hooks/useError"
import { useEditorStore } from "@/store/editor"
import { SectionType, StyleProperties } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import cs from "classnames/bind"
import { memo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"
const cx = cs.bind(style)

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
  onChange,
  section,
  disabled,
  isBottomError,
  onBlur,
}: {
  type: "input" | "textarea"
  className?: string
  inputType: string
  isOptional: boolean
  isBottomError?: boolean
  listIndex?: number
  maxLength?: number
  lineMax?: number
  dataKey?: string
  onChange?: any
  value: string
  style?: StyleProperties
  displayMode?: boolean | "h1" | "p" | "h2" | "span"
  section?: SectionType
  disabled?: boolean
  onBlur?: any
}) {
  if (type === "textarea") {
    maxLength = 100
  }

  const { t } = useTranslation(["edit-page", "messages"])

  const { isError, errorMessage, setErrorClear, errorStyle, onError } = useError({ type: "noEmptyText" })
  const inputRef = useRef(null)
  const { setValue, setList, setData, saveSectionHistory, selectedSection, setSelectedSection } = useEditorStore([
    "setValue",
    "setList",
    "setData",
    "saveSectionHistory",
    "selectedSection",
    "setSelectedSection",
  ])
  const [initLength, setInitLength] = useState(value?.length ?? 0)
  const [isEdited, setIsEdited] = useState(false)
  const [snapshot, setSnapshot] = useState<string | null>(value ?? null)

  const setInput = (inputValue: string) => {
    if (onChange) return onChange(inputValue)
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
  }

  const onChangeInput = (e: any) => {
    const inputValue = e.target.value

    const lines = inputValue.split("\n")
    if (section && !selectedSection) {
      setSelectedSection({ payload: section })
    }

    if (inputValue.length > maxLength) return
    if (type === "textarea") {
      if (lines.length > lineMax) return
    }

    setInput(inputValue)
    if (!isEdited && initLength !== e.target.value.length) {
      setIsEdited(true)
    }
  }

  const onBlurInput = () => {
    if (value?.length <= 0 && !isOptional && snapshot) {
      onError()
      setInput(snapshot)
      return
    }
    if (isEdited) {
      setSnapshot(null)
      saveSectionHistory()
      setIsEdited(false)
      setInitLength(value.length)
    }
  }

  const onfocus = () => {
    if (isError) {
      setErrorClear()
    }
    setSnapshot(value)
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
        disabled={disabled}
        className={className}
        placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
        value={value ?? ""}
        onChange={onChangeInput}
        onBlur={onBlur ?? onBlurInput}
        style={isError ? { ...style, ...errorStyle } : style}
      />
    ),
    input: (
      <input
        disabled={disabled}
        ref={inputRef}
        onFocus={onfocus}
        className={className}
        placeholder={t(inputType) + (isOptional ? ` ${t("optional")}` : "")}
        value={value ?? ""}
        onChange={onChangeInput}
        onBlur={onBlur ?? onBlurInput}
        style={isError ? { ...style, ...errorStyle } : style}
      />
    ),
  }

  return (
    <div className={cx("input-wrapper")}>
      <div className={cx("tooltip", { isError, isBottomError })}>
        <div className={cx("error")}>
          {t(`error.${errorMessage}`, {
            ns: "messages",
          })}
        </div>
      </div>
      {displayMode ? (
        <>{hasString(value) && displayComponent[displayMode === true ? "h1" : displayMode]}</>
      ) : (
        inputComponent[type]
      )}
    </div>
  )
}

export default memo(Input)
