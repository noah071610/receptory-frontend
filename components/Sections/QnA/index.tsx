"use client"

import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function QnA({ section }: { section: SectionType }) {
  return <section className={cx(style["cta-section"])}></section>
}
