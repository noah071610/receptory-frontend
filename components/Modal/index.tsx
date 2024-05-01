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
    console.log(body)

    if (body) {
      disableBodyScroll(body)
    }
    return () => {
      body && clearAllBodyScrollLocks()
    }
  }, [])

  return (
    <div className={cx(style["overlay"])}>
      <div id="editor" style={getAnimation("fadeUp", 0, 600)} className={cx(style.modal, modalStyle ?? "")}>
        {children}
      </div>
    </div>
  )
}
