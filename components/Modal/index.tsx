"use client"

import { getAnimation } from "@/utils/styles/getAnimation"
import cs from "classNames/bind"
import { ReactNode, useEffect } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function ModalLayout({
  children,
  modalStyle,
  isForce,
}: {
  children: ReactNode
  modalStyle?: string
  isForce?: boolean
}) {
  useEffect(() => {
    const body: HTMLBodyElement | null = document.querySelector("body")

    if (body) {
      body.classList.add("disabled-scroll")
    }
    return () => {
      body && body.classList.remove("disabled-scroll")
    }
  }, [])

  return (
    <div data-global-closer={isForce ? "modal" : undefined} className={cx("overlay")}>
      <div
        style={getAnimation({ type: "fadeUpBig", delay: 0 })}
        className={cx(modalStyle ?? "")}
        data-closer="editor"
        data-global-closer="modal"
      >
        {children}
      </div>
    </div>
  )
}
