import { ColorsObj, EditStage, FooterListType, SectionType, SectionTypes } from "@/types/Edit"
import { produce } from "immer"
import { create } from "zustand"

import getId from "@/utils/getId"
import {
  faBrush,
  faCommentAlt,
  faFont,
  faImage,
  faImages,
  faMap,
  faPalette,
  faPhone,
} from "@fortawesome/free-solid-svg-icons"

export const sectionList: FooterListType[] = [
  { value: "text", icon: faFont, actionType: "cta" },
  { value: "contact", icon: faPhone, actionType: "cta" },
  { value: "image", icon: faImage, actionType: "cta" },
  { value: "images", icon: faImages, actionType: "cta" },
  { value: "map", icon: faMap, actionType: "cta" },
  { value: "q&a", icon: faCommentAlt, actionType: "cta" },
]

export const thumbnailList: FooterListType[] = [
  { value: "bgColor", icon: faPalette, actionType: "tooltip" },
  { value: "textColor", icon: faFont, actionType: "tooltip" },
  { value: "ctaColor", icon: faBrush, actionType: "tooltip" },
  { value: "bgImage", icon: faImage, actionType: "file" },
]

export interface EditStates {
  sections: SectionType[]
  stage: EditStage
  selectedSection: SectionType | null
  activeListType: string | null
}

type Actions = {
  setSelectedSection: ({ payload }: { payload: EditStates["selectedSection"] }) => void
  addSection: (payload: SectionTypes) => void
  setSection: ({
    type,
    payload,
    arrIndex,
    key,
  }: {
    type: keyof SectionType
    payload: any
    arrIndex?: number
    key?: string
  }) => void
  setActiveListType: ({ type }: { type: string | null }) => void
  deleteSection: (id: string) => void
  moveSection: ({ from, to }: { from: number; to: number }) => void
}

const createNewSection = (type: SectionTypes, index: number) => {
  const obj = () => {
    switch (type) {
      case "contact":
        return {
          list: [
            {
              type: "call",
              value: "",
              isActive: true,
              onClick: (str: string) => {
                return `${str}`
              },
            }, // 라인 녹색
            {
              type: "email",
              value: "",
              isActive: false,
              onClick: (str: string) => {
                const mailtoLink = `mailto:${str}}`
                window.location.href = mailtoLink
              },
            }, // 라인 녹색
            {
              type: "line",
              value: "",
              isActive: false,
              onClick: (str: string) => {
                return `${str}`
              },
            }, // 라인 녹색
            {
              type: "twitter",
              cvalue: "",
              isActive: false,
              onClick: (str: string) => {
                return `${str}`
              },
            }, // 트위터 파란색
            {
              type: "facebook",
              cvalue: "",
              isActive: false,
              onClick: (str: string) => {
                return `${str}`
              },
            }, // 페이스북 파란색
            {
              type: "kakaoTalk",
              value: "",
              isActive: false,
              onClick: (str: string) => {
                return `${str}`
              },
            }, // 카카오톡 노란색
          ],
        }

      default:
        return {}
    }
  }
  return {
    id: getId(),
    index,
    type,
    value: "",
    values: [],
    src: [],
    style: "",
    list: [],
    colors: {
      bgColor: "#ffffff",
      ctaColor: "#d9abffdf",
      textColor: "#505056",
      mainColor: "#ffffff",
      subColor: "#ffffff",
    },
    animation: null,
    ...obj(),
  }
}

const setTargetSection = (
  selectedSection: SectionType,
  target: SectionType,
  type: keyof SectionType,
  payload: any,
  index?: number,
  key?: string
) => {
  switch (type) {
    case "colors":
      if (!target.colors[key as keyof ColorsObj]) return alert("key 값 없음")
      if (key) {
        target.colors[key as keyof ColorsObj] = payload as string
        selectedSection.colors[key as keyof ColorsObj] = payload as string
      } else {
        alert("key 값 없음")
      }

      break
    case "value":
      target.value = payload as string
      selectedSection.value = payload as string
      break
    case "values":
      if (typeof index === "number") {
        target.values[index] = payload
        selectedSection.values[index] = payload
      } else {
        alert("index 값 없음")
      }
      break
    case "list":
      if (key) {
        if (typeof index === "number") {
          target.list[index][key] = payload
          selectedSection.list[index][key] = payload
        } else {
          alert("index 값 없음")
        }
      } else {
        alert("key 값 없음")
      }
      break
    case "src":
      if (typeof index !== "number") return alert("index 값 없음")
      if (!!payload) {
        target.src[index] = payload
        selectedSection.src[index] = payload
      } else {
        target.src = target.src.map((v, i) => (i === index ? "" : v))
        selectedSection.src = selectedSection.src.map((v, i) => (i === index ? "" : v))
      }
      break
    default:
      alert("setTargetSection 값 없음")
      break
  }
}
export const useEditStore = create<EditStates & Actions>()((set) => ({
  sections: [createNewSection("thumbnail", 0)],
  stage: "init",
  activeListType: null,
  selectedSection: null,
  setSelectedSection: ({ payload }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.selectedSection = payload
      })
    ),
  setSection: ({ type, payload, arrIndex, key }) =>
    set((origin) =>
      produce(origin, (draft) => {
        if (draft.selectedSection) {
          const target = draft.sections[draft.selectedSection.index]
          if (target) {
            setTargetSection(draft.selectedSection, target, type, payload, arrIndex, key)
          }
        }
      })
    ),
  setActiveListType: ({ type }) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.activeListType = type
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

  moveSection: ({ from, to }) =>
    set((origin) =>
      produce(origin, (draft) => {
        const _target = { ...draft.sections[from] }
        draft.sections.splice(from, 1)
        draft.sections.splice(to, 0, _target)
        draft.sections = draft.sections.map((v, i) => ({ ...v, index: i + 1 }))
      })
    ),

  deleteSection: (payload) =>
    set((origin) =>
      produce(origin, (draft) => {
        draft.sections = draft.sections.filter((v) => v.id !== payload)
        draft.selectedSection = null
        draft.sections = draft.sections.map((v, i) => ({ ...v, index: i + 1 }))
      })
    ),
}))
