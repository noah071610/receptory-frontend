"use client"

import { useEditStore } from "@/store/edit"
import classNames from "classNames"
import { ReactNode } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function PageLayout({ children }: { children: ReactNode }) {
  const { selectedSection, setSelectedSection, setActiveListType } = useEditStore()
  const onClickPage = (e: any) => {
    if (!e.target.closest("#editor")) {
      setSelectedSection({ payload: null })
      setActiveListType({ type: null })
    }
  }
  return (
    <div className={cx(style.page)} onClick={onClickPage}>
      {children}
    </div>
  )
}
