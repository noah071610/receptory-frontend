import { colors } from "@/config/colors"
import { DesignTypes, SectionListType, SectionListTypes, SectionType } from "@/types/Edit"
import getId from "./helpers/getId"

const getNewDate = () => new Date()
const title = {
  title: "타이틀 입력",
  description: "설명 입력",
}
const a = new Map()
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
        interval: "1",
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
      design: "card",
      style: {
        backgroundColor: colors.white,
        color: colors.border,
      },
    }
  },
  contact: () => {
    return {}
  },
  linkBtn: () => {
    return {
      value: "텍스트 입력",
      style: {
        backgroundColor: colors.pinkSoft,
      },
      data: {
        link: "https://",
      },
    }
  },
  email: () => {
    return {
      data: title,
    }
  },
  choices: () => {
    return {
      data: title,
      design: "gender",
      list: ["left", "right"].map((v, i) => createNewSectionList(v, i, { value: "타이틀 입력" })),
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
      list: [createNewSectionList("checkList", 0)],
    }
  },
  callout: () => {
    return {
      style: {
        color: colors.orange,
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
      list: [{ ...createNewSectionList("qna", 0) }],
    }
  },
  select: () => {
    const target = createNewSectionList("select", 0)
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
  confirm: () => {
    return {
      data: {
        title: "정상적으로 제출했어요!",
        description: "귀한 시간 내주셔서 감사합니다.",
      },
    }
  },
}

export const createNewSectionList = (subType: string, index: number, obj?: any): SectionListType => {
  let temp = obj
  const defaultObj = () => {
    switch (subType) {
      case "select":
        return { data: { title: "타이틀 입력", description: "" } }
      case "checkList":
        return { value: "내용 입력", design: "check" as DesignTypes }
      case "qna":
        return { data: { title: "타이틀 입력" } }
      default:
        return {}
    }
  }

  if (!temp) {
    temp = defaultObj()
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
    ...temp,
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
