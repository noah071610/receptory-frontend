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
export type TargetSectionListTypes =
  | "bgColor"
  | "ctaColor"
  | "textColor"
  | "bgImage"
  | "style"
  | "animation"
  | "align"
  | "select"

export type AlignTypes = "left" | "center" | "right"
export type StyleTypes =
  | "basicStyle"
  | "cardStyle"
  | "albumStyle"
  | "gridTwoStyle"
  | "gridOneStyle"
  | "thumbnailStyle"
  | "circleStyle"
  | AlignTypes
export type AnimationTypes = "none" | "fadeUp" | "flip" | "fadeIn" | "bounce" | "scaleUp"
export type TitleSelectTypes = "title" | "description" | "label"

export type EditorFooterListTypes =
  | SectionListTypes
  | TargetSectionListTypes
  | StyleTypes
  | AnimationTypes
  | AlignTypes
  | TitleSelectTypes

export type EditStage = "init" | "edit" | "rending"

export interface SectionColorType {
  bgColor: string
  ctaColor: string
  textColor: string
  mainColor: string
  subColor: string
}
export interface ImageType {
  src: string
  width: number
  height: number
}

interface _SectionType {
  id: string
  index: number
  width: number
  height: number
  value: any
  values: { [key: string]: any }
  src: string
  isActive: boolean
  title: string
  description: string
  label: string
  list: SectionListType[]
  style: StyleTypes
  colors: SectionColorType
  animation: AnimationTypes
}
export interface SectionType extends _SectionType {
  type: SectionListTypes
}
export interface SectionListType extends _SectionType {
  type: string
}

export type EditorFooterListActions = "cta" | "tooltip" | "submenu" | "file" | "modal"

export interface EditorFooterList {
  value: EditorFooterListTypes
  icon: IconDefinition
  actionType: EditorFooterListActions
  parent?: SectionListTypes
}

export interface ImageUpload extends File {
  preview?: string
}
