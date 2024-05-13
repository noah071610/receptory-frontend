"use client"

import FormUserInput from "@/components/FormUserInput"
import { SectionType } from "@/types/Edit"
import { onlyNumberFilter } from "@/utils/helpers/inputHelper"
import { faListOl } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useRef } from "react"

import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageNumber({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setUserPickText, userPick } = useMainStore()
  const { min, max } = section.options
  const inputRef = useRef<HTMLInputElement | null>(null)

  const { value } = userPick[section.id] ?? {}
  const text = value ? value[0].text : ""

  const onChangeInput = (e: any) => {
    if (parseInt(e.target.value) < min) {
      return setUserPickText({ section, text: min })
    }
    if (parseInt(e.target.value) > max) {
      return setUserPickText({ section, text: max })
    }
    setUserPickText({ section, text: e.target.value })
  }

  const onFocus = () => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }
  const reset = () => {
    setUserPickText({ section, text: "" })
    onFocus()
  }

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faListOl}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"number"}
          onFocus={onFocus}
          isActive={!!text}
          resetEvent={reset}
        >
          <input
            className={cx("input")}
            type="number"
            ref={inputRef}
            onKeyDown={onlyNumberFilter}
            value={text}
            onChange={onChangeInput}
          />
        </FormUserInput>
      </div>
    </div>
  )
}

export default memo(PageNumber)
