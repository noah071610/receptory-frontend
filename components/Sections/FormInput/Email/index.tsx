"use client"

import FormUserInput from "@/components/FormUserInput"
import OptionTitleInputs from "@/components/Options/OptionTitleInputs"
import { SectionType } from "@/types/Edit"
import { faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo } from "react"

import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function Email({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { lang } = useParams()
  const { setUserPick, userPick } = useMainStore()
  const value = userPick[section.id]?.value ?? ""

  const onChangeInput = (e: any) => {
    setUserPick({ section, payload: e.target.value })
  }

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faEnvelope}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"email"}
        >
          <input
            type="email"
            autoComplete="email"
            name="email"
            id="email"
            required
            className={cx("input")}
            value={value}
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
