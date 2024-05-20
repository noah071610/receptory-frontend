"use client"

import { getAnimation } from "@/utils/styles/getAnimation"
import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock"
import cs from "classNames/bind"
import { ReactNode, useEffect } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function ModalLayout({ children, modalStyle }: { children: ReactNode; modalStyle?: string }) {
  useEffect(() => {
    const body: HTMLBodyElement | null = document.querySelector("body")

    if (body) {
      disableBodyScroll(body)
    }
    return () => {
      body && clearAllBodyScrollLocks()
    }
  }, [])

  return (
    <div className={cx("overlay")}>
      <div
        style={getAnimation({ type: "fadeUpBig", delay: 0 })}
        className={cx("modal", modalStyle ?? "")}
        data-closer="editor"
        data-global-closer="modal"
      >
        {children}
      </div>
    </div>
  )
}
