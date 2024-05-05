"use client"

import { getAnimation } from "@/utils/getAnimation"
import { clearAllBodyScrollLocks, disableBodyScroll } from "body-scroll-lock"
import classNames from "classNames"
import { ReactNode, useEffect } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

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
    <div className={cx(style["overlay"])}>
      <div
        style={getAnimation({ type: "fadeUp", delay: 0, speed: 600 })}
        className={cx(style.modal, "editor", modalStyle ?? "")}
      >
        {children}
      </div>
    </div>
  )
}
