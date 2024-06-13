import { SectionListTypes } from "@/types/Edit"

const sectionImportMap = {
  album: () => import("@/components/Sections/Album/index"),
  text: () => import("@/components/Sections/Text/PageText/index"),
  title: () => import("@/components/Sections/Title/index"),
  contact: () => import("@/components/Sections/Contact/index"),
  callout: () => import("@/components/Sections/Callout/index"),
  slider: () => import("@/components/Sections/Slider/index"),
  map: () => import("@/components/Sections/Map/index"),
  qna: () => import("@/components/Sections/QnA/PageQnA/index"),
  calendar: () => import("@/components/Sections/Calendar/PageCalender/index"),
  thumbnail: () => import("@/components/Sections/Thumbnail/index"),
  textInput: () => import("@/components/Sections/FormInput/Text/PageText/index"),
  numberInput: () => import("@/components/Sections/FormInput/Number/PageNumber/index"),
  phone: () => import("@/components/Sections/FormInput/Phone/PagePhone/index"),
  email: () => import("@/components/Sections/FormInput/Email/index"),
  choices: () => import("@/components/Sections/Choices/PageChoices/index"),
  time: () => import("@/components/Sections/Time/PageTime/index"),
  select: () => import("@/components/Sections/SelectList/PageSelectList/index"),
  empty: () => import("@/components/Sections/Empty/index"),
  checkList: () => import("@/components/Sections/CheckList/index"),
  linkBtn: () => import("@/components/Sections/LinkBtn/index"),
  confirm: () => import("@/components/Sections/Confirm/PageConfirm/index"),
  nameInput: () => import("@/components/Sections/FormInput/Name/PageNameInput/index"),
}

const getSection = async (type: SectionListTypes) => {
  if (sectionImportMap[type]) {
    const section = await sectionImportMap[type]()
    return section.default
  }
  return null
}

export default getSection
