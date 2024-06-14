import { Langs } from "./Main"
import { PageContentType } from "./Page"

export interface TemplateCardType {
  pageId: string
  title: string
  thumbnail: string
  description: string
  lang: string
  templateLang: Langs
  isSecret: number
}

export interface TemplateCategoryType {
  category: string
  cards: TemplateCardType[]
}

export interface TemplatePage {
  pageId: string
  title?: string
  description?: string
  isSecret: number
  templateLang: Langs
  thumbnail?: string
  lang: Langs
  content: PageContentType
  createdAt: Date
  updatedAt: Date
}
