import {
  ActiveTypes,
  DesignTypes,
  EditStage,
  SectionListType,
  SectionListTypes,
  SectionType,
  StyleProperties,
} from "@/types/Edit"

import { createNewSection, createNewSectionList } from "@/utils/createNewSection"
import getId from "@/utils/getId"
import { EditorState, convertFromRaw } from "draft-js"
import { cloneDeep } from "lodash"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export interface EditStates {
  isEditStart: boolean
  initSections: SectionType[]
  formSections: SectionType[]
  stage: EditStage
  selectedSection: SectionType | null
  active: ActiveTypes
}

type Actions = {
  setSelectedSection: ({ payload }: { payload: EditStates["selectedSection"] }) => void
  setStage: (stage: EditStage) => void
  setSrc: ({ payload }: { payload: string }) => void
  setStyle: ({ key, payload }: { key: keyof StyleProperties; payload: any }) => void
  setDesign: ({ payload }: { payload: DesignTypes }) => void
  // setDescription: ({ payload }: { payload: string }) => void
  // setLabel: ({ payload }: { payload: string }) => void
  setList: ({
    index,
    payload,
    key,
    dataKey,
  }: {
    index: number
    payload: any
    key: keyof SectionListType
    dataKey?: string
  }) => void
  setValue: ({ payload }: { payload: any }) => void
  setText: ({ payload }: { payload: EditorState }) => void
  setData: ({ payload, key }: { payload: any; key: string }) => void
  setOptions: ({ payload, key }: { payload: any; key: string }) => void
  setActive: ({
    key,
    payload,
  }: {
    key: "submenu" | "tooltip" | "modal" | "all"
    payload: {
      type: string | null
      payload?: any
    }
  }) => void

  addSection: ({ payload }: { payload: SectionListTypes }) => void
  addList: ({ type, obj }: { type: string; obj?: { [key: string]: any } }) => void
  addCollection: ({ payload }: { payload: any }) => void

  deleteSection: (id: string) => void
  deleteList: ({ targetIndex }: { targetIndex: number }) => void
  deleteCollection: ({ targetIndex }: { targetIndex: number }) => void

  moveSection: ({ from, to }: { from: number; to: number }) => void
  copySection: (payload: { payload: SectionType }) => void
  loadSections: (payload: { initSections: SectionType[] }) => void
}

const getTarget = (origin: any): SectionType => {
  return origin[origin.stage === "init" ? "initSections" : "formSections"][origin.selectedSection.index]
}
const getKey = (origin: any): "initSections" | "formSections" => {
  return origin.stage === "init" ? "initSections" : "formSections"
}

