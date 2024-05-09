import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { EditorState } from "draft-js"

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
  | "calender"
  | "time"
  | "select"
  | "textInput"
  | "numberInput"
  | "phone"
  | "email"
  | "checkList"

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
  | "none"
  | AlignTypes
export type AnimationTypes =
  | "none"
  | "fadeUp"
  | "flip"
  | "fadeIn"
  | "bounce"
  | "scaleUp"
  | "fadeInRight"
  | "heartBeat"
  | "fadeUpBig"
export type TitleSelectTypes = "title" | "description" | "label"
export type StyleSelectTypes = "cover" | "contain"

export type EditorFooterListTypes =
  | SectionListTypes
  | TargetSectionListTypes
  | DesignTypes
  | AnimationTypes
  | AlignTypes
  | TitleSelectTypes
  | StyleSelectTypes

export type EditStage = "init" | "form" | "rending"

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
}

interface _SectionType {
  id: string
  index: number
  value: any
  text: EditorState
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

export type EditorFooterListActions = "cta" | "colorSelector" | "submenu" | "imageSelector" | "createSection"

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
