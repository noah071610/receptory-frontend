import { EditStage, EditorFooterList, SectionListTypes, SectionType } from "@/types/Edit"

import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBrush,
  faCheck,
  faClock,
  faCommentAlt,
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
  faPhone,
  faPhotoFilm,
  faRectangleXmark,
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
]
const formSectionList: EditorFooterList[] = [
  { value: "text", icon: faFont, actionType: "createSection" },
  { value: "time", icon: faClock, actionType: "createSection" },
  { value: "list", icon: faList, actionType: "createSection" },
]

const footerListMap: Record<SectionListTypes, EditorFooterList[]> = {
  thumbnail: [
    { value: "backgroundColor", icon: faPalette, actionType: "colorSelector" },
    { value: "ctaBackgroundColor", icon: faBrush, actionType: "colorSelector" },
    { value: "background", icon: faImage, actionType: "imageSelector" },
  ],
  album: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
  callout: [{ value: "backgroundColor", icon: faPalette, actionType: "colorSelector" }],

  contact: [
    { value: "design", icon: faPaintRoller, actionType: "submenu" },
    { value: "animation", icon: faFilm, actionType: "submenu" },
  ],
  map: [],
  qna: [],
  slider: [
    { value: "design", icon: faPaintRoller, actionType: "submenu" },
    { value: "animation", icon: faFilm, actionType: "submenu" },
  ],
  text: [],
  title: [
    { value: "textAlign", icon: faAlignJustify, actionType: "submenu" },
    { value: "color", icon: faPalette, actionType: "colorSelector" },
    { value: "select", icon: faHandPointer, actionType: "submenu" },
  ],
  empty: [],
  time: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
  list: [],
  calender: [{ value: "design", icon: faPaintRoller, actionType: "submenu" }],
}

// ####### SUBMENU
const footerSubmenuMap: Record<SectionListTypes, { [key: string]: EditorFooterList[] }> = {
  contact: {
    design: [
      { value: "basic", icon: faCheck, actionType: "cta" },
      { value: "card", icon: faCheck, actionType: "cta" },
    ],
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
    // animation: [
    //   { value: "none", icon: faCheck, actionType: "cta" },
    //   { value: "fadeIn", icon: faCheck, actionType: "cta" },
    //   { value: "scaleUp", icon: faCheck, actionType: "cta" },
    // ],
  },
  callout: {},
  map: {},
  qna: {},
  slider: {
    design: [
      { value: "basic", icon: faCheck, actionType: "cta" },
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
  thumbnail: {},
  time: {
    design: [
      { value: "grid", icon: faCheck, actionType: "cta" },
      { value: "modal", icon: faCheck, actionType: "cta" },
    ],
  },
  list: {},
  calender: {
    design: [
      { value: "single", icon: faCheck, actionType: "cta" },
      { value: "multiple", icon: faCheck, actionType: "cta" },
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
