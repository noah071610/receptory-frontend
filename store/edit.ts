import {
  AnimationTypes,
  EditStage,
  SectionColorType,
  SectionListType,
  SectionListTypes,
  SectionType,
  StyleTypes,
} from "@/types/Edit"

import { produce } from "immer"
import { create } from "zustand"

import { createNewSection, createNewSectionList } from "@/utils/createNewSection"
import getId from "@/utils/getId"
import { cloneDeep } from "lodash"

export interface EditStates {
  sections: SectionType[]
  stage: EditStage
  selectedSection: SectionType | null
  active: {
    submenu: string | null
    tooltip: string | null
    modal: string | null
    sectionModal: string | null
  }
}

type Actions = {
  setSelectedSection: ({ payload }: { payload: EditStates["selectedSection"] }) => void
  setColor: ({ payload, key }: { payload: string; key: keyof SectionColorType }) => void
  setTitle: ({ payload }: { payload: string }) => void
  setStyle: ({ payload }: { payload: StyleTypes }) => void
  setAnimation: ({ payload }: { payload: AnimationTypes }) => void
  setDescription: ({ payload }: { payload: string }) => void
  setLabel: ({ payload }: { payload: string }) => void
  setList: ({ index, payload, key }: { index: number; payload: any; key: keyof SectionListType }) => void
  setValue: ({ payload }: { payload: string }) => void
  setValues: ({ payload, key }: { payload: any; key: string }) => void
  setActive: ({
    key,
    payload,
  }: {
    key: "submenu" | "tooltip" | "modal" | "sectionModal" | "all"
    payload: string | null
  }) => void

  addSection: (payload: SectionListTypes) => void
  addList: ({ type, obj }: { type: string; obj?: { [key: string]: any } }) => void

  deleteSection: (id: string) => void
  deleteList: ({ targetIndex }: { targetIndex: number }) => void

  moveSection: ({ from, to }: { from: number; to: number }) => void
  copySection: (payload: { payload: SectionType }) => void
}

export const useEditStore = create<EditStates & Actions>()((set) => ({
  // STATE
  sections: [createNewSection("thumbnail", 0)],
  stage: "init",
  selectedSection: null,
  active: {
    submenu: null,
    tooltip: null,
    modal: null,
    sectionModal: null,
  },

  // SET
  setSelectedSection: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.selectedSection = payload
      })
    ),
  setColor: ({ payload, key }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.colors[key] = payload as string
          draft.selectedSection.colors[key] = payload as string
        }
      })
    ),
  setValue: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.value = payload
          draft.selectedSection.value = payload
        }
      })
    ),
  setValues: ({ payload, key }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.values[key] = payload
          draft.selectedSection.values[key] = payload
        }
      })
    ),
  setList: ({ index, payload, key }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]

          target.list[index][key] = payload as never
          draft.selectedSection.list[index][key] = payload as never
        }
      })
    ),
  setTitle: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.title = payload
          draft.selectedSection.title = payload
        }
      })
    ),
  setLabel: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.label = payload
          draft.selectedSection.label = payload
        }
      })
    ),
  setAnimation: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.animation = payload
          draft.selectedSection.animation = payload
        }
      })
    ),
  setStyle: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.style = payload
          draft.selectedSection.style = payload
        }
      })
    ),
  setDescription: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.description = payload
          draft.selectedSection.description = payload
        }
      })
    ),
  setActive: ({ key, payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (key === "all") {
          draft.active.modal = payload
          draft.active.submenu = payload
          draft.active.tooltip = payload
          draft.active.sectionModal = payload
        } else {
          draft.active[key] = payload
        }
      })
    ),
  // ADD
  addSection: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        const target = createNewSection(payload, origin.sections.length)
        draft.sections.push(target)
        draft.selectedSection = target
      })
    ),
  addList: ({ type, obj }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          const newList = createNewSectionList(type, target.list.length, obj)
          target.list.push(newList)
          draft.selectedSection.list.push(newList)
        }
      })
    ),

  // DELETE
  deleteList: ({ targetIndex }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.list = target.list.filter((_, i) => i !== targetIndex).map((v, i) => ({ ...v, index: i }))
          draft.selectedSection.list = target.list
        }
      })
    ),

  deleteSection: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.sections = draft.sections.filter((v) => v.id !== payload)
        draft.selectedSection = null
        draft.sections = draft.sections.map((v, i) => ({ ...v, index: i }))
      })
    ),

  // ETC
  copySection: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const copy = cloneDeep({ ...payload, id: getId() })

        draft.sections.splice(payload.index + 1, 0, copy)
        draft.sections = draft.sections.map((v, i) => ({ ...v, index: i }))

        draft.selectedSection = draft.sections.find((v) => v.id === copy.id) ?? null
      })
    ),

  moveSection: ({ from, to }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const _target = cloneDeep(draft.sections[from])
        draft.sections.splice(from, 1)
        draft.sections.splice(to, 0, _target)
        draft.sections = draft.sections.map((v, i) => ({ ...v, index: i }))
      })
    ),
}))
