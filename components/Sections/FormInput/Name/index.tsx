"use client"

import FormUserInput from "@/components/FormUserInput"
import { SectionType } from "@/types/Edit"
import { faUser } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useRef } from "react"

import style from "./style.module.scss"

import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useMainStore } from "@/store/main"
import hasString from "@/utils/helpers/hasString"
import cs from "classNames/bind"
import { useTranslation } from "react-i18next"
const cx = cs.bind(style)

function NameInput({ section }: { section: SectionType }) {
  const { t } = useTranslation()
  const { lang } = useParams()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { setSelectedText, selected } = useMainStore()
  const { value } = selected[section.index - 1] ?? {}
  const text = value ? value[0].text : ""

  const onChangeInput = (e: any) => {
    if (e.target.value.length > 50) {
      return
    }
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
          icon={faUser}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"nameInput"}
          onFocus={onFocus}
          isActive={hasString(text)}
          resetEvent={reset}
        >
          <input ref={inputRef} className={cx("input")} type="text" value={text} onChange={onChangeInput} />
        </FormUserInput>
      </div>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
      </div>
    </div>
  )
}

export default memo(NameInput)
