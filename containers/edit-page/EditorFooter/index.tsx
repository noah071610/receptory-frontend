"use client"

import { useEditStore } from "@/store/edit"
import classNames from "classNames"
import { useParams } from "next/navigation"
import AddSection from "./AddSection"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function EditorFooter() {
  const { selectedSection } = useEditStore()
  const { lang } = useParams()
  return (
    <div className={cx(style.footer)}>
      <div className={cx(style.main)}>{selectedSection === null ? <AddSection /> : <></>}</div>
      <div className={cx(style["preview-ghost"])}></div>
    </div>
  )
}
