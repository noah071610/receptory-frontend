"use client"

import { useEditorStore } from "@/store/editor"
import classNames from "classNames"
import { ReactNode } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function PageLayout({ children }: { children: ReactNode }) {
  const { setActive, setSelectedSection } = useEditorStore()
  const onClickPage = (e: any) => {
    if (!e.target.closest("#editor")) {
      setSelectedSection({ payload: null })
      setActive({ payload: null, key: "all" })
    }
  }
  return (
    <div className={cx(style.page)} onClick={onClickPage}>
      {children}
    </div>
  )
}
