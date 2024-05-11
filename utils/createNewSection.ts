import { colors } from "@/config/colors"
import { SectionListType, SectionListTypes, SectionType } from "@/types/Edit"
import getId from "./helpers/getId"

const getNewDate = () => new Date()
const title = {
  title: "타이틀 입력",
  description: "설명 입력",
}

const sectionMap: { [key: string]: any } = {
  calender: () => {
    return {
      collection: [],
      options: {
        isAlways: true,
        specificDate: false,
        addAnyDate: false,
        interval: "all",
        startDate: undefined,
        endDate: undefined,
        isRangeSelect: false,
        selectedSpecificDates: [],
      },
      data: title,
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
        isRangeSelect: false,
        selectedSpecificTimes: [],
      },
      data: title,
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
  email: () => {
    return {
      data: title,
    }
  },
  choices: () => {
    return {
      data: title,
      options: {
        initialSelect: "none",
      },
      design: "gender",
      list: ["left", "right"].map((v, i) => createNewSectionList(v, i, { value: "" })),
    }
  },
  phone: () => {
    return {
      data: title,
      options: { phoneNumberCountry: "ko" },
    }
  },
  numberInput: () => {
    return {
      data: title,
      options: {
        min: 0,
        max: 9999999,
      },
    }
  },
  textInput: () => {
    return {
      data: title,
      design: "text",
      options: {
        min: 0,
        max: 50,
      },
    }
  },
  title: () => {
    const list = ["title", "description", "label"]
      .map((v, i) => createNewSectionList(v, i))
      .map((v) => ({ ...v, isActive: true }))

    list[2].style.color = colors.purple

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
    }
  },
  album: () => {
    return {
      design: "basic",
    }
  },
  qna: () => {
    return {
      style: {
        color: colors.pink,
      },
      list: [{ ...createNewSectionList("qna", 0), isActive: true }],
    }
  },
  select: () => {
    const target = createNewSectionList("select", 0, { data: { title: "", description: "" } })
    return {
      value: undefined,
      design: "imageWithText",
      list: [target],
      options: {
        isMultiple: false,
        addSelectNone: false,
      },
      data: title,
    }
  },
  thumbnail: (designInit?: string) => {
    return {
      design: designInit ?? "simple",
      data: {
        ...title,
        cta: "폼으로 이동",
      },
      style: {
        src: "",
        color: "rgba(130, 42, 202, 0.6)",
        background: "",
        backgroundColor: "rgba(255,176,176,0.25)",
      },
    }
  },
}

export const createNewSectionList = (subType: string, index: number, obj?: any): SectionListType => {
  if (subType === "qna") {
    obj = { isActive: true }
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

export const createNewSection = ({
  type,
  index,
  newId,
  designInit,
}: {
  type: SectionListTypes
  index: number
  newId?: string
  designInit?: string
}): SectionType => {
  const setProperties = sectionMap[type] ? sectionMap[type](designInit) : {}

  return {
    // 객체 참조 이슈 때문에 하드 코딩, 바꾸지마세요..!
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
