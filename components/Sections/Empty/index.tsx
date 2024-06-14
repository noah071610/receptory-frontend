"use client"

import cs from "classnames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function Empty({ isDisplay }: { isDisplay?: boolean }) {
  return <div className={cx("empty", { isDisplay: isDisplay })}></div>
}
