"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { SectionType } from "@/types/Edit"
import { enforceMinMax, onlyNumberFilter } from "@/utils/helpers/inputHelper"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { memo, useEffect, useRef } from "react"

import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"

import { useEditorStore } from "@/store/editor"
import { useMainStore } from "@/store/main"
import hasString from "@/utils/helpers/hasString"
import cs from "classnames/bind"
import { useTranslation } from "react-i18next"
const cx = cs.bind(style)

function Text({ section }: { section: SectionType }) {
  const { setSelectedText, selected, pageLang } = useMainStore(["setSelectedText", "selected", "pageLang"])
  const { t } = useTranslation(["edit-page"])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { setOptions, saveSectionHistory } = useEditorStore(["setOptions", "saveSectionHistory"])
  const { max } = section.options
  const design = section.design
  const globalMax = design === "text" ? 50 : 500
  const { value } = selected[section.index - 1] ?? {}
  const text = value ? value[0].text : ""

  const onChangeInput = (e: any) => {
    if (e.target.value.length > max) {
      return
    }
    setSelectedText({ section, text: e.target.value })
  }

  const onChangeMax = (e: any) => {
    setOptions({ payload: e.target.value, key: "max" })
  }

  useEffect(() => {
    setSelectedText({ section, text: "" })
  }, [section.design, max, setSelectedText, section])

  useEffect(() => {
    setOptions({ payload: globalMax, key: "max" })
  }, [globalMax, section.design, setOptions])

  const onBlurMinMax = () => {
    if (!max || max < 10) {
      setOptions({ payload: 10, key: "max" })
    }
    if (max > globalMax) {
      setOptions({ payload: globalMax, key: "max" })
    }
    saveSectionHistory()
  }

  const onFocus = () => {
    if (design === "textarea") {
      if (textareaRef?.current) {
        textareaRef.current.focus()
      }
    } else {
      if (inputRef?.current) {
        inputRef.current.focus()
      }
    }
  }
  const reset = () => {
    setSelectedText({ section, text: "" })
    onFocus()
  }

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faPencil}
          title={section.data.title}
          description={section.data.description}
          inputStyle={design}
          onFocus={onFocus}
          isActive={hasString(text)}
          resetEvent={reset}
        >
          {design === "text" ? (
            <input ref={inputRef} className={cx("input")} type="text" value={text} onChange={onChangeInput} />
          ) : (
            <TextareaAutosize
              className={cx("textarea")}
              value={text}
              maxRows={5}
              maxLength={max}
              ref={textareaRef}
              onChange={onChangeInput}
            />
          )}
        </FormUserInput>
      </div>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <div>
          <h4>
            <span>{t("maxLetter")}</span>
          </h4>
          <div className={cx("minMax-wrapper")}>
            <input
              className={cx("minMax")}
              onKeyDown={onlyNumberFilter}
              onKeyUp={enforceMinMax}
              onBlur={onBlurMinMax}
              type="number"
              min={1}
              max={globalMax}
              value={section.options.max}
              onChange={onChangeMax}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Text)
