import { colors } from "@/config/colors"
import { DesignTypes, SectionListType, SectionListTypes, SectionType } from "@/types/Edit"
import getId from "./helpers/getId"

import i18n from "i18next"

export function t(value: string) {
  return i18n.t(value, {
    ns: ["edit-page"],
  })
}

const sectionMap: { [key: string]: any } = {
  calendar: () => {
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
      data: {
        title: t("title"),
        description: t("description"),
      },
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
      data: {
        title: t("title"),
        description: t("description"),
      },
    }
  },
  slider: () => {
    return {
      design: "card",
      style: {
        backgroundColor: colors.white,
        color: colors.border,
      },
      options: {
        imageSize: "width",
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
        backgroundColor: colors.ctaColor,
      },
      data: {
        link: "https://",
      },
    }
  },
  email: () => {
    return {
      data: {
        title: t("title"),
        description: t("description"),
      },
    }
  },
  choices: () => {
    return {
      data: {
        title: t("title"),
        description: t("description"),
      },
      design: "gender",
      list: ["left", "right"].map((v, i) => createNewSectionList(v, i, { value: t("description") })),
    }
  },
  phone: () => {
    return {
      data: {
        title: t("title"),
        description: t("description"),
      },
      options: { phoneNumberCountry: "ko" },
    }
  },
  numberInput: () => {
    return {
      data: {
        title: t("title"),
        description: t("description"),
      },
      options: {
        min: 0,
        max: 9999999,
      },
    }
  },
  textInput: () => {
    return {
      data: {
        title: t("title"),
        description: t("description"),
      },
      design: "text",
      options: {
        min: 0,
        max: 50,
      },
    }
  },
  nameInput: () => {
    return {
      data: {
        title: t("title"),
        description: t("description"),
      },
      design: "basic",
    }
  },
  title: () => {
    const list = ["title", "description", "label"]
      .map((v, i) => createNewSectionList(v, i))
      .map((v) => ({ ...v, isActive: true }))

    list[2].style.color = colors.blueHard

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
      design: "gridOne",
      options: {
        imageSize: "width",
      },
    }
  },
  qna: () => {
    return {
      style: {
        color: colors.blue,
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
      data: {
        title: t("title"),
        description: t("description"),
      },
    }
  },
  thumbnail: (designInit?: string) => {
    return {
      design: designInit ?? "simple",
      data: {
        title: t("title"),
        description: t("description"),
        cta: t("goToForm"),
      },
      style: {
        src: "",
        color: colors.ctaColor,
        background: "",
        backgroundColor: colors.backgroundDefaultColor,
      },
    }
  },
  confirm: () => {
    return {
      data: {
        title: t("confirmInitialTitle"),
        description: t("confirmInitialDescription"),
      },
    }
  },
}

export const createNewSectionList = (subType: string, index: number, obj?: any): SectionListType => {
  let temp = obj
  const defaultObj = () => {
    switch (subType) {
      case "select":
        return { data: { title: t("title"), description: "" } }
      case "checkList":
        return { value: t("description"), design: "check" as DesignTypes }
      case "qna":
        return { data: { title: t("title") } }
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
