import { IconDefinition } from "@fortawesome/fontawesome-svg-core"

export type SectionTypes = "text" | "contact" | "image" | "images" | "map" | "q&a" | "thumbnail"
export type ThumbnailTypes = "bgColor" | "ctaColor" | "textColor" | "bgImage"
export type EditStage = "init" | "edit" | "rending"

export interface ColorsObj {
  bgColor: string
  ctaColor: string
  textColor: string
  mainColor: string
  subColor: string
}
export interface SectionType {
  id: string
  index: number
  type: SectionTypes
  value: string
  values: string[]
  list: { [key: string]: any }[]
  src: string[]
  style: string
  colors: ColorsObj
  animation: string | null
}

export type FooterListActionTypes = "cta" | "tooltip" | "submenu" | "file"
export interface FooterListType {
  value: SectionTypes | ThumbnailTypes
  icon: IconDefinition
  actionType: FooterListActionTypes
}
