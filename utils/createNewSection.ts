import { colors } from "@/config/colors"
import { SectionListType, SectionListTypes, SectionType } from "@/types/Edit"
import { EditorState } from "draft-js"
import getId from "./getId"

const getNewEmptyEditor = () => EditorState.createEmpty()

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
  input: () => {
    return {
      data: {
        title: "타이틀 입력",
        description: "설명 입력",
      },
      design: "text",
      options: {
        min: 0,
        max: 50,
        phoneNumberCountry: "all",
      },
    }
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
      collection: [],
      options: {
        startHour: "00",
        endHour: "00",
        interval: 1,
        addAnytime: false,
      },
      data: {
        time: null,
        title: "타이틀 입력",
        description: "설명 입력",
      },
    }
  },
  select: () => {
    const target = createNewSectionList("select", 0, { data: { title: "리스트 타이틀 todo:" } })
    return {
      value: null,
      list: [target],
      data: {
        title: "타이틀 입력",
        description: "설명 입력",
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
    text: getNewEmptyEditor(),
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
    text: getNewEmptyEditor(),
    ...setProperties,
  }
}
