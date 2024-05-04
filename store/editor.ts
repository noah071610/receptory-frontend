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
  revert: {
    sectionKey: "initSections" | "formSections"
    payload: SectionType
    snapshot: string[]
  }[]
  revertIndex: number
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

  addSection: ({ type, payload }: { type: SectionListTypes; payload?: SectionType }) => void
  addList: ({ type, valueArrForNewList }: { type: string; valueArrForNewList?: { [key: string]: any }[] }) => void
  addCollection: ({ payload }: { payload: any }) => void

  deleteSection: (id: string) => void
  deleteList: ({ targetIndex }: { targetIndex: number }) => void
  deleteCollection: ({ targetIndex }: { targetIndex: number }) => void

  moveSection: ({ from, to }: { from: number; to: number }) => void
  copySection: (payload: { payload: SectionType }) => void
  loadSections: (payload: { initSections: SectionType[] }) => void

  setRevert: (revertType: "do" | "undo") => void
  saveSectionHistory: ({ payload }: { payload: SectionType }) => void
}

const getTarget = (origin: any): SectionType => {
  return origin[origin.stage === "init" ? "initSections" : "formSections"][origin.selectedSection.index]
}
const getKey = (origin: any): "initSections" | "formSections" => {
  return origin.stage === "init" ? "initSections" : "formSections"
}

const saveSectionHistory = ({ origin, payload }: { origin: any; payload: SectionType }) => {
  const sectionKey = getKey(origin)
  if (origin.revertIndex > -1) {
    // 뒤로가기 하고 다시 시작 하면 뒤에껀 지워버림 (안쓰겠다는 의미로 간주)
    origin.revert = origin.revert.slice(0, origin.revertIndex + 1)
  }

  origin.revert.push({ sectionKey, payload, snapshot: origin[sectionKey].map((v: any) => v.id) })
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
    initSections: [createNewSection("thumbnail", 0)],
    formSections: [createNewSection("calender", 0)],
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

    // SET
    saveSectionHistory: ({ payload }) =>
      set((origin) => {
        // 컴포넌트에서 호출할때, 기본적으로 store에서 처리함
        saveSectionHistory({ origin, payload })
      }),
    setRevert: (revertType: "do" | "undo") =>
      set((origin) => {
        const doIndex = revertType === "do" ? 1 : -1
        const targetRevert = origin.revert[origin.revertIndex + doIndex]
        if (!targetRevert) return
        const { payload, sectionKey, snapshot } = targetRevert

        let target = null

        // sections의 스냅샷 처리
        const arr = []
        for (let i = 0; i < snapshot.length; i++) {
          const target = origin[sectionKey].find((v) => v.id === snapshot[i])
          if (target) {
            arr.push(target)
          } else {
            arr.push(payload)
          }
        }
        origin[sectionKey] = arr

        // 스냅샷을 찍은 섹션을 덮어씌움 (virtual dom 이니까 재렌더링 안됨요)
        origin[sectionKey] = origin[sectionKey].map((v) => {
          if (v.id === payload.id) {
            target = payload
            return target
          } else {
            return v
          }
        })

        if (revertType === "undo") {
          origin.revertIndex--
        } else {
          origin.revertIndex++
        }
      }),
    setSelectedSection: ({ payload }) =>
      set((origin) => {
        if (origin.revert.length <= 0 && payload) {
          saveSectionHistory({ origin, payload })
        }
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
          saveSectionHistory({ origin, payload: target })
        }
        origin.isEditStart = true
      }),
    setDesign: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.design = payload
          origin.selectedSection.design = payload
          saveSectionHistory({ origin, payload: target })
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
          saveSectionHistory({ origin, payload: target })
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
            switch (key) {
              case "style":
                saveSectionHistory({ origin, payload: target })
                break
              case "isActive":
                saveSectionHistory({ origin, payload: target })
                break

              default:
                break
            }
          }
        }
      }),
    setStyle: ({ key, payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.style[key] = payload
          origin.selectedSection.style[key] = payload
          saveSectionHistory({ origin, payload: target })
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
    addSection: ({ type, payload }) =>
      set((origin) => {
        const sections = origin[getKey(origin)]
        const newSection = payload ?? createNewSection(type, sections.length)
        if (origin.revert.length <= 0) {
          saveSectionHistory({ origin, payload: newSection })
        }
        sections.push(newSection)
        saveSectionHistory({ origin, payload: newSection })
        origin.selectedSection = newSection
        origin.isEditStart = true
      }),
    addList: ({ type, valueArrForNewList }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          ;(valueArrForNewList ?? [{}]).forEach((v) => {
            const newList = createNewSectionList(type, target.list.length, v)
            target.list.push(newList)
          })
          origin.selectedSection.list = target.list
          saveSectionHistory({ origin, payload: target })
          origin.isEditStart = true
        }
      }),
    addCollection: ({ payload }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)

          target.collection.push(payload)
          origin.selectedSection.collection.push(payload)
          saveSectionHistory({ origin, payload: target })
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
          saveSectionHistory({ origin, payload: target })
        }
        origin.isEditStart = true
      }),

    deleteSection: (payload) =>
      set((origin) => {
        const key = getKey(origin)
        const deleteSection = origin[key].find((v) => v.id === payload)
        if (!deleteSection) return

        if (origin.revert.length <= 0) {
          saveSectionHistory({ origin, payload: deleteSection })
        }
        origin[key] = origin[key].filter((v) => v.id !== payload)
        origin.selectedSection = null
        origin[key] = origin[key].map((v, i) => ({ ...v, index: i }))

        saveSectionHistory({ origin, payload: deleteSection })
        origin.isEditStart = true
      }),

    deleteCollection: ({ targetIndex }) =>
      set((origin) => {
        if (origin.selectedSection) {
          const target = getTarget(origin)
          target.collection = target.collection.filter((_, i) => i !== targetIndex)
          origin.selectedSection.collection = target.collection
          saveSectionHistory({ origin, payload: target })
        }
        origin.isEditStart = true
      }),

    // ETC
    copySection: ({ payload }) =>
      set((origin) => {
        const copy = cloneDeep({ ...payload, id: getId() })
        const key = getKey(origin)

        if (origin.revert.length <= 0) {
          saveSectionHistory({ origin, payload: copy })
        }

        origin[key].splice(payload.index + 1, 0, copy)
        origin[key] = origin[key].map((v, i) => ({ ...v, index: i }))

        origin.selectedSection = origin[key].find((v) => v.id === copy.id) ?? null

        saveSectionHistory({ origin, payload: copy })
        origin.isEditStart = true
      }),

    moveSection: ({ from, to }) =>
      set((origin) => {
        const sections = origin[getKey(origin)]
        const _target = sections[from]

        if (origin.revert.length <= 0) {
          saveSectionHistory({ origin, payload: _target })
        }

        sections.splice(from, 1)
        sections.splice(to, 0, _target)
        origin[getKey(origin)] = sections.map((v, i) => ({ ...v, index: i }))

        saveSectionHistory({ origin, payload: _target })
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
