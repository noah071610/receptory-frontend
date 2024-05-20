import { SectionListTypes } from "./Edit"

export type Langs = "ko" | "en" | "ja" | "th"
export type LangParams = { params: { lang: Langs } }
export type PageParams = {
  children: React.ReactNode
  params: {
    pageId: Langs
  }
}
export interface UserPickType {
  title: string
  value: UserPickValueType[]
  index: number
  type: SectionListTypes
}
export interface UserPickValueType {
  key: string
  text: string
  description?: string
  src?: string
}

export type ModalActiveType =
  | "date"
  | "time"
  | "select"
  | "dateSelect"
  | "changeProfile"
  | "confirmHard"
  | "confirm"
  | "report"
  | "selectLang"
  | null
