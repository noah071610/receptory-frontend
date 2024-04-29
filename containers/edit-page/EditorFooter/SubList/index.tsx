"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { AnimationTypes, DesignTypes, EditorFooterList } from "@/types/Edit"
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

  const onClickList = (value: string, i: number) => {
    if (!selectedSection) return

    switch (active.submenu) {
      case "design":
        setDesign({ payload: value as DesignTypes })
        break
      case "animation":
        setStyle({ key: active.submenu, payload: value as AnimationTypes })
        break
      case "textAlign":
        setStyle({ key: active.submenu, payload: value })
        break
      case "select":
        setList({ index: i, key: "isActive", payload: !selectedSection.list[i].isActive })
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
            switch (active.submenu) {
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
