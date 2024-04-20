"use client"

import classNames from "classNames"
import { useParams } from "next/navigation"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Preview() {
  const { lang } = useParams()
  return (
    <div className={cx(style.preview)}>
      <div className={cx(style.phone)}>
        <div className={cx(style.content)}></div>
      </div>
    </div>
  )
}
