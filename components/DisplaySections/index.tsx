"use client"

import { ReactNode } from "react"

import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SectionLayout({ children, section }: { children: ReactNode; section: SectionType }) {
  return <section className={cx(style.section)}>{children}</section>
}
