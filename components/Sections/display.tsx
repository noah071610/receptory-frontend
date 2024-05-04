"use client"

import { ReactNode } from "react"

import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SectionLayout({ children, noPadding }: { children: ReactNode; noPadding?: boolean }) {
  return (
    <section style={{ padding: noPadding ? "0px" : undefined }} className={cx(style.section, style.display)}>
      {children}
    </section>
  )
}
