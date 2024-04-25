"use client"

import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { EditorFooterList, EditorFooterListActions, EditorFooterListTypes, SectionListTypes } from "@/types/Edit"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useCallback } from "react"
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
  const { addSection, setActive, active, selectedSection, setValues } = useEditStore()
  const { t } = useTranslation()

  const onClickAddSection = (type: SectionListTypes) => {
    if (type === "slider" || type === "album") {
      return setActive({ key: "modal", payload: type })
    }
    addSection(type)
  }

  const onClickList = (value: string, type: EditorFooterListActions) => {
    if (type === "submenu") {
      setActive({ key: "submenu", payload: value })
      setActive({ key: "tooltip", payload: null })
    }
    if (type === "tooltip") {
      setActive({ key: "submenu", payload: null })
      setActive({ key: "tooltip", payload: value })
    }
    if (type === "modal") {
    }
  }

  const handleUpload = useCallback(
    (e: any, type: EditorFooterListTypes, parent?: SectionListTypes) => {
      if (selectedSection) {
        // 썸네일 배경 이미지 등, 직접적인 파일 업로드
        const formData = new FormData()
        formData.append("image", e.target.files[0])

        // const { msg, data: imageSrc } = await uploadImage(formData)
        // if (msg === "ok") {
        // }

        if (process.env.NODE_ENV === "development") {
          if (parent === "thumbnail" && type === "bgImage") {
            return setValues({
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
      {isOpenAllList ? (
        list.map((list, i) => {
          return (
            <div className={cx(style.li)} key={`list_${i}`}>
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
                  className={cx(style.btn, { [style.active]: active.submenu === list.value })}
                >
                  <div className={cx(style.icon)}>
                    <FontAwesomeIcon icon={list.icon} />
                  </div>
                  <span>{t(list.value)}</span>
                </button>
              )}
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
                    className={cx(style.btn, { [style.active]: active.submenu === list.value })}
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
      )}
    </div>
  )
}