export const useEditorStore = create<EditStates & Actions>()(
  immer((set) => ({
    // STATE
    isEditStart: false,
    initSections: [createNewSection("thumbnail", 0)],
    formSections: [createNewSection("calender", 0)],
    selectedSection: null,
    stage: "form",
    active: {
      modal: {
        type: null,
        payload: null,
      },
      tooltip: {
        type: null,
        payload: null,
      },
      submenu: {
        type: null,
        payload: null,
      },
    },

    // SET
    setSelectedSection: ({ payload }) =>
      set((origin) => {
        origin.selectedSection = payload
      }),
    setStage: (stage) =>
      set((origin) => {
        origin.stage = stage
      }),
    setValue: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.value = payload
          origin.selectedSection.value = payload
        }
        origin.isEditStart = true
      }),
    setText: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.text = payload
          origin.selectedSection.text = payload
        }
        origin.isEditStart = true
      }),
    setSrc: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.src = payload
          origin.selectedSection.src = payload
        }
        origin.isEditStart = true
      }),
    setDesign: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.design = payload
          origin.selectedSection.design = payload
        }
        origin.isEditStart = true
      }),
    setData: ({ payload, key }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.data[key] = payload
          origin.selectedSection.data[key] = payload
        }
        origin.isEditStart = true
      }),
    setOptions: ({ payload, key }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)

          target.options[key] = payload
          origin.selectedSection.options[key] = payload
        }
        origin.isEditStart = true
      }),
    setList: ({ index, payload, key, dataKey }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)

          if (dataKey) {
            target.list[index].data[dataKey] = payload as never
            origin.selectedSection.list[index].data[dataKey] = payload as never
          } else {
            target.list[index][key] = payload as never
            origin.selectedSection.list[index][key] = payload as never
          }
        }
      }),
    setStyle: ({ key, payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.style[key] = payload
          origin.selectedSection.style[key] = payload
        }
        origin.isEditStart = true
      }),
    setActive: ({ key, payload }) =>
      set((origin) => {
        if (key === "all") {
          origin.active = {
            modal: {
              payload: null,
              ...payload,
            },
            tooltip: {
              payload: null,
              ...payload,
            },
            submenu: {
              payload: null,
              ...payload,
            },
          }
        } else {
          const target = { payload: null, ...payload }
          origin.active[key] = target
        }
        origin.isEditStart = true
      }),

    // ADD
    addSection: ({ payload }) =>
      set((origin) => {
        const newSection = createNewSection(payload, origin[getKey(origin)].length)
        origin[getKey(origin)].push(newSection)
        origin.selectedSection = newSection
        origin.isEditStart = true
      }),
    addList: ({ type, obj }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          const newList = createNewSectionList(type, target.list.length, obj)
          target.list.push(newList)
          origin.selectedSection.list.push(newList)
        }
        origin.isEditStart = true
      }),
    addCollection: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.collection.push(payload)
          origin.selectedSection.collection.push(payload)
        }
        origin.isEditStart = true
      }),

    // DELETE
    deleteList: ({ targetIndex }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.list = target.list.filter((_, i) => i !== targetIndex).map((v, i) => ({ ...v, index: i }))
          origin.selectedSection.list = target.list
        }
        origin.isEditStart = true
      }),

    deleteSection: (payload) =>
      set((origin) => {
        const key = getKey(origin)
        origin[key] = origin[key].filter((v) => v.id !== payload)
        origin.selectedSection = null
        origin[key] = origin[key].map((v, i) => ({ ...v, index: i }))
        origin.isEditStart = true
      }),

    deleteCollection: ({ targetIndex }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.collection = target.collection.filter((_, i) => i !== targetIndex)
          origin.selectedSection.collection = target.collection
        }
        origin.isEditStart = true
      }),

    // ETC
    copySection: ({ payload }) =>
      set((origin) => {
        const copy = cloneDeep({ ...payload, id: getId() })
        const key = getKey(origin)

        origin[key].splice(payload.index + 1, 0, copy)
        origin[key] = origin[key].map((v, i) => ({ ...v, index: i }))

        origin.selectedSection = origin[key].find((v) => v.id === copy.id) ?? null
        origin.isEditStart = true
      }),

    moveSection: ({ from, to }) =>
      set((origin) => {
        const key = getKey(origin)
        const _target = cloneDeep(origin[origin.stage === "init" ? "initSections" : "formSections"][from])
        origin[key].splice(from, 1)
        origin[key].splice(to, 0, _target)
        origin[key] = origin[key].map((v, i) => ({ ...v, index: i }))
        origin.isEditStart = true
      }),

    loadSections: (payload) =>
      set((origin) => {
        origin.initSections = payload.initSections.map((v) => {
          switch (v.type) {
            case "callout":
              return {
                ...v,
                text: EditorState.createWithContent(convertFromRaw(JSON.parse(v.text as any))) as EditorState,
              }
            case "text":
              return {
                ...v,
                text: EditorState.createWithContent(convertFromRaw(JSON.parse(v.text as any))) as EditorState,
              }
            case "qna":
              return {
                ...v,
                list: v.list.map((k) => ({
                  ...k,
                  text: EditorState.createWithContent(convertFromRaw(JSON.parse(k.text as any))) as EditorState,
                })),
              }
            default:
              return v
          }
        })
      }),
  }))
)
