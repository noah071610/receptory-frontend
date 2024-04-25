"use client"

import SectionLayout from "@/components/DisplaySections"
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
import { useEditStore } from "@/store/edit"
import { SectionListTypes, SectionType } from "@/types/Edit"
import classNames from "classNames"
import { useParams } from "next/navigation"
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
  const { sections } = useEditStore()
  return (
    <div className={cx(style.preview)}>
      <div className={cx(style.phone)}>
        <div className={cx(style.content)}>
          {sections.map((v) => (
            <SectionLayout section={v} key={`${v.id}`}>
              {sectionMap[v.type](v)}
            </SectionLayout>
          ))}
        </div>
      </div>
    </div>
  )
}
