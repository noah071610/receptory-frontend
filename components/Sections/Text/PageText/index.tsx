"use client"

import cs from "classnames/bind"
import { memo } from "react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function PageText({ text }: { text: string }) {
  return <div dangerouslySetInnerHTML={{ __html: text }} className={cx("text")} />
}

export default memo(PageText)
