import { EditStage, SectionType } from "./Edit"
import { Langs } from "./Main"

export type PageFormatType = "inactive" | "active"

export interface PageContentType {
  homeSections: SectionType[]
  formSections: SectionType[]
  confirmSections: SectionType[]
  pageOptions: {
    format: PageFormatType
    lang: Langs
    customLink: string
    isUseHomeThumbnail: boolean
    isNotUseCustomLink: boolean
    embed: {
      title: string
      description: string
      src: string
    }
  }
}
export interface SaveContentType extends PageContentType {
  stage: EditStage
  currentUsedImages: string[]
  currentUsedColors: string[]
}

interface _SAVE {
  pageId: string
  customLink: string
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
