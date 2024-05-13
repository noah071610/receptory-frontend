import {
  ActiveTypes,
  DesignTypes,
  EditStage,
  SectionListType,
  SectionListTypes,
  SectionType,
  SectionsKeys,
  StyleProperties,
} from "@/types/Edit"
import { Langs } from "@/types/Main"
import { PageFormatType, SaveContentType } from "@/types/Page"

import { createNewSection, createNewSectionList } from "@/utils/createNewSection"
import getId from "@/utils/helpers/getId"
import { cloneDeep } from "lodash"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"

export interface EditStates {
  isEditStart: boolean
  initSections: SectionType[]
  formSections: SectionType[]
  rendingSections: SectionType[]
  stage: EditStage
  selectedSection: SectionType | null
  active: ActiveTypes
  revert: {
    sectionKey: SectionsKeys
    snapshot: SectionType[]
  }[]
  revertIndex: number
  currentUsedImages: string[]
  currentUsedColors: string[]
  pageOptions: {
    format: PageFormatType
    lang: Langs
    customLink: string
  }
}

type Actions = {
  setSelectedSection: ({ payload }: { payload: EditStates["selectedSection"] }) => void
  setStage: (stage: EditStage) => void
  setSrc: ({ payload }: { payload: string }) => void
  setStyle: ({ key, payload }: { key: keyof StyleProperties; payload: any }) => void
  setDesign: ({ payload }: { payload: DesignTypes }) => void
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
  setText: ({ payload }: { payload: string }) => void
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
  setCollection: ({ payload, index, key }: { payload: any; index: number; key: string }) => void

  addSection: ({ type, payload, newId }: { type: SectionListTypes; payload?: SectionType; newId?: string }) => void
  addList: ({ type, valueArrForNewList }: { type: string; valueArrForNewList?: { [key: string]: any }[] }) => void
  addCollection: ({ payload }: { payload: any }) => void
  addUsed: ({ type, payload }: { type: "currentUsedColors" | "currentUsedImages"; payload: string }) => void

  deleteSection: (id: string) => void
  deleteList: ({ targetIndex }: { targetIndex: number }) => void
  deleteCollection: ({ targetIndex, targetKey }: { targetIndex?: number; targetKey?: string }) => void

  moveSection: ({ from, to }: { from: number; to: number }) => void
  copySection: (payload: { payload: SectionType; newId?: string }) => void
  loadSections: (payload: SaveContentType, lang: Langs, format: PageFormatType) => void

  setRevert: (revertType: "do" | "undo") => void
  saveSectionHistory: () => void
  setPageOptions: ({ type, payload }: { type: "format" | "lang" | "customLink"; payload: any }) => void
}
const getKey = (origin: any): SectionsKeys => {
  return origin.stage === "init" ? "initSections" : origin.stage === "form" ? "formSections" : "rendingSections"
}
const getTarget = (origin: any): SectionType => {
  return origin[getKey(origin)][origin.selectedSection.index]
}

const saveSectionHistoryCallback = ({ origin }: { origin: any }) => {
  const sectionKey = getKey(origin)
  if (origin.revertIndex > -1) {
    // 뒤로가기 하고 다시 시작 하면 뒤에껀 지워버림 (안쓰겠다는 의미로 간주)
    origin.revert = origin.revert.slice(0, origin.revertIndex + 1)
  }

  origin.revert.push({ sectionKey, snapshot: [...origin[sectionKey]] })
  if (origin.revert.length >= 20) {
    // 20개 넘게 뒤로가기 할거면 인간적으로 저장 버튼을 눌러라.. 라는 취지
    origin.revert.shift()
  } else {
    origin.revertIndex = origin.revert.length - 1
  }
}

