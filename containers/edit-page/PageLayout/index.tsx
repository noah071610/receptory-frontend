"use client"

import { useEditorStore } from "@/store/editor"
import { useMainStore } from "@/store/main"
import cs from "classNames/bind"
import { ReactNode } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function PageLayout({ children }: { children: ReactNode }) {
  const { setActive, setSelectedSection } = useEditorStore()
  const { modal, setModal } = useMainStore()
  const onClickPage = (e: any) => {
    const closestElement = e.target.closest("[data-closer]")
    if (closestElement) {
      const dataType = closestElement.getAttribute("data-closer")

      if (dataType !== "editor") {
        if (dataType === "preview" && typeof window === "object") {
          if (window.innerWidth <= 800) return
        }
        if (modal.type) {
          setModal({ section: null, type: null })
        }
      }
    } else {
      setSelectedSection({ payload: null })
      setActive({ payload: { type: null }, key: "all" })
    }
  }
  return (
    <div className={cx("page")} onClick={onClickPage}>
      {children}
    </div>
  )
}
