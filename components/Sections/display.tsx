"use client"

import { ReactNode, useEffect, useRef } from "react"

import { useEditorStore } from "@/store/editor"
import { getAnimation } from "@/utils/styles/getAnimation"
import cs from "classNames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function SectionLayout({
  children,
  noPadding,
  id,
  style,
  isAnimation,
  index,
}: {
  children: ReactNode
  noPadding?: boolean
  id: string
  style: any
  isAnimation?: boolean
  index: number
}) {
  const observerRef = useRef<HTMLDivElement | null>(null)
  const { selectedSection } = useEditorStore(["selectedSection"])

  useEffect(() => {
    if (typeof window === "object" && selectedSection?.id === id && observerRef?.current) {
      if (observerRef?.current) observerRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [selectedSection, id])

  const sectionStyle = { padding: noPadding ? "0px" : undefined, ...style }
  return (
    <section
      ref={observerRef}
      style={
        isAnimation && index > 0
          ? Object.assign(sectionStyle, getAnimation({ type: "fadeUp", delay: index * 180 }))
          : sectionStyle
      }
      className={cx("section", "display")}
    >
      <div className={cx("observer")}></div>
      {children}
    </section>
  )
}
