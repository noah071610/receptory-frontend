"use client"

import { useTranslation } from "@/i18n/client"
import { useEditStore } from "@/store/edit"
import { FooterListActionTypes, FooterListType, SectionTypes } from "@/types/Edit"
import { faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { useCallback } from "react"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import ColorPicker from "../../../../components/Tools/ColorPicker"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function List({ list, isSectionList }: { list: FooterListType[]; isSectionList: boolean }) {
  const { lang } = useParams()
  const { addSection, setSelectedSection, setActiveListType, setSection, activeListType, selectedSection } =
    useEditStore()
  const { t } = useTranslation()
  const onClickAddSection = (type: SectionTypes) => {
    addSection(type)
  }
  const onClickClose = () => {
    setSelectedSection({ payload: null })
    setActiveListType({ type: null })
  }

  const onClickList = (value: string, type: FooterListActionTypes) => {
    if (type === "tooltip") setActiveListType({ type: value })
    if (type === "cta") {
      switch (value) {
        case "bgImage":
          break

        default:
          break
      }
    }
  }

  const handleUpload = useCallback(
    (e: any, type: string) => {
      if (selectedSection) {
        const formData = new FormData()
        formData.append("image", e.target.files[0])

        // const { msg, data: imageSrc } = await uploadImage(formData)
        // if (msg === "ok") {
        // }

        if (process.env.NODE_ENV === "development") {
          setSection({
            type: "src",
            payload:
              "https://png.pngtree.com/thumb_back/fw800/back_our/20200814/ourmid/pngtree-romantic-sky-gradient-background-png-image_392970.jpg",
            arrIndex: selectedSection.type === "thumbnail" ? 1 : 0,
          })
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
        className={cx(style.slider)}
      >
        {list.map((v, i) => (
          <SwiperSlide className={cx(style.slide)} key={`tournament_candidate_${i}`}>
            {v.actionType === "file" ? (
              <label id="file-upload" className={cx(style.btn, style["file-upload"])}>
                <input id="file-upload" multiple={false} type="file" onChange={(e) => handleUpload(e, v.value)} />
                <div className={cx(style.icon)}>
                  <FontAwesomeIcon icon={v.icon} />
                </div>
                <span>{t(v.value)}</span>
              </label>
            ) : (
              <button
                onClick={() => {
                  !isSectionList ? onClickAddSection(v.value as SectionTypes) : onClickList(v.value, v.actionType)
                }}
                className={cx(style.btn)}
              >
                <div className={cx(style.icon)}>
                  <FontAwesomeIcon icon={v.icon} />
                </div>
                <span>{t(v.value)}</span>
              </button>
            )}
          </SwiperSlide>
        ))}
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
      {activeListType === "bgColor" && <ColorPicker colorKey="bgColor" />}
      {activeListType === "textColor" && <ColorPicker colorKey="textColor" />}
      {activeListType === "ctaColor" && <ColorPicker colorKey="ctaColor" />}
    </div>
  )
}
