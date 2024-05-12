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
import cs from "classNames/bind"
import Image from "next/image"
const cx = cs.bind(style)

function PagePhone({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setUserPick, userPick } = useMainStore()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const value = userPick[section.id]?.value ?? ""
  const { phoneNumberCountry } = section.options

  const onChangePhoneInput = (e: any) => {
    const output = getPhoneNumber(e, phoneNumberCountry)

    setUserPick({ section, payload: output })
  }

  const onBlur = () => {
    if (phoneNumberCountry === "ko" || phoneNumberCountry === "ja") {
      setUserPick({ section, payload: value.slice(0, 13) })
    }
    if (phoneNumberCountry === "th") {
      setUserPick({ section, payload: value.slice(0, 12) })
    }
  }

  const onFocus = () => {
    if (inputRef?.current) {
      inputRef.current.focus()
    }
  }
  const reset = () => {
    setUserPick({ section, payload: "" })
    if (inputRef?.current) {
      inputRef.current.focus()
    }
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
          isActive={hasString(value)}
          resetEvent={reset}
        >
          <div className={cx("phone-wrapper")}>
            <Image
              width={25}
              height={25}
              src={`/images/icons/${phoneNumberCountry}.png`}
              alt={`${phoneNumberCountry}-image`}
            />
            <input ref={inputRef} onBlur={onBlur} className={cx("phone")} value={value} onChange={onChangePhoneInput} />
          </div>
        </FormUserInput>
      </div>
    </div>
  )
}

export default memo(PagePhone)
