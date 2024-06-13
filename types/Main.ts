import { SectionListTypes } from "./Edit"

export type PageStage = "home" | "form" | "confirm"
export type Langs = "ko" | "en" | "ja" | "th"
export type LangParams = { params: { lang: Langs } }
export type PageParams = {
  children: React.ReactNode
  params: {
    pageId: Langs
  }
  searchParams: {
    s: string
  }
}
export interface SelectedType {
  id: string
  title: string
  type: SectionListTypes
  value: SelectedValueType[]
}
export interface SelectedValueType {
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
  | "makePassword"
  | "confirmReservation"
  | null
