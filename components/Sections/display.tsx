"use client"

import { ReactNode, useEffect, useRef, useState } from "react"

import { useEditorStore } from "@/store/editor"
import classNames from "classNames"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function SectionLayout({
  children,
  noPadding,
  id,
}: {
  children: ReactNode
  noPadding?: boolean
  id: string
}) {
  const observerRef = useRef<HTMLDivElement | null>(null)
  const [curSectionId, setCurSectionId] = useState("")
  const { selectedSection } = useEditorStore()

  useEffect(() => {
    if (typeof window === "object" && selectedSection?.id === id && observerRef?.current) {
      if (observerRef?.current) observerRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }, [selectedSection, observerRef?.current])

  return (
    <section
      ref={observerRef}
      style={{ padding: noPadding ? "0px" : undefined }}
      className={cx(style.section, style.display)}
    >
      <div className={cx(style.observer)}></div>
      {children}
    </section>
  )
}
