"use client"

import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { EditorFooterList, EditorFooterListActions, SectionListTypes } from "@/types/Edit"
import { Langs } from "@/types/Main"
import getId from "@/utils/helpers/getId"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { usePathname, useRouter } from "next/navigation"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "../style.module.scss"
const cx = cs.bind(style)

const oneSectionTypes = ["calendar", "time", "email", "nameInput", "phone", "map", "qna"]

export default function List({
  list,
  lang,
  isOpenAllList,
}: {
  list: EditorFooterList[]
  isSectionList: boolean
  isOpenAllList: boolean
  lang: Langs
}) {
  const { t } = useTranslation(["edit-page"])
  const { replace } = useRouter()
  const pathname = usePathname()
  const { stage, addSection, formSections, homeSections, setActive, active, confirmSections } = useEditorStore([
    "stage",
    "addSection",
    "formSections",
    "homeSections",
    "setActive",
    "active",
    "confirmSections",
  ])

  const onClickList = useCallback(
    (value: string, type: EditorFooterListActions) => {
      switch (type) {
        case "createSection":
          const newId = getId()
          if (oneSectionTypes.includes(value)) {
            if (value === "qna") {
              if (
                (homeSections.filter((v) => v.type === "qna").length > 0 && stage === "home") ||
                (confirmSections.filter((v) => v.type === "qna").length > 0 && stage === "confirm")
              ) {
                return toastError("oneSection")
              }
            } else {
              if ([...homeSections, ...formSections].find(({ type }) => type === value)) return toastError("oneSection")
            }
          }
          if (homeSections.length >= 20 || formSections.length >= 20 || confirmSections.length >= 20) {
            return toastError("lessThan20sections")
          }

          addSection({ type: value as SectionListTypes, newId })
          replace(`${pathname}#${newId}`)
          break
        case "imageSelector":
          setActive({ key: "modal", payload: { type: `${value}-image` } })
          break
        case "colorSelector":
          setActive({ key: "tooltip", payload: { type: value } })
          break
        case "submenu":
          setActive({ key: "submenu", payload: { type: value } })
          break
        default:
          alert("server error")
          break
      }
    },
    [addSection, confirmSections, formSections, homeSections, pathname, replace, setActive, stage]
  )

  return (
    <div className={cx("list")}>
      {isOpenAllList ? (
        list.map((list, i) => {
          return (
            <div className={cx("li")} key={`list_${i}`}>
              <button
                onClick={() => {
                  onClickList(list.value, list.actionType)
                }}
                className={cx("btn", { active: active.submenu.type === list.value })}
              >
                <div className={cx("icon")}>
                  <FontAwesomeIcon icon={list.icon} />
                </div>
                <span>{t(`footer.${list.value}`)}</span>
              </button>
            </div>
          )
        })
      ) : (
        <Swiper spaceBetween={10} slidesPerView={"auto"} freeMode={true} modules={[FreeMode]} className={cx("slider")}>
          {list.map((list, i) => {
            return (
              <SwiperSlide className={cx("slide")} key={`list_${i}`}>
                <button
                  onClick={() => onClickList(list.value, list.actionType)}
                  className={cx("btn", { active: active.submenu.type === list.value })}
                >
                  <div className={cx("icon")}>
                    <FontAwesomeIcon icon={list.icon} />
                  </div>
                  <span>{t(`footer.${list.value}`)}</span>
                </button>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </div>
  )
}
