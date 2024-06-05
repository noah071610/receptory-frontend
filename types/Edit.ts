import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export type SectionListTypes =
  | "thumbnail"
  | "text"
  | "title"
  | "contact"
  | "callout"
  | "slider"
  | "album"
  | "map"
  | "qna"
  | "empty"
  | "calendar"
  | "time"
  | "select"
  | "textInput"
  | "numberInput"
  | "phone"
  | "email"
  | "nameInput"
  | "checkList"
  | "choices"
  | "confirm"
  | "linkBtn"

export type TargetSectionListTypes =
  | "backgroundColor"
  | "ctaBackgroundColor"
  | "activeColor"
  | "color"
  | "background"
  | "design"
  | "animation"
  | "textAlign"
  | "select"
  | "labelColor"

export type AlignTypes = "left" | "center" | "right"
export type DesignTypes =
  | "basic"
  | "card"
  | "album"
  | "gridTwo"
  | "gridOne"
  | "thumbnail"
  | "circle"
  | "single"
  | "multiple"
  | "modal"
  | "grid"
  | "number"
  | "country"
  | "text"
  | "email"
  | "textarea"
  | "select"
  | "full"
  | "check"
  | "uncheck"
  | "underline"
  | "caution"
  | "imageWithText"
  | "simple"
  | "background"
  | "gender"
  | "yesOrNo"
  | "none"
  | "firstAndLast"
  | AlignTypes
export type AnimationTypes =
  | "none"
  | "fadeUp"
  | "flip"
  | "fadeIn"
  | "bounce"
  | "scaleUp"
  | "fadeInRight"
  | "fadeInLeft"
  | "heartBeat"
  | "fadeUpBig"
  | "headShake"
export type TitleSelectTypes = "title" | "description" | "label"
export type StyleSelectTypes = "imageSize" | "width" | "length"

export type EditorFooterListTypes =
  | SectionListTypes
  | TargetSectionListTypes
  | DesignTypes
  | AnimationTypes
  | AlignTypes
  | TitleSelectTypes
  | StyleSelectTypes

export type EditStage = "home" | "form" | "rending" | "confirm"

export type SectionsKeys = "homeSections" | "formSections" | "confirmSections"

export interface ActiveTypes {
  modal: {
    type: string | null
    payload: any
  }
  tooltip: {
    type: string | null
    payload: any
  }
  submenu: {
    type: string | null
    payload: any
  }
}

export interface ImageType {
  src: string
  width: number
  height: number
}

export interface StyleProperties {
  background?: string
  color?: string
  backgroundColor?: string
  width?: number
  height?: number
  textAlign?: AlignTypes
  animation?: AnimationTypes
  borderColor?: string
  backgroundSize?: "cover" | "contain"
  paddingBottom?: string
  src?: string
}

interface _SectionType {
  id: string
  index: number
  value: any
  text: string
  data: { [key: string]: any }
  collection: any[]
  src: string
  isActive: boolean
  list: SectionListType[]
  style: StyleProperties
  design: DesignTypes
  options: { [key: string]: any }
}
export interface SectionType extends _SectionType {
  type: SectionListTypes
}
export interface SectionListType extends _SectionType {
  type: string
}

export type EditorFooterListActions =
  | "cta"
  | "colorSelector"
  | "submenu"
  | "imageSelector"
  | "createSection"
  | "copySection"

export interface EditorFooterList {
  value: EditorFooterListTypes
  icon: IconDefinition
  actionType: EditorFooterListActions
  parent?: SectionListTypes
}

export interface ImageUpload {
  uploadType: "file" | "url"
  payload: string | null
  file?: File
}

export interface GalleryImageType {
  width?: number
  height?: number
  src: string
  value: any
}
