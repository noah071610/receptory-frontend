import { EditorFooterList, SectionListTypes, SectionType } from "@/types/Edit"

import {
  faAlignCenter,
  faAlignJustify,
  faAlignLeft,
  faAlignRight,
  faBrush,
  faCheck,
  faCommentAlt,
  faFilm,
  faFont,
  faHandPointer,
  faHeading,
  faIdCard,
  faImage,
  faImages,
  faMap,
  faPaintRoller,
  faPalette,
  faPhone,
  faPhotoFilm,
  faRectangleXmark,
  faVectorSquare,
} from "@fortawesome/free-solid-svg-icons"

const sectionList: EditorFooterList[] = [
  { value: "text", icon: faFont, actionType: "cta" },
  { value: "title", icon: faHeading, actionType: "cta" },
  { value: "empty", icon: faRectangleXmark, actionType: "cta" },
  { value: "card", icon: faVectorSquare, actionType: "cta" },
  { value: "callout", icon: faIdCard, actionType: "cta" },
  { value: "slider", icon: faPhotoFilm, actionType: "cta" },
  { value: "album", icon: faImages, actionType: "cta" },
  { value: "contact", icon: faPhone, actionType: "cta" },
  { value: "map", icon: faMap, actionType: "cta" },
  { value: "qAnda", icon: faCommentAlt, actionType: "cta" },
]

const footerListMap: Record<SectionListTypes, EditorFooterList[]> = {
  thumbnail: [
    { value: "bgColor", icon: faPalette, actionType: "tooltip" },
    { value: "textColor", icon: faFont, actionType: "tooltip" },
    { value: "ctaColor", icon: faBrush, actionType: "tooltip" },
    { value: "bgImage", icon: faImage, actionType: "file" },
  ],
  album: [
    { value: "style", icon: faPaintRoller, actionType: "submenu" },
    { value: "animation", icon: faFilm, actionType: "submenu" },
  ],
  callout: [],
  card: [],
  contact: [
    { value: "style", icon: faPaintRoller, actionType: "submenu" },
    { value: "animation", icon: faFilm, actionType: "submenu" },
  ],
  map: [],
  qAnda: [],
  slider: [],
  text: [],
  title: [
    { value: "align", icon: faAlignJustify, actionType: "submenu" },
    { value: "textColor", icon: faPalette, actionType: "tooltip" },
    { value: "select", icon: faHandPointer, actionType: "submenu" },
  ],
  empty: [],
}

// ####### SUBMENU
const footerSubmenuMap: Record<SectionListTypes, { [key: string]: EditorFooterList[] }> = {
  contact: {
    style: [
      { value: "basicStyle", icon: faCheck, actionType: "cta" },
      { value: "cardStyle", icon: faCheck, actionType: "cta" },
    ],
    animation: [
      { value: "none", icon: faCheck, actionType: "cta" },
      { value: "fadeIn", icon: faCheck, actionType: "cta" },
      { value: "fadeUp", icon: faCheck, actionType: "cta" },
      { value: "flip", icon: faCheck, actionType: "cta" },
    ],
  },
  title: {
    align: [
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
    style: [
      { value: "albumStyle", icon: faCheck, actionType: "cta" },
      { value: "gridTwoStyle", icon: faCheck, actionType: "cta" },
      { value: "gridOneStyle", icon: faCheck, actionType: "cta" },
    ],
    animation: [
      { value: "none", icon: faCheck, actionType: "cta" },
      { value: "fadeIn", icon: faCheck, actionType: "cta" },
      { value: "scaleUp", icon: faCheck, actionType: "cta" },
    ],
  },
  callout: {},
  card: {},
  map: {},
  qAnda: {},
  slider: {},
  text: {},
  empty: {},
  thumbnail: {},
}
// ####### SUBMENU

export const getEditorFooterList = (selectedSection: SectionType | null) => {
  if (selectedSection === null) return sectionList
  return footerListMap[selectedSection.type].map((v) => ({ ...v, parent: selectedSection.type }))
}
export const getSubmenuList = (openedSubmenu: string | null, selectedSection: SectionType | null) => {
  if (selectedSection === null || openedSubmenu === null) return []

  const target = footerSubmenuMap[selectedSection.type][openedSubmenu]
  console.log(target)

  return target ? target.map((v) => ({ ...v, parent: selectedSection.type })) : []
}
