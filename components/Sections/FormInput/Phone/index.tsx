"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faPhone } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useEffect, useRef } from "react"
import style from "./style.module.scss"

import OptionRatio from "@/components/Options/OptionRatio"
import { useMainStore } from "@/store/main"
import { getPhoneNumber } from "@/utils/helpers/getPhoneNumber"
import hasString from "@/utils/helpers/hasString"
import cs from "classNames/bind"
import Image from "next/image"
const cx = cs.bind(style)

function Phone({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { selectedSection, setSelectedSection, setOptions } = useEditorStore()
  const { setUserPick, userPick } = useMainStore()
  const value = userPick[section.id]?.value ?? ""
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { min, max, phoneNumberCountry } = section.options
  const activeSection = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
  }

  const onChangePhoneInput = (e: any) => {
    activeSection()
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

  useEffect(() => {
    setOptions({ key: "phoneNumberCountry", payload: lang ?? "ko" })
  }, [lang])

  useEffect(() => {
    setUserPick({ section, payload: "" })
  }, [phoneNumberCountry])

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
            <input onBlur={onBlur} className={cx("phone")} ref={inputRef} value={value} onChange={onChangePhoneInput} />
          </div>
        </FormUserInput>
      </div>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <OptionRatio
          optionsArr={[
            { value: "ko", src: "/images/icons/ko.png" },
            { value: "ja", src: "/images/icons/ja.png" },
            { value: "th", src: "/images/icons/th.png" },
            { value: "en", src: "/images/icons/en.png" },
          ]}
          section={section}
          targetKey="phoneNumberCountry"
        />
      </div>
    </div>
  )
}

export default memo(Phone)
