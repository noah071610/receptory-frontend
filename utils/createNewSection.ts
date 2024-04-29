import { colors } from "@/config/colors"
import { SectionListType, SectionListTypes, SectionType } from "@/types/Edit"
import { EditorState } from "draft-js"
import getId from "./getId"

const sectionMap: { [key: string]: any } = {
  calender: () => {
    return {
      design: "single",
      options: {
        isAlways: true,
        startDate: new Date(),
        endDate: undefined,
      },
    }
  },
  contact: () => {
    const target = {
      list: ["call", "email", "line", "twitter", "facebook", "kakaoTalk"].map((v, i) => createNewSectionList(v, i)),
    }
    target.list[0].isActive = true
    return target
  },
  title: () => {
    return {
      style: {
        textAlign: "left",
      },
      list: ["title", "description", "label"]
        .map((v, i) => createNewSectionList(v, i))
        .map((v) => ({ ...v, isActive: true })),
    }
  },
  callout: () => {
    return {
      style: {
        backgroundColor: colors.graySoft,
      },
    }
  },
  album: () => {
    return {
      mode: "basic",
    }
  },
  qna: () => {
    return { list: [{ ...createNewSectionList("qna", 0), isActive: true }] }
  },
  time: () => {
    return {
      design: "grid",
      options: {
        isEveryTime: true,
        startTime: "00:00",
        endTime: "23:59",
        interval: 1,
        time: "00:00",
      },
    }
  },
  thumbnail: () => {
    const list = ["title", "description", "cta"].map((v, i) => createNewSectionList(v, i))

    list[2].style.backgroundColor = colors.pinkSoft

    return {
      style: {
        backgroundColor: colors.white,
      },
      list,
    }
  },
}

export const createNewSectionList = (subType: string, index: number, obj?: any): SectionListType => {
  return {
    id: getId(),
    index,
    type: subType,
    value: "",
    isActive: false,
    data: {},
    collection: [],
    list: [],
    style: {},
    options: {},
    design: "basic",
    src: "",
    text: EditorState.createEmpty(),
    ...obj,
  }
}

export const createNewSection = (type: SectionListTypes, index: number): SectionType => {
  const setProperties = sectionMap[type] ? sectionMap[type]() : {}

  return {
    id: getId(),
    index,
    type,
    value: "",
    isActive: false,
    data: {},
    collection: [],
    list: [],
    style: {},
    options: {},
    design: "basic",
    src: "",
    text: EditorState.createEmpty(),
    ...setProperties,
  }
}
