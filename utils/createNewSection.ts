import { colors, defaultColors } from "@/config/colors"
import { SectionListType, SectionListTypes, SectionType } from "@/types/Edit"
import getId from "./getId"

export const createNewSectionList = (subType: string, index: number, obj?: any): SectionListType => {
  return {
    id: getId(),
    index,
    width: 0,
    height: 0,
    type: subType,
    value: "",
    isActive: false,
    values: {},
    title: "",
    description: "",
    label: "",
    list: [],
    src: "",
    style: "basicStyle",
    colors: defaultColors,
    animation: "none",
    ...obj,
  }
}

export const createNewSection = (type: SectionListTypes, index: number): SectionType => {
  const temp: any = () => {
    switch (type) {
      case "contact":
        const target = {
          list: ["call", "email", "line", "twitter", "facebook", "kakaoTalk"].map((v, i) => createNewSectionList(v, i)),
        }
        target.list[0].isActive = true
        return target
      case "album":
        return {
          style: "albumStyle",
        }
      case "callout":
        return {
          colors: {
            ...defaultColors,
            bgColor: colors.graySoft,
          },
        }
      case "title":
        return {
          style: "left",
          list: ["title", "description", "label"]
            .map((v, i) => createNewSectionList(v, i))
            .map((v) => ({ ...v, isActive: true })),
        }
      case "qna":
        return {
          list: [{ ...createNewSectionList("qna", 0), isActive: true }],
        }
      default:
        return {}
    }
  }
  return {
    id: getId(),
    index,
    width: 0,
    height: 0,
    type,
    value: "",
    values: {},
    isActive: false,
    title: "",
    images: [],
    description: "",
    label: "",
    list: [],
    src: "",
    style: "basicStyle",
    colors: defaultColors,
    animation: "none",
    ...temp(),
  }
}
