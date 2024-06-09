"use client"

import Confirm from "@/components/Sections/Confirm"
import Empty from "@/components/Sections/Empty"
import SectionLoading from "@/components/Sections/SectionLoading"
import Thumbnail from "@/components/Sections/Thumbnail"
import { SectionListTypes, SectionType } from "@/types/Edit"
import dynamic from "next/dynamic"

const Calender = dynamic(() => import("@/components/Sections/Calendar/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Callout = dynamic(() => import("@/components/Sections/Callout/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Choices = dynamic(() => import("@/components/Sections/Choices/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageChoices = dynamic(() => import("@/components/Sections/Choices/PageChoices/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Album = dynamic(() => import("@/components/Sections/Album/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageCalender = dynamic(() => import("@/components/Sections/Calendar/PageCalender/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageTime = dynamic(() => import("@/components/Sections/Time/PageTime/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageSelectList = dynamic(() => import("@/components/Sections/SelectList/PageSelectList/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageTextInput = dynamic(() => import("@/components/Sections/FormInput/Text/PageText/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageNameInput = dynamic(() => import("@/components/Sections/FormInput/Name/PageNameInput/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageNumberInput = dynamic(() => import("@/components/Sections/FormInput/Number/PageNumber/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PagePhone = dynamic(() => import("@/components/Sections/FormInput/Phone/PagePhone/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Contact = dynamic(() => import("@/components/Sections/Contact/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Slider = dynamic(() => import("@/components/Sections/Slider/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Text = dynamic(() => import("@/components/Sections/Text/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageText = dynamic(() => import("@/components/Sections/Text/PageText/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Title = dynamic(() => import("@/components/Sections/Title/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Map = dynamic(() => import("@/components/Sections/Map/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const QnA = dynamic(() => import("@/components/Sections/QnA/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const PageQnA = dynamic(() => import("@/components/Sections/QnA/PageQnA/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Time = dynamic(() => import("@/components/Sections/Time/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const SelectList = dynamic(() => import("@/components/Sections/SelectList/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const TextInput = dynamic(() => import("@/components/Sections/FormInput/Text/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const NumberInput = dynamic(() => import("@/components/Sections/FormInput/Number/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Phone = dynamic(() => import("@/components/Sections/FormInput/Phone/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const NameInput = dynamic(() => import("@/components/Sections/FormInput/Name/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const Email = dynamic(() => import("@/components/Sections/FormInput/Email/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const CheckList = dynamic(() => import("@/components/Sections/CheckList/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})
const LinkBtn = dynamic(() => import("@/components/Sections/LinkBtn/index"), {
  ssr: true,
  loading: () => <SectionLoading />,
})

export const sectionMap: Record<SectionListTypes, (section: SectionType, isDisplayMode?: boolean) => any> = {
  album: (section, isDisplayMode = false) => <Album section={section} isDisplayMode={isDisplayMode} />,
  text: (section, isDisplayMode = false) =>
    isDisplayMode ? <PageText text={section.value} /> : <Text section={section} />,
  title: (section, isDisplayMode = false) => <Title section={section} isDisplayMode={isDisplayMode} />,
  contact: (section, isDisplayMode = false) => (
    <Contact section={section} isEditor={true} isDisplayMode={isDisplayMode} />
  ),
  callout: (section, isDisplayMode = false) => <Callout section={section} isDisplayMode={isDisplayMode} />,
  slider: (section, isDisplayMode = false) => <Slider section={section} isDisplayMode={isDisplayMode} />,
  map: (section, isDisplayMode = false) => <Map section={section} isDisplayMode={isDisplayMode} />,
  qna: (section, isDisplayMode = false) => (isDisplayMode ? <PageQnA section={section} /> : <QnA section={section} />),
  calendar: (section, isDisplayMode = false) =>
    isDisplayMode ? <PageCalender section={section} /> : <Calender section={section} />,
  thumbnail: (section, isDisplayMode = false) => <Thumbnail section={section} isDisplayMode={isDisplayMode} />,
  textInput: (section, isDisplayMode = false) =>
    !isDisplayMode ? <TextInput section={section} /> : <PageTextInput section={section} />,
  numberInput: (section, isDisplayMode = false) =>
    !isDisplayMode ? <NumberInput section={section} /> : <PageNumberInput section={section} />,
  phone: (section, isDisplayMode = false) =>
    !isDisplayMode ? <Phone section={section} /> : <PagePhone section={section} />,
  email: (section, isDisplayMode = false) => <Email section={section} isDisplayMode={isDisplayMode} />,
  choices: (section, isDisplayMode = false) =>
    isDisplayMode ? <PageChoices section={section} /> : <Choices section={section} />,
  time: (section, isDisplayMode = false) =>
    isDisplayMode ? <PageTime section={section} /> : <Time section={section} />,
  select: (section, isDisplayMode = false) =>
    isDisplayMode ? <PageSelectList section={section} /> : <SelectList section={section} />,
  empty: () => <Empty />,
  checkList: (section, isDisplayMode = false) => <CheckList section={section} isDisplayMode={isDisplayMode} />,
  linkBtn: (section, isDisplayMode = false) => <LinkBtn section={section} isDisplayMode={isDisplayMode} />,
  confirm: (section, isDisplayMode = false) => <Confirm section={section} />,
  nameInput: (section, isDisplayMode = false) =>
    isDisplayMode ? <PageNameInput section={section} /> : <NameInput section={section} />,
}
