"use client"

import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Text() {
  return <section className={cx(style["cta-section"])}></section>
}
