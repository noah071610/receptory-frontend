"use client"

import Calender from "@/components/Sections/Calender"
import Empty from "@/components/Sections/Empty"
import Thumbnail from "@/components/Sections/Thumbnail"
import { SectionListTypes, SectionType } from "@/types/Edit"
import dynamic from "next/dynamic"

const Callout = dynamic(() => import("@/components/Sections/Callout/index"), {
  ssr: true,
})
const Album = dynamic(() => import("@/components/Sections/Album/index"), {
  ssr: true,
})
const Contact = dynamic(() => import("@/components/Sections/Contact/index"), {
  ssr: true,
})
const Slider = dynamic(() => import("@/components/Sections/Slider/index"), {
  ssr: true,
})
const Text = dynamic(() => import("@/components/Sections/Text/index"), {
  ssr: true,
})
const Title = dynamic(() => import("@/components/Sections/Title/index"), {
  ssr: true,
})
const Map = dynamic(() => import("@/components/Sections/Map/index"), {
  ssr: true,
})
const QnA = dynamic(() => import("@/components/Sections/QnA/index"), {
  ssr: true,
})
const Time = dynamic(() => import("@/components/Sections/Time/index"), {
  ssr: true,
})
const Select = dynamic(() => import("@/components/Sections/SelectList/index"), {
  ssr: true,
})
const FormInput = dynamic(() => import("@/components/Sections/FormInput/index"), {
  ssr: true,
})
const CheckList = dynamic(() => import("@/components/Sections/CheckList/index"), {
  ssr: true,
})

export const sectionMap: Record<SectionListTypes, (section: SectionType, isDisplayMode?: boolean) => any> = {
  album: (section, isDisplayMode = false) => <Album section={section} isDisplayMode={isDisplayMode} />,
  text: (section, isDisplayMode = false) => <Text section={section} isDisplayMode={isDisplayMode} />,
  title: (section, isDisplayMode = false) => <Title section={section} isDisplayMode={isDisplayMode} />,
  contact: (section, isDisplayMode = false) => <Contact section={section} isDisplayMode={isDisplayMode} />,
  callout: (section, isDisplayMode = false) => <Callout section={section} isDisplayMode={isDisplayMode} />,
  slider: (section, isDisplayMode = false) => <Slider section={section} isDisplayMode={isDisplayMode} />,
  map: (section, isDisplayMode = false) => <Map section={section} isDisplayMode={isDisplayMode} />,
  qna: (section, isDisplayMode = false) => <QnA section={section} isDisplayMode={isDisplayMode} />,
  calender: (section, isDisplayMode = false) => <Calender section={section} isDisplayMode={isDisplayMode} />,
  thumbnail: (section, isDisplayMode = false) => <Thumbnail section={section} isDisplayMode={isDisplayMode} />,
  input: (section, isDisplayMode = false) => <FormInput section={section} isDisplayMode={isDisplayMode} />,
  time: (section, isDisplayMode = false) => <Time section={section} isDisplayMode={isDisplayMode} />,
  select: (section, isDisplayMode = false) => <Select section={section} isDisplayMode={isDisplayMode} />,
  empty: () => <Empty />,
  checkList: (section, isDisplayMode = false) => <CheckList section={section} isDisplayMode={isDisplayMode} />,
}
