export type SectionTypes = "text" | "contact" | "image" | "images" | "map" | "q&a"
export type EditStage = "init" | "edit" | "rending"

export interface SectionType {
  id: string
  type: SectionTypes
  value: string
  values: string[]
  src: string[]
  style: string
  color: string
  bgColor: string
  animation: string | null
}
