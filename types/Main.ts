export type Langs = "ko" | "en" | "ja" | "th"
export type LangParams = { params: { lang: Langs } }
export type LayoutLangParams = {
  children: React.ReactNode
  params: {
    lang: Langs
  }
}
export interface UserSelectedListType {
  index: number
  title: string
  description: string
  src: string
}
