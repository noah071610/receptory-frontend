import { colors } from "@/config/colors"
import { SectionListType, SectionListTypes, SectionType } from "@/types/Edit"
import { EditorState } from "draft-js"
import getId from "./getId"

const getNewEmptyEditor = () => EditorState.createEmpty()
const getNewDate = () => new Date()

const sectionMap: { [key: string]: any } = {
  calender: () => {
    return {
      value: {
        selectedStartDate: undefined,
        selectedEndDate: undefined,
      },
      collection: [],
      options: {
        isAlways: true,
        specificDate: false,
        addAnyDate: false,
        interval: "all",
        startDate: new Date(),
        endDate: undefined,
        selectRange: "single",
        selectedSpecificDates: [],
      },
      data: {
        title: "타이틀 입력",
        description: "설명 입력",
      },
    }
  },
  slider: () => {
    return {
      style: {
        backgroundColor: colors.white,
        color: colors.border,
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
    const list = ["title", "description", "label"]
      .map((v, i) => createNewSectionList(v, i))
      .map((v) => ({ ...v, isActive: true }))

    list[2].style.color = "rgba(158,0,255,0.3)"

    return {
      style: {
        textAlign: "left",
      },
      list,
    }
  },
  checkList: () => {
    return {
      list: [createNewSectionList("checkList", 0, { design: "check" })],
    }
  },
  callout: () => {
    return {
      style: {
        backgroundColor: colors.graySoft,
      },
      text: getNewEmptyEditor(),
    }
  },
  album: () => {
    return {
      design: "basic",
      style: {
        backgroundSize: "cover",
      },
    }
  },
  qna: () => {
    return {
      style: {
        color: colors.pink,
      },
      list: [{ ...createNewSectionList("qna", 0), isActive: true, text: getNewEmptyEditor() }],
    }
  },
  time: () => {
    return {
      collection: [],
      options: {
        isAlways: true,
        specificTime: false,
        addAnytime: false,
        interval: 1,
        startHour: "00",
        endHour: "00",
        selectRange: "single",
        selectedSpecificTimes: [],
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
    list[0].value = "타이틀 입력"
    list[1].value = "설명 입력"
    list[2].value = "텍스트 입력"
    list[2].style.backgroundColor = "rgba(158,0,255,0.3)"

    return {
      id: "thumbnail",
      design: "card",
      style: {
        backgroundColor: "rgba(255,176,176,0.4)",
      },
      list,
    }
  },
  text: () => {
    return {
      text: getNewEmptyEditor(),
    }
  },
}

export const createNewSectionList = (subType: string, index: number, obj?: any): SectionListType => {
  if (subType === "qna") {
    obj = { isActive: true, text: getNewEmptyEditor() }
  }
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
    text: "",
    ...obj,
  }
}

export const createNewSection = (type: SectionListTypes, index: number, newId?: string): SectionType => {
  const setProperties = sectionMap[type] ? sectionMap[type]() : {}

  return {
    id: newId ?? getId(),
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
    text: "",
    ...setProperties,
  }
}
