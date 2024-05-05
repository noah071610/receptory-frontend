import { EditStage, EditorFooterList, SectionListTypes, SectionType } from "@/types/Edit"

import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faArrowDown,
  faBrush,
  faCheck,
  faClock,
  faCommentAlt,
  faEnvelope,
  faExpand,
  faFilm,
  faFont,
  faGlobe,
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
  { value: "text", icon: faFont, actionType: "createSection" },
  { value: "time", icon: faClock, actionType: "createSection" },
  { value: "select", icon: faList, actionType: "createSection" },
  { value: "input", icon: faPencil, actionType: "createSection" },
]

const footerListMap: Record<SectionListTypes, EditorFooterList[]> = {
  thumbnail: [
    { value: "design", icon: faPalette, actionType: "submenu" },
    { value: "backgroundColor", icon: faPalette, actionType: "colorSelector" },
    { value: "ctaBackgroundColor", icon: faBrush, actionType: "colorSelector" },
    { value: "background", icon: faImage, actionType: "imageSelector" },
  ],
  album: [
    { value: "design", icon: faPaintRoller, actionType: "submenu" },
    { value: "imageSize", icon: faImage, actionType: "submenu" },
  ],
  callout: [{ value: "color", icon: faPalette, actionType: "colorSelector" }],

  contact: [{ value: "animation", icon: faFilm, actionType: "submenu" }],
  map: [],
  qna: [{ value: "color", icon: faBrush, actionType: "colorSelector" }],
  slider: [
    { value: "design", icon: faPaintRoller, actionType: "submenu" },
    { value: "animation", icon: faFilm, actionType: "submenu" },
    { value: "backgroundColor", icon: faPalette, actionType: "colorSelector" },
    { value: "color", icon: faBrush, actionType: "colorSelector" },
  ],
  text: [],
  title: [
    { value: "textAlign", icon: faAlignJustify, actionType: "submenu" },
    { value: "labelColor", icon: faBrush, actionType: "colorSelector" },
    { value: "select", icon: faHandPointer, actionType: "submenu" },
  ],
  empty: [],
  checkList: [{ value: "animation", icon: faFilm, actionType: "submenu" }],
  time: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
  select: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
  input: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
  calender: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
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
    imageSize: [
      { value: "cover", icon: faCheck, actionType: "cta" },
      { value: "contain", icon: faCheck, actionType: "cta" },
    ],
  },
  callout: {},
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
      { value: "card", icon: faIdCard, actionType: "cta" },
      { value: "full", icon: faExpand, actionType: "cta" },
    ],
  },
  checkList: {
    animation: [
      { value: "none", icon: faCheck, actionType: "cta" },
      { value: "fadeIn", icon: faCheck, actionType: "cta" },
      { value: "fadeInRight", icon: faCheck, actionType: "cta" },
    ],
  },
  time: {
    design: [
      { value: "basic", icon: faCheck, actionType: "cta" },
      { value: "select", icon: faCheck, actionType: "cta" },
    ],
  },
  select: {
    design: [
      { value: "basic", icon: faCheck, actionType: "cta" },
      { value: "grid", icon: faCheck, actionType: "cta" },
    ],
  },
  calender: {
    design: [
      { value: "single", icon: faCheck, actionType: "cta" },
      { value: "multiple", icon: faCheck, actionType: "cta" },
    ],
  },
  input: {
    design: [
      { value: "text", icon: faCheck, actionType: "cta" },
      { value: "number", icon: faArrowDown, actionType: "cta" },
      { value: "country", icon: faGlobe, actionType: "cta" },
      { value: "email", icon: faEnvelope, actionType: "cta" },
      { value: "textarea", icon: faCommentAlt, actionType: "cta" },
    ],
  },
}
// ####### SUBMENU

export const getEditorFooterList = (selectedSection: SectionType | null, stage: EditStage) => {
  if (selectedSection === null) return stage === "init" ? initSectionList : stage === "form" ? formSectionList : []
  return footerListMap[selectedSection.type].map((v) => ({ ...v, parent: selectedSection.type }))
}
export const getSubmenuList = (currentSubmenu: string | null, selectedSection: SectionType | null) => {
  if (selectedSection === null || currentSubmenu === null) return []

  const target = footerSubmenuMap[selectedSection.type][currentSubmenu]

  return target ? target.map((v) => ({ ...v, parent: selectedSection.type })) : []
}
