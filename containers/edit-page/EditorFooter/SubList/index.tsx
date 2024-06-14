"use client"

import { useEditorStore } from "@/store/editor"
import { AnimationTypes, DesignTypes, EditorFooterList } from "@/types/Edit"
import { Langs } from "@/types/Main"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { useCallback } from "react"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "../style.module.scss"
const cx = cs.bind(style)

export default function SubList({ lang, list }: { lang: Langs; list: EditorFooterList[] }) {
  const { t } = useTranslation(["edit-page"])
  const { active, selectedSection, setStyle, saveSectionHistory, setOptions, setList, setDesign } = useEditorStore([
    "active",
    "selectedSection",
    "setStyle",
    "saveSectionHistory",
    "setOptions",
    "setList",
    "setDesign",
  ])
  const submenuType = active.submenu.type

  const onClickList = useCallback(
    (value: string, i: number) => {
      if (!selectedSection) return

      switch (submenuType) {
        case "design":
          setDesign({ payload: value as DesignTypes })
          break
        case "animation":
          setStyle({ key: submenuType, payload: value as AnimationTypes })
          break
        case "textAlign":
          setStyle({ key: submenuType, payload: value })
          break
        case "selectEle":
          setList({ index: i, key: "isActive", payload: !selectedSection.list[i].isActive })
          break
        case "imageSize":
          setOptions({ key: "imageSize", payload: value })
          saveSectionHistory()
          break

        default:
          break
      }
    },
    [saveSectionHistory, selectedSection, setDesign, setList, setOptions, setStyle, submenuType]
  )

  return (
    <div className={cx("list")}>
      <Swiper spaceBetween={14} slidesPerView={"auto"} freeMode={true} modules={[FreeMode]} className={cx("slider")}>
        {list.map((list, i) => {
          const isActive = () => {
            switch (submenuType) {
              case "textAlign":
                return selectedSection?.style.textAlign === list.value
              case "animation":
                return selectedSection?.style.animation
                  ? selectedSection?.style.animation === list.value
                  : list.value === "none"
              case "design":
                return selectedSection?.design === list.value
              case "selectEle":
                return selectedSection?.list[i].isActive
              case "imageSize":
                return selectedSection?.options.imageSize === list.value

              default:
                return false
            }
          }

          return (
            <SwiperSlide className={cx("slide")} key={`subMenuList_${list.value}`}>
              <button onClick={() => onClickList(list.value, i)} className={cx("btn", { active: isActive() })}>
                <div className={cx("icon")}>
                  <FontAwesomeIcon icon={list.icon} />
                </div>
                <span>{t(`footer.${list.value}`)}</span>
              </button>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
