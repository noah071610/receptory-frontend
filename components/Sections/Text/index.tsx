// @ts-ignore
import { memo } from "react"

import { SectionType } from "@/types/Edit"
import dynamic from "next/dynamic"
import style from "./style.module.scss"

import cs from "classNames/bind"
const cx = cs.bind(style)

const TextEditor = dynamic(() => import("./TextEditor"), {
  ssr: true,
})

const Text = ({
  section,
  textColor,
  listIndex,
  isDisplayMode,
}: {
  section: SectionType
  textColor?: string
  listIndex?: number
  isDisplayMode?: boolean
}) => {
  return (
    <div className={cx("layout")}>
      <TextEditor section={section} isDisplayMode={isDisplayMode} listIndex={listIndex} textColor={textColor} />
    </div>
  )
}

export default memo(Text)