export const useEditorStore = create<EditStates & Actions>()(
  immer((set) => ({
    // STATE
    isEditStart: false,
    initSections: [createNewSection({ type: "thumbnail", index: 0, designInit: "simple", newId: "thumbnail" })],
    formSections: [createNewSection({ type: "thumbnail", index: 0, designInit: "background", newId: "formThumbnail" })],
    rendingSections: [
      createNewSection({ type: "thumbnail", index: 0, designInit: "background", newId: "rendingThumbnail" }),
      createNewSection({ type: "confirm", index: 1, newId: "confirm" }),
    ],
    selectedSection: null,
    stage: "init",
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
    revert: [],
    revertIndex: -1,
    currentUsedImages: [],
    currentUsedColors: [],
    pageOptions: {
      format: "inactive",
      lang: "ko",
      customLink: "",
    },

    // SET
    saveSectionHistory: () =>
      set((origin) => {
        // 컴포넌트에서 호출할때, 기본적으로 store에서 처리함
        saveSectionHistoryCallback({ origin })
      }),
    setRevert: (revertType: "do" | "undo") =>
      set((origin) => {
        origin.active.modal = { type: null, payload: undefined }
        origin.active.submenu = { type: null, payload: undefined }
        origin.active.tooltip = { type: null, payload: undefined }
        const doIndex = revertType === "do" ? 1 : -1
        const targetRevert = origin.revert[origin.revertIndex + doIndex]
        if (!targetRevert) return
        const { sectionKey, snapshot } = targetRevert

        // 스테이지 이동
        if (sectionKey === "initSections" && origin.stage !== "init") {
          origin.stage = "init"
        }
        if (sectionKey === "formSections" && origin.stage !== "form") {
          origin.stage = "form"
        }
        if (sectionKey === "rendingSections" && origin.stage !== "rending") {
          origin.stage = "rending"
        }

        origin[sectionKey] = snapshot

        if (revertType === "undo") {
          origin.revertIndex--
        } else {
          origin.revertIndex++
        }
      }),
    setSelectedSection: ({ payload }) =>
      set((origin) => {
        if (origin.revert.length <= 0 && payload) {
          saveSectionHistoryCallback({ origin })
        }
        origin.selectedSection = payload
      }),
    setStage: (stage) =>
      set((origin) => {
        if (origin.revert.length <= 0) {
          saveSectionHistoryCallback({ origin })
        }
        origin.stage = stage
        saveSectionHistoryCallback({ origin })
      }),
    setValue: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          if (typeof payload !== "undefined") {
            target.value = payload
            origin.selectedSection.value = payload
          }
        }
      }),
    setText: ({ payload }) =>
      set((origin) => {
        // todo: 안씀
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.text = payload
          if (origin.selectedSection) {
            origin.selectedSection.text = payload
          }
        }
      }),
    setSrc: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.src = payload
          origin.selectedSection.src = payload
          saveSectionHistoryCallback({ origin })
        }
      }),
    setDesign: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.design = payload
          origin.selectedSection.design = payload
          saveSectionHistoryCallback({ origin })
        }
      }),
    setData: ({ payload, key }) =>
      // 히스토리 작동중, 현재 input밖에 안씀.
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.data[key] = payload
          origin.selectedSection.data[key] = payload
        }
      }),
    setOptions: ({ payload, key }) =>
      // todo :
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)

          target.options[key] = payload
          origin.selectedSection.options[key] = payload
        }
      }),
    setList: ({ index, payload, key, dataKey }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)

          if (dataKey) {
            target.list[index].data[dataKey] = payload as never
            if (origin.selectedSection) origin.selectedSection.list[index].data[dataKey] = payload as never
          } else {
            target.list[index][key] = payload as never
            if (origin.selectedSection) origin.selectedSection.list[index][key] = payload as never
          }

          if (key !== "value" && key !== "data") {
            saveSectionHistoryCallback({ origin })
          }
        }
      }),
    setStyle: ({ key, payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.style[key] = payload
          origin.selectedSection.style[key] = payload
          saveSectionHistoryCallback({ origin })
        }
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
      }),
    setCollection: ({ payload, index, key }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)

          if (typeof index === "number") {
            if (key) {
              target.collection[index][key] = payload
              origin.selectedSection.collection[index][key] = payload
            } else {
              target.collection[index] = payload
              origin.selectedSection.collection[index] = payload
            }
          } else {
            target.collection = payload
            origin.selectedSection.collection = payload
          }
        }
      }),
    setPageOptions: ({ type, payload }) =>
      set((origin) => {
        origin.pageOptions[type] = payload as never
      }),

    // ADD
    addSection: ({ type, payload, newId }) =>
      set((origin) => {
        const sections = origin[getKey(origin)]
        const newSection = payload ?? createNewSection({ type, index: sections.length, newId })
        if (origin.revert.length <= 0) {
          saveSectionHistoryCallback({ origin })
        }
        sections.push(newSection)
        saveSectionHistoryCallback({ origin })
        origin.selectedSection = newSection
      }),
    addList: ({ type, valueArrForNewList }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          ;(valueArrForNewList ?? [undefined]).forEach((v) => {
            const newList = createNewSectionList(type, target.list.length, v)
            target.list.push(newList)
          })
          origin.selectedSection.list = target.list

          saveSectionHistoryCallback({ origin })
        }
      }),
    addCollection: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)

          target.collection.push(payload)
          origin.selectedSection.collection.push(payload)
          saveSectionHistoryCallback({ origin })
        }
      }),
    addUsed: ({ type, payload }) =>
      set((origin) => {
        const existIndex = origin[type].findIndex((v) => v === payload)
        if (existIndex >= 0) {
          // 있으면 갱신
          origin[type].splice(existIndex, 1)
        } else {
          // 없으면 배열이 10개 넘는지 확인
          if (origin[type].length >= 10) {
            origin[type].pop()
          }
        }
        origin[type] = [payload, ...origin[type]]
      }),

    // DELETE
    deleteList: ({ targetIndex }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.list = target.list.filter((_, i) => i !== targetIndex).map((v, i) => ({ ...v, index: i }))
          origin.selectedSection.list = target.list
          saveSectionHistoryCallback({ origin })
        }
      }),

    deleteSection: (payload) =>
      set((origin) => {
        const key = getKey(origin)
        const deleteSection = origin[key].find((v) => v.id === payload)
        if (!deleteSection) return

        if (origin.revert.length <= 0) {
          saveSectionHistoryCallback({ origin })
        }
        origin[key] = origin[key].filter((v) => v.id !== payload)
        origin.selectedSection = null
        origin[key] = origin[key].map((v, i) => ({ ...v, index: i }))

        saveSectionHistoryCallback({ origin })
      }),

    deleteCollection: ({ targetIndex, targetKey }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          if (!targetKey && !targetIndex) return

          if (targetKey) {
            target.collection = target.collection.filter(({ key }) => key !== targetKey)
          }
          if (targetIndex) {
            target.collection = target.collection.filter((_, i) => i !== targetIndex)
          }

          origin.selectedSection.collection = target.collection
          saveSectionHistoryCallback({ origin })
        }
      }),

    // ETC
    copySection: ({ payload, newId }) =>
      set((origin) => {
        const copy = cloneDeep({ ...payload, id: newId ?? getId() })
        const key = getKey(origin)

        if (origin.revert.length <= 0) {
          saveSectionHistoryCallback({ origin })
        }

        origin[key].splice(payload.index + 1, 0, copy)
        origin[key] = origin[key].map((v, i) => ({ ...v, index: i }))

        origin.selectedSection = origin[key].find((v) => v.id === copy.id) ?? null

        saveSectionHistoryCallback({ origin })
      }),

    moveSection: ({ from, to }) =>
      set((origin) => {
        const sections = origin[getKey(origin)]
        const _target = sections[from]

        if (origin.revert.length <= 0) {
          saveSectionHistoryCallback({ origin })
        }

        sections.splice(from, 1)
        sections.splice(to, 0, _target)
        origin[getKey(origin)] = sections.map((v, i) => ({ ...v, index: i }))

        saveSectionHistoryCallback({ origin })
      }),

    loadSections: (payload, lang, format) =>
      set((origin) => {
        if (payload.currentUsedColors) {
          origin.currentUsedColors = payload.currentUsedColors
        }
        if (payload.currentUsedImages) {
          origin.currentUsedImages = payload.currentUsedImages
        }
        if (payload.stage) {
          origin.stage = payload.stage
        }
        if (payload.initSections?.length > 0) {
          origin.initSections = payload.initSections
        }
        if (payload.formSections?.length > 0) {
          origin.formSections = payload.formSections
        }
        if (payload.rendingSections?.length > 0) {
          origin.rendingSections = payload.rendingSections
        }

        if (payload.pageOptions) {
          origin.pageOptions = payload.pageOptions
          origin.pageOptions.format = format
          origin.pageOptions.lang = lang
        }
      }),
  }))
)
