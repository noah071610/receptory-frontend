"use client"

import { ReactNode } from "react"

import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import getId from "@/utils/helpers/getId"
import { faArrowsDownToLine, faCopy, faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { DraggableProvided } from "@hello-pangea/dnd"
import cs from "classnames/bind"
import { useRouter } from "next/navigation"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function SectionLayout({
  children,
  section,
  draggableProvided,
  isTopSection,
  noPadding,
  pathname,
}: {
  children: ReactNode
  section: SectionType
  draggableProvided?: DraggableProvided
  isTopSection?: boolean
  noPadding?: boolean
  pathname: string
}) {
  const { replace } = useRouter()
  const {
    selectedSection,
    copySection,
    stage,
    homeSections,
    confirmSections,
    formSections,
    clearActive,
    setSelectedSection,
    deleteSection,
    setStyle,
  } = useEditorStore([
    "selectedSection",
    "copySection",
    "stage",
    "homeSections",
    "confirmSections",
    "formSections",
    "clearActive",
    "setSelectedSection",
    "deleteSection",
    "setStyle",
  ])

  const onClickSection = (e: any) => {
    const closestElement = e.target.closest("[data-closer]")

    if (closestElement) {
      const dataType = closestElement.getAttribute("data-closer")
      if (dataType === "delete") {
        return setSelectedSection({ payload: null })
      }
      setSelectedSection({ payload: section })
    }

    // modal은 건드리지 말 것
    clearActive(true)
  }
  const onClickDelete = () => {
    deleteSection(section.id)
  }
  const onClickCopy = () => {
    if (stage === "home" && homeSections.length >= 20) {
      // lessThan20sections
      return toastError("lessThan20sections")
    }
    if (stage === "form" && formSections.length >= 20) {
      // lessThan20sections
      return toastError("lessThan20sections")
    }
    if (stage === "confirm" && confirmSections.length >= 20) {
      // lessThan20sections
      return toastError("lessThan20sections")
    }

    const newId = getId()
    copySection({ payload: section, newId })

    replace(`${pathname}#${newId}`)
  }
  const onClickMargin = () => {
    if (section.style.paddingBottom) {
      setStyle({ key: "paddingBottom", payload: undefined })
    } else {
      setStyle({ key: "paddingBottom", payload: "40px" })
    }
  }

  return (
    <section
      {...draggableProvided?.draggableProps}
      ref={draggableProvided?.innerRef}
      onClick={onClickSection}
      data-editor={true}
      data-closer="editor"
      style={{
        ...draggableProvided?.draggableProps.style,
        padding: section.type === "thumbnail" || noPadding ? "0px" : undefined,
        paddingBottom: section.style.paddingBottom,
      }}
      className={cx("section", { active: selectedSection?.id === section.id })}
    >
      <div className={cx("observer")} id={section.id}></div>
      {children}

      {!isTopSection && (
        <div data-closer="editor" className={cx("tools", { active: selectedSection?.id === section.id })}>
          <button onClick={onClickMargin} className={cx("icon", "margin", { active: section.style?.paddingBottom })}>
            <FontAwesomeIcon icon={faArrowsDownToLine} />
          </button>
          {section.type !== "calendar" &&
            section.type !== "time" &&
            section.type !== "qna" &&
            section.type !== "map" && (
              <button onClick={onClickCopy} data-closer="copy" className={cx("icon")}>
                <FontAwesomeIcon icon={faCopy} />
              </button>
            )}
          <button data-closer="delete" onClick={onClickDelete} className={cx("icon")}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
          <button {...draggableProvided?.dragHandleProps} className={cx("grab")}>
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6 15H6.01M6 9H6.01M12 9H12.01M18 9H18.01M18 15H18.01M12 15H12.01M7 9C7 9.55228 6.55228 10 6 10C5.44772 10 5 9.55228 5 9C5 8.44772 5.44772 8 6 8C6.55228 8 7 8.44772 7 9ZM7 15C7 15.5523 6.55228 16 6 16C5.44772 16 5 15.5523 5 15C5 14.4477 5.44772 14 6 14C6.55228 14 7 14.4477 7 15ZM13 9C13 9.55228 12.5523 10 12 10C11.4477 10 11 9.55228 11 9C11 8.44772 11.4477 8 12 8C12.5523 8 13 8.44772 13 9ZM13 15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15C11 14.4477 11.4477 14 12 14C12.5523 14 13 14.4477 13 15ZM19 9C19 9.55228 18.5523 10 18 10C17.4477 10 17 9.55228 17 9C17 8.44772 17.4477 8 18 8C18.5523 8 19 8.44772 19 9ZM19 15C19 15.5523 18.5523 16 18 16C17.4477 16 17 15.5523 17 15C17 14.4477 17.4477 14 18 14C18.5523 14 19 14.4477 19 15Z"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </section>
  )
}
