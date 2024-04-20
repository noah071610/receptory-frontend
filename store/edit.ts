import { EditStage, SectionType, SectionTypes } from "@/types/Edit"
import { produce } from "immer"
import { nanoid } from "nanoid"
import { create } from "zustand"

import {
  IconDefinition,
  faCommentAlt,
  faFont,
  faImage,
  faImages,
  faMap,
  faPhone,
} from "@fortawesome/free-solid-svg-icons"

export const sectionArr: { value: SectionTypes; icon: IconDefinition }[] = [
  { value: "text", icon: faFont },
  { value: "contact", icon: faPhone },
  { value: "image", icon: faImage },
  { value: "images", icon: faImages },
  { value: "map", icon: faMap },
  { value: "q&a", icon: faCommentAlt },
]

const getId = () => nanoid(12)

export interface EditStates {
  sections: SectionType[]
  stage: EditStage
  selectedSection: SectionType | null
}

type Actions = {
  setSelectedSection: (payload: EditStates["selectedSection"]) => void
  addSection: (payload: SectionTypes) => void
  deleteSection: (id: string) => void
  moveSection: ({ from, to }: { from: number; to: number }) => void
}

export const useEditStore = create<EditStates & Actions>()((set) => ({
  sections: [],
  stage: "init",
  selectedSection: null,
  setSelectedSection: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.selectedSection = payload
      })
    ),
  addSection: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        const target = {
          id: getId(),
          type: payload,
          value: "",
          values: [],
          src: [],
          style: "",
          color: "black",
          bgColor: "#ffffff",
          animation: null,
        }
        draft.sections.push(target)
        draft.selectedSection = target
      })
    ),

  moveSection: ({ from, to }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const _target = { ...draft.sections[from] }
        draft.sections.splice(from, 1)
        draft.sections.splice(to, 0, _target)
      })
    ),

  deleteSection: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.sections = draft.sections.filter((v) => v.id !== payload)
        draft.selectedSection = null
      })
    ),
}))
