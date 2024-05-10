"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faPhone } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo, useEffect } from "react"
import "react-international-phone/style.css"
import style from "./style.module.scss"

import OptionRatio from "@/components/Options/OptionRatio"
import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
import { PhoneInput } from "react-international-phone"
const cx = cs.bind(style)

function Phone({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { selectedSection, setSelectedSection } = useEditorStore()
  const { setUserPick, userPick } = useMainStore()
  const value = userPick[section.id]?.value ?? ""
  const { min, max, phoneNumberCountry } = section.options
  const activeSection = () => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
  }

  const onChangePhoneInput = (value: any) => {
    activeSection()
    setUserPick({ section, payload: value })
  }

  useEffect(() => {
    if (phoneNumberCountry !== "all") {
      setUserPick({ section, payload: phoneNumberCountry })
    } else {
      setUserPick({ section, payload: "" })
    }
  }, [phoneNumberCountry])

  useEffect(() => {
    setUserPick({ section, payload: "" })
  }, [min, max])

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
            value={value}
            defaultCountry={lang === "ko" ? "kr" : (lang as string)}
            hideDropdown={phoneNumberCountry !== "all"}
            forceDialCode={phoneNumberCountry !== "all"}
            onChange={(phone: any) => onChangePhoneInput(phone)}
          />
        </FormUserInput>
      </div>
      <div className={cx("options")}>
        <OptionTitleInputs section={section} />
        <OptionRatio optionsArr={["all", "+82", "+81", "+66", "+1"]} section={section} targetKey="phoneNumberCountry" />
      </div>
    </div>
  )
}

export default memo(Phone)
