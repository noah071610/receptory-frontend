import { EditStage, EditorFooterList, SectionListTypes, SectionType } from "@/types/Edit"

import {
  fa1,
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
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
  faList,
  faMap,
  faPaintRoller,
  faPalette,
  faPencil,
  faPhone,
  faPhotoFilm,
  faRectangleXmark,
  faSquareCheck,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons"

const initSectionList: EditorFooterList[] = [
  { value: "text", icon: faFont, actionType: "createSection" },
  { value: "title", icon: faHeading, actionType: "createSection" },
  { value: "empty", icon: faRectangleXmark, actionType: "createSection" },
  { value: "callout", icon: faIdCard, actionType: "createSection" },
  { value: "slider", icon: faPhotoFilm, actionType: "imageSelector" },
  { value: "album", icon: faImages, actionType: "imageSelector" },
  { value: "contact", icon: faPhone, actionType: "createSection" },
  { value: "map", icon: faMap, actionType: "createSection" },
  { value: "qna", icon: faCommentAlt, actionType: "createSection" },
  { value: "checkList", icon: faSquareCheck, actionType: "createSection" },
]
const formSectionList: EditorFooterList[] = [
  { value: "calender", icon: faCalendar, actionType: "createSection" },
  { value: "time", icon: faClock, actionType: "createSection" },
  { value: "select", icon: faList, actionType: "createSection" },
  { value: "choices", icon: faHandPointer, actionType: "createSection" },
  { value: "textInput", icon: faPencil, actionType: "createSection" },
  { value: "numberInput", icon: fa1, actionType: "createSection" },
  { value: "phone", icon: faPhone, actionType: "createSection" },
  { value: "email", icon: faEnvelope, actionType: "createSection" },
  { value: "text", icon: faFont, actionType: "createSection" },
  { value: "title", icon: faHeading, actionType: "createSection" },
  { value: "callout", icon: faIdCard, actionType: "createSection" },
  { value: "checkList", icon: faSquareCheck, actionType: "createSection" },
]

const footerListMap: Record<SectionListTypes, EditorFooterList[]> = {
  thumbnail: [
    { value: "design", icon: faPaintRoller, actionType: "submenu" },
    { value: "backgroundColor", icon: faPalette, actionType: "colorSelector" },
    { value: "ctaBackgroundColor", icon: faBrush, actionType: "colorSelector" },
    { value: "background", icon: faImage, actionType: "imageSelector" },
  ],
  album: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
  callout: [
    { value: "animation", icon: faFilm, actionType: "submenu" },
    { value: "color", icon: faPalette, actionType: "colorSelector" },
  ],

  contact: [{ value: "animation", icon: faFilm, actionType: "submenu" }],
  map: [],
  qna: [{ value: "color", icon: faBrush, actionType: "colorSelector" }],
  slider: [
    { value: "design", icon: faPaintRoller, actionType: "submenu" },
    { value: "animation", icon: faFilm, actionType: "submenu" },
    { value: "backgroundColor", icon: faPalette, actionType: "colorSelector" },
  ],
  text: [],
  title: [
    { value: "textAlign", icon: faAlignJustify, actionType: "submenu" },
    { value: "labelColor", icon: faBrush, actionType: "colorSelector" },
    { value: "select", icon: faHandPointer, actionType: "submenu" },
  ],
  empty: [],
  checkList: [{ value: "animation", icon: faFilm, actionType: "submenu" }],
  time: [],
  select: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
  textInput: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
  numberInput: [],
  email: [],
  phone: [],
  calender: [],
  choices: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
}

// ####### SUBMENU
const footerSubmenuMap: Record<SectionListTypes, { [key: string]: EditorFooterList[] }> = {
  contact: {
    animation: [
      { value: "none", icon: faCheck, actionType: "cta" },
      { value: "fadeIn", icon: faCheck, actionType: "cta" },
      { value: "fadeUp", icon: faCheck, actionType: "cta" },
      { value: "flip", icon: faCheck, actionType: "cta" },
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
      { value: "basic", icon: faCheck, actionType: "cta" },
      { value: "gridOne", icon: faCheck, actionType: "cta" },
      { value: "gridTwo", icon: faCheck, actionType: "cta" },
    ],
    animation: [
      { value: "none", icon: faCheck, actionType: "cta" },
      { value: "fadeIn", icon: faCheck, actionType: "cta" },
      { value: "scaleUp", icon: faCheck, actionType: "cta" },
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
      { value: "thumbnail", icon: faCheck, actionType: "cta" },
    ],
    animation: [
      { value: "none", icon: faCheck, actionType: "cta" },
      { value: "fadeIn", icon: faCheck, actionType: "cta" },
      { value: "flip", icon: faCheck, actionType: "cta" },
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
  checkList: {
    animation: [
      { value: "none", icon: faCheck, actionType: "cta" },
      { value: "fadeIn", icon: faCheck, actionType: "cta" },
      { value: "fadeInRight", icon: faCheck, actionType: "cta" },
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
  calender: {},
  textInput: {
    design: [
      { value: "text", icon: faCheck, actionType: "cta" },
      { value: "textarea", icon: faCommentAlt, actionType: "cta" },
    ],
  },
  email: {},
  numberInput: {},
  phone: {},
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
  if (selectedSection === null) return stage === "init" ? initSectionList : stage === "form" ? formSectionList : []
  let target = footerListMap[selectedSection.type].map((v) => ({ ...v, parent: selectedSection.type }))
  if (selectedSection.type === "thumbnail" && stage === "form") {
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
  if (selectedSection.type === "thumbnail" && stage === "form" && currentSubmenu === "design") {
    target = target.filter(({ value }) => value !== "full")
  }

  return target ? target.map((v) => ({ ...v, parent: selectedSection.type })) : []
}
