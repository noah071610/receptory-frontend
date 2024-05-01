"use client"

import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { EditorFooterList, EditorFooterListActions, SectionListTypes } from "@/types/Edit"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "../style.module.scss"
const cx = classNames.bind(style)

export default function List({
  list,
  isSectionList,
  isOpenAllList,
}: {
  list: EditorFooterList[]
  isSectionList: boolean
  isOpenAllList: boolean
}) {
  const { lang } = useParams()
  const { addSection, setActive, active } = useEditorStore()
  const { t } = useTranslation()

  const onClickList = (value: string, type: EditorFooterListActions) => {
    switch (type) {
      case "createSection":
        addSection({ payload: value as SectionListTypes })
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
    <div className={cx(style.list)}>
      {isOpenAllList ? (
        list.map((list, i) => {
          return (
            <div className={cx(style.li)} key={`list_${i}`}>
              <button
                onClick={() => onClickList(list.value, list.actionType)}
                className={cx(style.btn, { [style.active]: active.submenu.type === list.value })}
              >
                <div className={cx(style.icon)}>
                  <FontAwesomeIcon icon={list.icon} />
                </div>
                <span>{t(list.value)}</span>
              </button>
            </div>
          )
        })
      ) : (
        <Swiper
          spaceBetween={10}
          slidesPerView={"auto"}
          freeMode={true}
          modules={[FreeMode]}
          className={cx(style.slider)}
        >
          {list.map((list, i) => {
            return (
              <SwiperSlide className={cx(style.slide)} key={`list_${i}`}>
                <button
                  onClick={() => onClickList(list.value, list.actionType)}
                  className={cx(style.btn, { [style.active]: active.submenu.type === list.value })}
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
      )}
    </div>
  )
}
