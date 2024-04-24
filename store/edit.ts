import {
  AnimationTypes,
  EditStage,
  SectionColorType,
  SectionListType,
  SectionListTypes,
  SectionType,
  StyleTypes,
} from "@/types/Edit"
import { Image } from "react-grid-gallery"

import { produce } from "immer"
import { create } from "zustand"

import { createNewSection, createNewSectionList } from "@/utils/createNewSection"
import { cloneDeep } from "lodash"

export interface EditStates {
  sections: SectionType[]
  stage: EditStage
  selectedSection: SectionType | null
  currentSubmenu: string | null
  currentTooltip: string | null
}

type Actions = {
  setSelectedSection: ({ payload }: { payload: EditStates["selectedSection"] }) => void
  addSection: (payload: SectionListTypes) => void
  addList: ({ totalNum }: { totalNum: number }) => void
  addImages: ({ width, height, src }: { width: number; height: number; src: string }) => void
  deleteListOrImages: ({ type, targetIndex }: { type: "images" | "list"; targetIndex: number }) => void
  setColor: ({ payload, key }: { payload: string; key: keyof SectionColorType }) => void
  setTitle: ({ payload }: { payload: string }) => void
  setStyle: ({ payload }: { payload: StyleTypes }) => void
  setAnimation: ({ payload }: { payload: AnimationTypes }) => void
  setDescription: ({ payload }: { payload: string }) => void
  setLabel: ({ payload }: { payload: string }) => void
  setList: ({ index, payload, key }: { index: number; payload: any; key: keyof SectionListType }) => void
  setImages: ({ index, payload, key }: { index: number; payload: any; key: keyof Image }) => void
  setValue: ({ payload }: { payload: string }) => void
  setValues: ({ payload, key }: { payload: any; key: string }) => void
  setSrc: ({ payload, key }: { payload: string; key: string }) => void
  setCurrentSubmenu: ({ type }: { type: string | null }) => void
  setCurrentTooltip: ({ type }: { type: string | null }) => void
  deleteSection: (id: string) => void
  moveSection: ({ from, to }: { from: number; to: number }) => void
}

export const useEditStore = create<EditStates & Actions>()((set) => ({
  sections: [createNewSection("thumbnail", 0)],
  stage: "init",
  currentSubmenu: null,
  currentTooltip: null,
  selectedSection: null,
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
  setImages: ({ index, payload, key }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.images[index][key] = payload as never
          draft.selectedSection.images[index][key] = payload as never
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
  setSrc: ({ payload, key }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          target.src[key] = payload
          draft.selectedSection.src[key] = payload
        }
      })
    ),
  setCurrentSubmenu: ({ type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.currentSubmenu = type
      })
    ),
  setCurrentTooltip: ({ type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.currentTooltip = type
      })
    ),
  addSection: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        const target = createNewSection(payload, origin.sections.length)
        draft.sections.push(target)
        draft.selectedSection = target
      })
    ),
  addList: ({ totalNum }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          const j = target.list.length
          Array.from({ length: totalNum }, (_, i) => i).forEach((i) =>
            target.list.push(createNewSectionList("list", i + j))
          )
          draft.selectedSection.list = target.list
        }
      })
    ),
  addImages: ({ src, width, height }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          const obj = {
            src,
            width,
            height,
            thumbnailCaption: "",
          }
          target.images.push(obj)
          draft.selectedSection.images.push(obj)
        }
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

  deleteSection: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.sections = draft.sections.filter((v) => v.id !== payload)
        draft.selectedSection = null
        draft.sections = draft.sections.map((v, i) => ({ ...v, index: i }))
      })
    ),
  deleteListOrImages: ({ targetIndex, type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          if (type === "images") {
            target.images = target.images.filter((_, i) => i !== targetIndex)
            draft.selectedSection.images = target.images
          } else {
            target.list = target.list.filter((_, i) => i !== targetIndex).map((v, i) => ({ ...v, index: i }))
            draft.selectedSection.list = target.list
          }
        }
      })
    ),
}))
