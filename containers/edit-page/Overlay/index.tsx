"use client"

import { useEditStore } from "@/store/edit"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Overlay() {
  const { selectedSection, setSelectedSection } = useEditStore()
  const onClickSection = () => {
    setSelectedSection(null)
  }
  return <div onClick={onClickSection} className={cx(style.overlay, { [style.active]: !!selectedSection })}></div>
}
