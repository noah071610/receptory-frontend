"use client"

import FormUserInput from "@/components/FormUserInput"
import { SectionType } from "@/types/Edit"
import { faPencil } from "@fortawesome/free-solid-svg-icons"
import { useParams } from "next/navigation"
import { memo } from "react"

import TextareaAutosize from "react-textarea-autosize"
import style from "./style.module.scss"

import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
const cx = cs.bind(style)

function PageText({ section }: { section: SectionType }) {
  const { lang } = useParams()
  const { setUserPick, userPick } = useMainStore()
  const value = userPick[section.id]?.value ?? ""
  const { max } = section.options
  const design = section.design

  const onChangeInput = (e: any) => {
    if (e.target.value.length > max) {
      return
    }
    setUserPick({ section, payload: e.target.value })
  }

  return (
    <div className={cx("layout")}>
      <div className={cx("input-wrapper")}>
        <FormUserInput
          icon={faPencil}
          title={section.data.title}
          description={section.data.description}
          inputStyle={design}
        >
          {design === "text" ? (
            <input className={cx("input")} type="text" value={value} onChange={onChangeInput} />
          ) : (
            <TextareaAutosize
              className={cx("textarea")}
              value={value}
              maxRows={5}
              maxLength={max}
              onChange={onChangeInput}
            />
          )}
        </FormUserInput>
      </div>
    </div>
  )
}

export default memo(PageText)
