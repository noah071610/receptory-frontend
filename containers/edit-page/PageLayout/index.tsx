"use client"

import { useEditorStore } from "@/store/editor"
import { useMainStore } from "@/store/main"
import cs from "classnames/bind"
import { ReactNode, useCallback } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function PageLayout({ children }: { children: ReactNode }) {
  const { selectedSection, active, clearActive, setSelectedSection } = useEditorStore([
    "selectedSection",
    "active",
    "clearActive",
    "setSelectedSection",
  ])
  const { modal, setModal } = useMainStore(["modal", "setModal"])
  const onClickPage = useCallback(
    (e: any) => {
      const closestElement = e.target.closest("[data-closer]")

      if (closestElement) {
        const dataType = closestElement.getAttribute("data-closer")

        if (dataType === "rending") {
          return setSelectedSection({ payload: null })
        }

        if (dataType !== "editor") {
          if (modal.type) {
            setModal({ section: null, type: null }) // main store (유저용)
          }

          if (dataType === "preview" && typeof window === "object") {
            if (window.innerWidth <= 800) return
          }
          if (dataType === "add") {
            return
          }

          if (selectedSection) setSelectedSection({ payload: null })
          if (active.modal.type || active.submenu.type || active.tooltip.type) {
            clearActive()
          }
        }
      } else {
        if (modal.type) {
          setModal({ section: null, type: null }) // main store (유저용)
        }
        if (selectedSection) setSelectedSection({ payload: null })
        if (active.modal.type || active.submenu.type || active.tooltip.type) {
          clearActive()
        }
      }
    },
    [
      active.modal.type,
      active.submenu.type,
      active.tooltip.type,
      clearActive,
      modal.type,
      selectedSection,
      setModal,
      setSelectedSection,
    ]
  )

  return (
    <div className={cx("page")} onClick={onClickPage}>
      {children}
    </div>
  )
}
