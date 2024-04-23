"use client"

import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { EditorFooterList, EditorFooterListActions, EditorFooterListTypes, SectionListTypes } from "@/types/Edit"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useCallback } from "react"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import ColorPicker from "../../../../components/Tools/ColorPicker"
import style from "../style.module.scss"
const cx = classNames.bind(style)

export default function List({ list, isSectionList }: { list: EditorFooterList[]; isSectionList: boolean }) {
  const { lang } = useParams()
  const {
    addSection,
    setSelectedSection,
    setOpenedTooltip,
    openedTooltip,
    setOpenedSubmenu,
    setSrc,
    openedSubmenu,
    selectedSection,
  } = useEditStore()
  const { t } = useTranslation()

  const onClickAddSection = (type: SectionListTypes) => {
    addSection(type)
  }
  const onClickClose = () => {
    setSelectedSection({ payload: null })
    setOpenedSubmenu({ type: null })
  }

  const onClickList = (value: string, type: EditorFooterListActions) => {
    if (type === "submenu") {
      setOpenedSubmenu({ type: value })
      setOpenedTooltip({ type: null })
    }
    if (type === "tooltip") {
      setOpenedSubmenu({ type: null })
      setOpenedTooltip({ type: value })
    }
  }

  const handleUpload = useCallback(
    (e: any, type: EditorFooterListTypes, parent?: SectionListTypes) => {
      if (selectedSection) {
        const formData = new FormData()
        formData.append("image", e.target.files[0])

        // const { msg, data: imageSrc } = await uploadImage(formData)
        // if (msg === "ok") {
        // }

        if (process.env.NODE_ENV === "development") {
          if (parent === "thumbnail" && type === "bgImage") {
            return setSrc({
              payload:
                "https://png.pngtree.com/thumb_back/fw800/back_our/20200814/ourmid/pngtree-romantic-sky-gradient-background-png-image_392970.jpg",
              key: "bgImage",
            })
          }
        }
      }
    },
    [selectedSection]
  )

  return (
    <div className={cx(style.list)}>
      <Swiper
        spaceBetween={14}
        slidesPerView={"auto"}
        freeMode={true}
        modules={[FreeMode]}
        className={cx(style.slider, "editor-footer-slider")}
      >
        {list.map((list, i) => {
          return (
            <SwiperSlide className={cx(style.slide)} key={`tournament_candidate_${i}`}>
              {list.actionType === "file" ? (
                <label id="file-upload" className={cx(style.btn, style["file-upload"])}>
                  <input
                    id="file-upload"
                    multiple={false}
                    type="file"
                    onChange={(e) => handleUpload(e, list.value, list.parent)}
                  />
                  <div className={cx(style.icon)}>
                    <FontAwesomeIcon icon={list.icon} />
                  </div>
                  <span>{t(list.value)}</span>
                </label>
              ) : (
                <button
                  onClick={() => {
                    !isSectionList
                      ? onClickAddSection(list.value as SectionListTypes)
                      : onClickList(list.value, list.actionType)
                  }}
                  className={cx(style.btn, { [style.active]: openedSubmenu === list.value })}
                >
                  <div className={cx(style.icon)}>
                    <FontAwesomeIcon icon={list.icon} />
                  </div>
                  <span>{t(list.value)}</span>
                </button>
              )}
            </SwiperSlide>
          )
        })}
      </Swiper>
      {isSectionList && (
        <div className={cx(style.close)}>
          <button onClick={onClickClose} className={cx(style.btn)}>
            <div className={cx(style.icon)}>
              <FontAwesomeIcon icon={faClose} />
            </div>
          </button>
        </div>
      )}
      {(openedTooltip === "bgColor" || openedTooltip === "textColor" || openedTooltip === "ctaColor") && (
        <ColorPicker colorKey={openedTooltip} />
      )}
    </div>
  )
}
