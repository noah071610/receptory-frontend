import { EditStage, EditorFooterList, SectionListTypes, SectionType } from "@/types/Edit"

import {
  fa1,
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faArrowsLeftRight,
  faArrowsUpDown,
  faBrush,
  faCalendar,
  faCheck,
  faClock,
  faCommentAlt,
  faEnvelope,
  faFilm,
  faFont,
  faHandPointer,
  faHeading,
  faIdCard,
  faImage,
  faImages,
  faLink,
  faList,
  faMap,
  faMaximize,
  faPaintRoller,
  faPalette,
  faPencil,
  faPhone,
  faPhotoFilm,
  faRectangleXmark,
  faSquareCheck,
  faUser,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons"

const design = { value: "design", icon: faPaintRoller, actionType: "submenu" } as EditorFooterList
const animation = { value: "animation", icon: faFilm, actionType: "submenu" } as EditorFooterList
const basicSections = [
  { value: "text", icon: faFont, actionType: "createSection" },
  { value: "title", icon: faHeading, actionType: "createSection" },
  { value: "empty", icon: faRectangleXmark, actionType: "createSection" },
  { value: "callout", icon: faIdCard, actionType: "createSection" },
  { value: "checkList", icon: faSquareCheck, actionType: "createSection" },
] as EditorFooterList[]
const animations = [
  { value: "none", icon: faCheck, actionType: "cta" },
  { value: "fadeIn", icon: faCheck, actionType: "cta" },
  { value: "fadeUp", icon: faCheck, actionType: "cta" },
  { value: "flip", icon: faCheck, actionType: "cta" },
] as EditorFooterList[]

const initSectionList: EditorFooterList[] = [
  ...basicSections,
  { value: "slider", icon: faPhotoFilm, actionType: "imageSelector" },
  { value: "contact", icon: faPhone, actionType: "createSection" },
  { value: "album", icon: faImages, actionType: "imageSelector" },
  { value: "map", icon: faMap, actionType: "createSection" },
  { value: "qna", icon: faCommentAlt, actionType: "createSection" },
]
const formSectionList: EditorFooterList[] = [
  { value: "calendar", icon: faCalendar, actionType: "createSection" },
  { value: "time", icon: faClock, actionType: "createSection" },
  { value: "select", icon: faList, actionType: "createSection" },
  { value: "nameInput", icon: faUser, actionType: "createSection" },
  { value: "email", icon: faEnvelope, actionType: "createSection" },
  { value: "phone", icon: faPhone, actionType: "createSection" },
  { value: "choices", icon: faHandPointer, actionType: "createSection" },
  { value: "textInput", icon: faPencil, actionType: "createSection" },
  { value: "numberInput", icon: fa1, actionType: "createSection" },

  ...basicSections,
]
const confirmSectionList: EditorFooterList[] = [
  { value: "linkBtn", icon: faLink, actionType: "createSection" },
  ...basicSections,
  { value: "contact", icon: faPhone, actionType: "createSection" },
  { value: "qna", icon: faCommentAlt, actionType: "createSection" },
]

const footerListMap: Record<SectionListTypes, EditorFooterList[]> = {
  thumbnail: [
    design,
    { value: "backgroundColor", icon: faPalette, actionType: "colorSelector" },
    { value: "ctaBackgroundColor", icon: faBrush, actionType: "colorSelector" },
    { value: "background", icon: faImage, actionType: "imageSelector" },
  ],
  album: [design, { value: "imageSize", icon: faMaximize, actionType: "submenu" }],
  callout: [design, { value: "color", icon: faPalette, actionType: "colorSelector" }],

  contact: [design],
  map: [],
  qna: [{ value: "color", icon: faBrush, actionType: "colorSelector" }],
  slider: [
    design,
    { value: "imageSize", icon: faMaximize, actionType: "submenu" },
    { value: "backgroundColor", icon: faPalette, actionType: "colorSelector" },
  ],
  text: [],
  title: [
    { value: "textAlign", icon: faAlignJustify, actionType: "submenu" },
    { value: "labelColor", icon: faBrush, actionType: "colorSelector" },
    { value: "select", icon: faHandPointer, actionType: "submenu" },
  ],
  empty: [],
  checkList: [],
  time: [],
  nameInput: [],
  select: [design],
  textInput: [design],
  numberInput: [],
  email: [],
  phone: [],
  calendar: [],
  confirm: [],
  linkBtn: [{ value: "backgroundColor", icon: faPalette, actionType: "colorSelector" }],
  choices: [design],
}

// ####### SUBMENU
const footerSubmenuMap: Record<SectionListTypes, { [key: string]: EditorFooterList[] }> = {
  contact: {
    design: [
      { value: "basic", icon: faCheck, actionType: "cta" },
      { value: "card", icon: faCheck, actionType: "cta" },
    ],
  },
  title: {
    textAlign: [
      { value: "left", icon: faAlignLeft, actionType: "cta" },
      { value: "center", icon: faAlignCenter, actionType: "cta" },
      { value: "right", icon: faAlignRight, actionType: "cta" },
    ],
    select: [
      { value: "title", icon: faCheck, actionType: "cta" },
      { value: "description", icon: faCheck, actionType: "cta" },
      { value: "label", icon: faCheck, actionType: "cta" },
    ],
  },
  album: {
    design: [
      { value: "gridOne", icon: faCheck, actionType: "cta" },
      { value: "gridTwo", icon: faCheck, actionType: "cta" },
    ],
    imageSize: [
      { value: "width", icon: faArrowsLeftRight, actionType: "cta" },
      { value: "length", icon: faArrowsUpDown, actionType: "cta" },
    ],
  },
  callout: {
    design: [
      { value: "basic", icon: faCheck, actionType: "cta" },
      { value: "card", icon: faCheck, actionType: "cta" },
      { value: "none", icon: faCheck, actionType: "cta" },
    ],
  },
  map: {},
  qna: {},
  slider: {
    design: [
      { value: "basic", icon: faCheck, actionType: "cta" },
      { value: "card", icon: faCheck, actionType: "cta" },
      { value: "circle", icon: faCheck, actionType: "cta" },
    ],
    imageSize: [
      { value: "width", icon: faArrowsLeftRight, actionType: "cta" },
      { value: "length", icon: faArrowsUpDown, actionType: "cta" },
    ],
  },
  text: {},
  empty: {},
  thumbnail: {
    design: [
      { value: "card", icon: faCheck, actionType: "cta" },
      { value: "full", icon: faCheck, actionType: "cta" },
      { value: "simple", icon: faCheck, actionType: "cta" },
      { value: "background", icon: faCheck, actionType: "cta" },
    ],
  },
  time: {},
  select: {
    design: [
      { value: "imageWithText", icon: faCheck, actionType: "cta" },
      { value: "thumbnail", icon: faCheck, actionType: "cta" },
      { value: "text", icon: faCheck, actionType: "cta" },
    ],
  },
  calendar: {},
  textInput: {
    design: [
      { value: "text", icon: faCheck, actionType: "cta" },
      { value: "textarea", icon: faCommentAlt, actionType: "cta" },
    ],
  },
  email: {},
  numberInput: {},
  checkList: {},
  phone: {},
  linkBtn: {},
  nameInput: {},
  confirm: {},
  choices: {
    design: [
      { value: "basic", icon: faCheck, actionType: "cta" },
      { value: "gender", icon: faVenusMars, actionType: "cta" },
      { value: "thumbnail", icon: faImage, actionType: "cta" },
    ],
  },
}
// ####### SUBMENU

export const getEditorFooterList = (selectedSection: SectionType | null, stage: EditStage) => {
  const stageList = stage === "home" ? initSectionList : stage === "form" ? formSectionList : confirmSectionList
  if (selectedSection === null) {
    return stageList
  }
  let target = footerListMap[selectedSection.type].map((v) => ({ ...v, parent: selectedSection.type }))
  if (target?.length <= 0) return stageList
  if (selectedSection.type === "thumbnail" && (stage === "form" || stage === "confirm")) {
    target = target.filter(({ value }) => value !== "ctaBackgroundColor")
  }
  return target
}
export const getSubmenuList = (
  currentSubmenu: string | null,
  selectedSection: SectionType | null,
  stage: EditStage
) => {
  if (selectedSection === null || currentSubmenu === null) return []

  let target = footerSubmenuMap[selectedSection.type][currentSubmenu]
  if (
    selectedSection.type === "thumbnail" &&
    (stage === "form" || stage === "confirm") &&
    currentSubmenu === "design"
  ) {
    target = target.filter(({ value }) => value !== "full")
  }

  return target ? target.map((v) => ({ ...v, parent: selectedSection.type })) : []
}
