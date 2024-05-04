"use client"

import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function FormTitle({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  return (
    <label className={cx(style["form-title"])}>
      <h2>{section.data.title}</h2>
      <p>{section.data.description}</p>
    </label>
  )
}
export default memo(FormTitle)
