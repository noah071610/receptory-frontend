"use client"

import Album from "@/components/DisplaySections/Album"
import Callout from "@/components/DisplaySections/Callout"
import Contact from "@/components/DisplaySections/Contact"
import Empty from "@/components/DisplaySections/Empty"
import Map from "@/components/DisplaySections/Map"
import QnA from "@/components/DisplaySections/QnA"
import Slider from "@/components/DisplaySections/Slider"
import Text from "@/components/DisplaySections/Text"
import Thumbnail from "@/components/DisplaySections/Thumbnail"
import Title from "@/components/DisplaySections/Title"
import { useEditorStore } from "@/store/editor"
import { SectionListTypes, SectionType } from "@/types/Edit"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const sectionMap: Record<SectionListTypes, (section: SectionType) => any> = {
  album: (section) => <Album section={section} />,
  text: (section) => <Text section={section} />,
  title: (section) => <Title section={section} />,
  contact: (section) => <Contact section={section} />,
  callout: (section) => <Callout section={section} />,
  slider: (section) => <Slider section={section} />,
  map: (section) => <Map section={section} />,
  qna: (section) => <QnA section={section} />,
  thumbnail: (section) => <Thumbnail section={section} />,
  empty: () => <Empty />,
}

export default function Preview() {
  const { lang } = useParams()
  const previewRef = useRef()
  const { initSections, formSections, stage } = useEditorStore()

  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY * (630 / (window.innerHeight - 100))

      setScrollPosition(position)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const sections = useMemo(() => (stage === "init" ? initSections : stage === "form" ? formSections : []), [stage])

  return (
    <div className={cx(style.preview)}>
      <div className={cx(style.phone)}>
        <div style={{ top: -scrollPosition }} className={cx(style.content)}>
          {/* {sections.map((v) => (
            <SectionLayout section={v} key={`${v.id}`}>
              {sectionMap[v.type](v)}
            </SectionLayout>
          ))} */}
        </div>
      </div>
    </div>
  )
}
