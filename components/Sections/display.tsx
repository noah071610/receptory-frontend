"use client"

import { ReactNode, useEffect, useRef } from "react"

import { useEditorStore } from "@/store/editor"
import cs from "classNames/bind"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function SectionLayout({
  children,
  noPadding,
  id,
  style,
}: {
  children: ReactNode
  noPadding?: boolean
  id: string
  style: any
}) {
  const observerRef = useRef<HTMLDivElement | null>(null)
  const { selectedSection } = useEditorStore()

  useEffect(() => {
    if (typeof window === "object" && selectedSection?.id === id && observerRef?.current) {
      if (observerRef?.current) observerRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [selectedSection, observerRef?.current])

  return (
    <section
      ref={observerRef}
      style={{ padding: noPadding ? "0px" : undefined, ...style }}
      className={cx("section", "display")}
    >
      <div className={cx("observer")}></div>
      {children}
    </section>
  )
}
