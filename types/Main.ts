import { SectionListTypes } from "./Edit"

export type Langs = "ko" | "en" | "ja" | "th"
export type LangParams = { params: { lang: Langs } }
export type LayoutLangParams = {
  children: React.ReactNode
  params: {
    lang: Langs
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
  | null
