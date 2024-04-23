import { SectionListType, SectionListTypes, SectionType } from "@/types/Edit"
import getId from "./getId"

export const createNewSectionList = (subType: string, index: number): SectionListType => {
  return {
    id: getId(),
    index,
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
    colors: {
      bgColor: "#ffffff",
      ctaColor: "#d9abffdf",
      textColor: "#505056",
      mainColor: "#ffffff",
      subColor: "#ffffff",
    },
    animation: "none",
  }
}

export const createNewSection = (type: SectionListTypes, index: number): SectionType => {
  const temp: any = () => {
    switch (type) {
      case "contact":
        return {
          list: ["call", "email", "line", "twitter", "facebook", "kakaoTalk"].map((v, i) => createNewSectionList(v, i)),
        }
      case "album":
        return {
          style: "albumStyle",
        }
      case "title":
        return {
          style: "left",
          list: ["title", "description", "label"]
            .map((v, i) => createNewSectionList(v, i))
            .map((v) => ({ ...v, isActive: true })),
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
    values: {},
    isActive: false,
    title: "",
    images: [],
    description: "",
    label: "",
    list: [],
    src: {},
    style: "basicStyle",
    colors: {
      bgColor: "#ffffff",
      ctaColor: "#d9abffdf",
      textColor: "#505056",
      mainColor: "#ffffff",
      subColor: "#ffffff",
    },
    animation: "none",
    ...temp(),
  }
}
