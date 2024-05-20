import { EditStage, SectionType } from "./Edit"
import { Langs } from "./Main"

export type PageFormatType = "inactive" | "active"

export interface PageContentType {
  initSections: SectionType[]
  formSections: SectionType[]
  rendingSections: SectionType[]
  pageOptions: {
    format: PageFormatType
    lang: Langs
    customLink: string
  }
}
export interface SaveContentType extends PageContentType {
  stage: EditStage
  currentUsedImages: string[]
  currentUsedColors: string[]
}

interface _SAVE {
  pageId: string
  title?: string
  description?: string
  format: PageFormatType
  thumbnail?: string
  lang: Langs
}

export interface SaveListType extends _SAVE {
  updatedAt: Date
}

export interface SaveType extends _SAVE {
  content: SaveContentType
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface SaveUpdateType extends _SAVE {
  content: SaveContentType
}

export interface PageType extends _SAVE {
  content: PageContentType
}
