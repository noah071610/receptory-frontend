import { EditStage, SectionType } from "./Edit"
import { Langs } from "./Main"

export type PageFormatType = "inactive" | "active"

export interface SaveContentType {
  stage: EditStage
  initSections: SectionType[]
  formSections: SectionType[]
  currentUsedImages: string[]
  currentUsedColors: string[]
  // todo: 더 추가될 예정
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
  userId: number
  createdAt: Date
  updatedAt: Date
}

export interface SaveUpdateType extends _SAVE {
  content: SaveContentType
}
