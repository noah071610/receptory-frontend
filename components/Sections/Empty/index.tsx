"use client"

import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Empty({ isDisplay }: { isDisplay?: boolean }) {
  return <div className={cx(style.empty, { [style.isDisplay]: isDisplay })}></div>
}
