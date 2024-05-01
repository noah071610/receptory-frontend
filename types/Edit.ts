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
  | "input"

export type TargetSectionListTypes =
  | "backgroundColor"
  | "ctaBackgroundColor"
  | "color"
  | "background"
  | "design"
  | "animation"
  | "textAlign"
  | "select"

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
  | AlignTypes
export type AnimationTypes = "none" | "fadeUp" | "flip" | "fadeIn" | "bounce" | "scaleUp"
export type TitleSelectTypes = "title" | "description" | "label"

export type EditorFooterListTypes =
  | SectionListTypes
  | TargetSectionListTypes
  | DesignTypes
  | AnimationTypes
  | AlignTypes
  | TitleSelectTypes

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

export interface ImageUpload extends File {
  preview?: string
}
