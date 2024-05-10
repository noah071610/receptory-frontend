"use client"

import FormUserInput from "@/components/FormUserInput"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faPhone } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo } from "react"
import "react-international-phone/style.css"
import style from "./style.module.scss"

import cs from "classNames/bind"
import { PhoneInput } from "react-international-phone"
const cx = cs.bind(style)

function PagePhone({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setValue } = useEditorStore()
  const { phoneNumberCountry } = section.options

  const onChangePhoneInput = (value: any) => {
    setValue({ payload: value })
  }

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faPhone}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"phone"}
        >
          <PhoneInput
            className={cx("phone")}
            value={section.value}
            defaultCountry={lang === "ko" ? "kr" : (lang as string)}
            hideDropdown={phoneNumberCountry !== "all"}
            forceDialCode={phoneNumberCountry !== "all"}
            onChange={(phone: any) => onChangePhoneInput(phone)}
          />
        </FormUserInput>
      </div>
    </div>
  )
}

export default memo(PagePhone)
