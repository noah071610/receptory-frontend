"use client"

import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Empty() {
  return <div className={cx(style.empty)}></div>
}
