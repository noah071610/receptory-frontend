"use client"

import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { EditorFooterList, EditorFooterListActions, SectionListTypes } from "@/types/Edit"
import getId from "@/utils/helpers/getId"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { useParams, usePathname, useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "../style.module.scss"
const cx = cs.bind(style)

export default function List({
  list,
  isSectionList,
  isOpenAllList,
}: {
  list: EditorFooterList[]
  isSectionList: boolean
  isOpenAllList: boolean
}) {
  const { replace } = useRouter()
  const pathname = usePathname()
  const { lang } = useParams()
  const { addSection, formSections, homeSections, setActive, active, stage, rendingSections } = useEditorStore()
  const { t } = useTranslation()

  const onClickList = (value: string, type: EditorFooterListActions) => {
    switch (type) {
      case "createSection":
        const newId = getId()
        if (value === "calender" && formSections.find(({ type }) => type === "calender")) {
          return toastError("oneSection")
        }
        if (value === "time" && formSections.find(({ type }) => type === "time")) {
          return toastError("oneSection")
        }
        if (value === "email" && formSections.find(({ type }) => type === "email")) {
          return toastError("oneSection")
        }
        if (value === "qna" && homeSections.find(({ type }) => type === "qna")) {
          return toastError("oneSection")
        }
        if (value === "map" && homeSections.find(({ type }) => type === "map")) {
          return toastError("oneSection")
        }

        if (stage === "home" && homeSections.length >= 20) {
          return toastError("lessThan20sections")
        }
        if (stage === "form" && formSections.length >= 20) {
          return toastError("lessThan20sections")
        }
        if (stage === "rending" && rendingSections.length >= 20) {
          return toastError("lessThan20sections")
        }

        addSection({ type: value as SectionListTypes, newId })
        replace(`${pathname}#${newId}`)
        break
      case "imageSelector":
        setActive({ key: "modal", payload: { type: `${value}-image` } })
        setActive({ key: "tooltip", payload: { type: null } })
        break
      case "colorSelector":
        setActive({ key: "submenu", payload: { type: null } })
        setActive({ key: "tooltip", payload: { type: value } })
        break
      case "submenu":
        setActive({ key: "tooltip", payload: { type: null } })
        setActive({ key: "submenu", payload: { type: value } })
        break

      default:
        break
    }
  }

  return (
    <div className={cx("list")}>
      {isOpenAllList ? (
        list.map((list, i) => {
          return (
            <div className={cx("li")} key={`list_${i}`}>
              <button
                onClick={() => onClickList(list.value, list.actionType)}
                className={cx("btn", { active: active.submenu.type === list.value })}
              >
                <div className={cx("icon")}>
                  <FontAwesomeIcon icon={list.icon} />
                </div>
                <span>{t(list.value)}</span>
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
                  <span>{t(list.value)}</span>
                </button>
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </div>
  )
}
