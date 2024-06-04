"use client"

import Profile from "@/containers/user-page/Profile"
import cs from "classNames/bind"
import { ReactNode } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function UserPageLayout({ children }: { children: ReactNode }) {
  const onClickMain = (e: any) => {
    const closestElement = e.target.closest("[data-global-closer]")

    if (!closestElement && modal.type) {
      setModal({ section: null, type: null }) // main store (유저용)
    }
  }
  return (
    <div className={cx("main")}>
      <div className={cx("content")}>
        <Profile user={user} />
        {children}
      </div>
    </div>
  )
}
