"use client"

import FormUserInput from "@/components/FormUserInput"
import { SectionType } from "@/types/Edit"
import { onlyNumberFilter } from "@/utils/helpers/inputHelper"
import { faListOl } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo } from "react"
import "react-international-phone/style.css"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageNumber({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setUserPick, userPick } = useMainStore()
  const value = userPick[section.id]?.value ?? 0
  const { min, max } = section.options

  const onChangeInput = (e: any) => {
    if (parseInt(e.target.value) < min) {
      return setUserPick({ section, payload: min })
    }
    if (parseInt(e.target.value) > max) {
      return setUserPick({ section, payload: max })
    }
    setUserPick({ section, payload: e.target.value })
  }

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faListOl}
          title={section.data.title}
          description={section.data.description}
          inputStyle={"number"}
        >
          <input
            className={cx("input")}
            type="number"
            onKeyDown={onlyNumberFilter}
            value={value}
            onChange={onChangeInput}
          />
        </FormUserInput>
      </div>
    </div>
  )
}

export default memo(PageNumber)
