"use client"

import ImageSelector from "@/components/Tools/ImageSelector"
import { useEditStore } from "@/store/edit"
import classNames from "classNames"
import { ReactNode } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function PageLayout({ children }: { children: ReactNode }) {
  const { setCurrentTooltip, setSelectedSection, setCurrentSubmenu, currentTooltip } = useEditStore()
  const onClickPage = (e: any) => {
    if (!e.target.closest("#editor")) {
      setSelectedSection({ payload: null })
      setCurrentSubmenu({ type: null })
      setCurrentTooltip({ type: null })
    }
  }
  return (
    <div className={cx(style.page)} onClick={onClickPage}>
      {children}
      {(currentTooltip === "slider" || currentTooltip === "album") && <ImageSelector />}
    </div>
  )
}
