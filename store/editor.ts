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

export const initialStates: EditStates = {
  isEditStart: false,
  homeSections: [createNewSection({ type: "thumbnail", index: 0, designInit: "simple", newId: "thumbnail" })],
  formSections: [createNewSection({ type: "thumbnail", index: 0, designInit: "background", newId: "formThumbnail" })],
  confirmSections: [
    createNewSection({ type: "thumbnail", index: 0, designInit: "background", newId: "rendingThumbnail" }),
    createNewSection({ type: "confirm", index: 1, newId: "confirm" }),
  ],
  selectedSection: null,
  stage: "home",
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
    isUseHomeThumbnail: true,
    isNotUseCustomLink: true,
    customLink: "",
    embed: {
      title: "임베드 제목 입력",
      description: "",
      src: "",
    },
  },
}

export interface EditStates {
  isEditStart: boolean
  homeSections: SectionType[]
  formSections: SectionType[]
  confirmSections: SectionType[]
  stage: EditStage
  selectedSection: SectionType | null
  active: ActiveTypes
  revert: {
    stage: EditStage
    selectedSection: SectionType | null
    snapshot: any
  }[]
  revertIndex: number
  currentUsedImages: string[]
  currentUsedColors: string[]
  pageOptions: {
    format: PageFormatType
    lang: Langs
    customLink: string
    isUseHomeThumbnail: boolean
    isNotUseCustomLink: boolean
    embed: {
      title: string
      description: string
      src: string
    }
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
  loadSections: (payload: SaveContentType) => void

  setRevert: (revertType: "do" | "undo" | "clear") => void
  saveSectionHistory: () => void
  setPageOptions: ({
    type,
    payload,
  }: {
    type: "format" | "lang" | "customLink" | "isUseHomeThumbnail" | "isNotUseCustomLink"
    payload: any
  }) => void
  setPageEmbedOption: ({ type, payload }: { type: "title" | "description" | "src"; payload: string }) => void
}

const getKey = (origin: any): SectionsKeys => {
  return origin.stage === "home" ? "homeSections" : origin.stage === "form" ? "formSections" : "confirmSections"
}
const getTarget = (origin: any): SectionType => {
  return origin[getKey(origin)][origin.selectedSection.index]
}

const saveSectionHistoryCallback = ({ origin }: { origin: any }) => {
  if (origin.revertIndex > -1) {
    // 뒤로가기 하고 다시 시작 하면 뒤에껀 지워버림 (안쓰겠다는 의미로 간주)
    origin.revert = origin.revert.slice(0, origin.revertIndex + 1)
  }

  const obj: any = {
    stage: origin.stage,
    selectedSection: origin.selectedSection,
  }
  switch (origin.stage) {
    case "rending":
      obj.snapshot = origin.pageOptions
      break
    default:
      obj.snapshot = origin[getKey(origin)]
      break
  }

  origin.revert.push(obj)

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
    ...initialStates,

    // SET
    saveSectionHistory: () =>
      set((origin) => {
        // 컴포넌트에서 호출할때, 기본적으로 store에서 처리함
        saveSectionHistoryCallback({ origin })
      }),
    setRevert: (revertType) =>
      set((origin) => {
        origin.active.modal = { type: null, payload: undefined }
        origin.active.submenu = { type: null, payload: undefined }
        origin.active.tooltip = { type: null, payload: undefined }
        if (revertType === "clear") {
          origin.revert = []
          origin.revertIndex = -1
          return
        }
        const doIndex = revertType === "do" ? 1 : -1
        const targetRevert = origin.revert[origin.revertIndex + doIndex]
        if (!targetRevert) return

        origin.stage = targetRevert.stage
        origin.selectedSection = targetRevert.selectedSection

        switch (targetRevert.stage) {
          case "rending":
            origin.pageOptions = targetRevert.snapshot
            break
          default:
            origin[getKey(origin)] = targetRevert.snapshot
            break
        }

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
      set((origin) => {
        if (origin.selectedSection) {
          // 히스토리 작동중.
          const target = getTarget(origin)

          target.options[key] = payload
          origin.selectedSection.options[key] = payload
          // 히스토리는 섹션 내부에서 다루기로 결정
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
        if (type !== "customLink") saveSectionHistoryCallback({ origin })
      }),
    setPageEmbedOption: ({ type, payload }) =>
      set((origin) => {
        origin.pageOptions.embed[type] = payload
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
          if (!targetKey && typeof targetIndex !== "number") return

          if (targetKey) {
            target.collection = target.collection.filter(({ key }) => key !== targetKey)
          }
          if (typeof targetIndex === "number") {
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

    loadSections: (payload) =>
      set((origin) => {
        if (payload.currentUsedColors) {
          origin.currentUsedColors = payload.currentUsedColors
        } else {
          origin.currentUsedColors = []
        }
        if (payload.currentUsedImages) {
          origin.currentUsedImages = payload.currentUsedImages
        } else {
          origin.currentUsedImages = []
        }
        if (payload.stage) {
          origin.stage = payload.stage
        } else {
          origin.stage = "home"
        }
        if (payload.homeSections?.length > 0) {
          origin.homeSections = payload.homeSections
        } else {
          origin.homeSections = []
        }
        if (payload.formSections?.length > 0) {
          origin.formSections = payload.formSections
        } else {
          origin.formSections = []
        }
        if (payload.confirmSections?.length > 0) {
          origin.confirmSections = payload.confirmSections
        } else {
          origin.confirmSections = []
        }

        if (payload.pageOptions) {
          origin.pageOptions = payload.pageOptions
        }
      }),
  }))
)
