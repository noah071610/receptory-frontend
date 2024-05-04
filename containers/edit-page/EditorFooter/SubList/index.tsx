"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { AnimationTypes, DesignTypes, EditorFooterList, StyleSelectTypes } from "@/types/Edit"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "../style.module.scss"
const cx = classNames.bind(style)

export default function SubList({ list }: { list: EditorFooterList[] }) {
  const { lang } = useParams()
  const { active, selectedSection, setStyle, setList, setDesign } = useEditorStore()
  const { t } = useTranslation()
  const submenuType = active.submenu.type
  const onClickList = (value: string, i: number) => {
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
      case "select":
        setList({ index: i, key: "isActive", payload: !selectedSection.list[i].isActive })
        break
      case "imageSize":
        setStyle({ key: "backgroundSize", payload: value as StyleSelectTypes })
        break

      default:
        break
    }
  }

  return (
    <div className={cx(style.list)}>
      <Swiper
        spaceBetween={14}
        slidesPerView={"auto"}
        freeMode={true}
        modules={[FreeMode]}
        className={cx(style.slider)}
      >
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
              case "select":
                return selectedSection?.list[i].isActive
              case "imageSize":
                return selectedSection?.style.backgroundSize === list.value

              default:
                return false
            }
          }

          return (
            <SwiperSlide className={cx(style.slide)} key={`subMenuList_${list.value}`}>
              <button
                onClick={() => onClickList(list.value, i)}
                className={cx(style.btn, { [style.active]: isActive() })}
              >
                <div className={cx(style.icon)}>
                  <FontAwesomeIcon icon={list.icon} />
                </div>
                <span>{t(list.value)}</span>
              </button>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}
