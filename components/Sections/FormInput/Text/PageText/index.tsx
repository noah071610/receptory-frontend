"use client"

import FormUserInput from "@/components/FormUserInput"
import { SectionType } from "@/types/Edit"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { memo, useRef } from "react"

import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import hasString from "@/utils/helpers/hasString"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageText({ section }: { section: SectionType }) {
  const { setSelectedText, selected } = useMainStore(["setSelectedText", "selected"])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const { max } = section.options
  const design = section.design
  const { value } = selected[section.index - 1] ?? {}
  const text = value ? value[0].text : ""

  const onChangeInput = (e: any) => {
    if (e.target.value.length > max) {
      return
    }
    setSelectedText({ section, text: e.target.value })
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
    </div>
  )
}

export default memo(PageText)
