"use client"

import FormUserInput from "@/components/FormUserInput"
import { SectionType } from "@/types/Edit"
import { faPhone } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useRef } from "react"

import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import { getPhoneNumber } from "@/utils/helpers/getPhoneNumber"
import hasString from "@/utils/helpers/hasString"
import cs from "classnames/bind"
import Image from "next/image"
const cx = cs.bind(style)

function PagePhone({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setSelectedText, selected } = useMainStore(["setSelectedText", "selected"])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { phoneNumberCountry } = section.options
  const { value } = selected[section.index - 1] ?? {}
  const text = value ? value[0].text : ""

  const onChangePhoneInput = (e: any) => {
    const output = getPhoneNumber(e, phoneNumberCountry)
    setSelectedText({ section, text: output })
  }

  const onBlur = () => {
    if (phoneNumberCountry === "ko" || phoneNumberCountry === "ja") {
      setSelectedText({ section, text: text.slice(0, 13) })
    }
    if (phoneNumberCountry === "th") {
      setSelectedText({ section, text: text.slice(0, 12) })
    }
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
          icon={faPhone}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"phone"}
          onFocus={onFocus}
          isActive={hasString(text)}
          resetEvent={reset}
        >
          <div className={cx("phone-wrapper")}>
            <Image
              width={25}
              height={25}
              src={`/images/icons/${phoneNumberCountry}.png`}
              alt={`${phoneNumberCountry}-image`}
            />
            <input ref={inputRef} onBlur={onBlur} className={cx("phone")} value={text} onChange={onChangePhoneInput} />
          </div>
        </FormUserInput>
      </div>
    </div>
  )
}

export default memo(PagePhone)
