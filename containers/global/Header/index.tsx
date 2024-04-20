"use client"

import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function Header() {
  return (
    <>
      <header className={cx(style.header)}>
        <div className={cx(style.inner)}></div>
      </header>
      <div className={cx(style.ghost)} />
    </>
  )
}
