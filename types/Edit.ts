import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { Image } from "react-grid-gallery"

export type SectionListTypes =
  | "thumbnail"
  | "text"
  | "title"
  | "contact"
  | "card"
  | "callout"
  | "slider"
  | "album"
  | "map"
  | "qAnda"
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
export type StyleTypes = "basicStyle" | "cardStyle" | "albumStyle" | "gridTwoStyle" | "gridOneStyle" | AlignTypes
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

interface _SectionType {
  id: string
  index: number
  value: any
  values: { [key: string]: any }
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
  images: Image[]
  src: { [key: string]: string }
}
export interface SectionListType extends _SectionType {
  type: string
  src: string
}

export type EditorFooterListActions = "cta" | "tooltip" | "submenu" | "file" | "modal"

export interface EditorFooterList {
  value: EditorFooterListTypes
  icon: IconDefinition
  actionType: EditorFooterListActions
  parent?: SectionListTypes
}
