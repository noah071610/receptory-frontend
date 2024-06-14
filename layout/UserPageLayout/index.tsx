"use client"

import { useMainStore } from "@/store/main"
import cs from "classnames/bind"
import { ReactNode } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function UserPageLayout({ children }: { children: ReactNode }) {
  const { modal, setModal } = useMainStore(["modal", "setModal"])
  const onClickMain = (e: any) => {
    const closestElement = e.target.closest("[data-global-closer]")

    if (!closestElement && modal.type) {
      setModal({ section: null, type: null }) // main store (유저용)
    }
  }
  return (
    <div onClick={onClickMain} className={cx("main")}>
      <div className={cx("content")}>
        <div className={cx("background")}></div>
        {children}
      </div>
    </div>
  )
}
