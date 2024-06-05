"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { SectionType } from "@/types/Edit"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useRef } from "react"

import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import hasString from "@/utils/helpers/hasString"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Email({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { setSelectedText, selected } = useMainStore()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { value } = selected[section.index - 1] ?? {}
  const text = value ? value[0].text : ""

  const onChangeInput = (e: any) => {
    setSelectedText({ section, text: e.target.value })
  }

  const onFocus = () => {
    if (inputRef?.current) {
      inputRef.current.focus()
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
          icon={faEnvelope}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"email"}
          onFocus={onFocus}
          isActive={hasString(text)}
          resetEvent={reset}
        >
          <input
            ref={inputRef}
            type="email"
            autoComplete="email"
            name="email"
            id="email"
            required
            className={cx("input")}
            value={text}
            onChange={onChangeInput}
          />
        </FormUserInput>
      </div>
      {!isDisplayMode && (
        <div className={cx("options")}>
          <OptionTitleInputs section={section} />
        </div>
      )}
    </div>
  )
}

export default memo(Email)
