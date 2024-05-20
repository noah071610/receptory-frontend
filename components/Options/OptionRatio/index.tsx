"use client"

import { SwiperNavigation } from "@/components/SwiperNavigation"
import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { IconDefinition, faCheckSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import Image from "next/image"
import { memo } from "react"
import { isMobile } from "react-device-detect"
import { useTranslation } from "react-i18next"
import { SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function OptionRatio({
  targetKey,
  optionsArr,
  isDesign,
  section,
  isMultiple,
}: {
  targetKey: string
  isDesign?: boolean
  optionsArr: { value: string; icon?: IconDefinition; src?: string }[]
  section: SectionType
  isMultiple?: boolean
}) {
  const {
    selectedSection,
    setDesign,
    addCollection,
    deleteCollection,
    setSelectedSection,
    setOptions,
    saveSectionHistory,
  } = useEditorStore()
  const { t } = useTranslation()
  const target = isDesign ? section.design : section.options[targetKey]
  const collection = section.collection

  const onClickRatio = (v: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    if (isMultiple) {
      if (collection.findIndex((k) => k.key === v) >= 0) {
        if (collection.length - 1 <= 0) {
          return toastError("atLeastOneList")
        }
        deleteCollection({ targetKey: v })
      } else {
        addCollection({ payload: { key: v, link: "" } })
      }
      return
    }
    if (isDesign) return setDesign({ payload: v }) // 디자인은 스토어 내부에서 히스토리 저장
    setOptions({ payload: v, key: targetKey })
    saveSectionHistory()
  }

  return (
    <div className={cx("layout")}>
      <h4>
        <span>{t(targetKey)}</span>
      </h4>
      <SwiperNavigation
        perSlideView={2}
        className={cx("slider")}
        spaceBetween={5}
        slidesPerView={"auto"}
        prevArrowClassName={cx("prev")}
        nextArrowClassName={cx("next")}
        isSingle={!isMobile && optionsArr.length <= 4}
      >
        {optionsArr.map(({ value, icon, src }) => (
          <SwiperSlide className={cx("slide")} key={`options-${section.id}-${value}`}>
            <button
              onClick={() => onClickRatio(value)}
              className={cx("btn", {
                active: isMultiple ? collection.findIndex((v) => v.key === value) >= 0 : target === value,
              })}
            >
              {!src && (
                <div className={cx("icon")}>
                  <FontAwesomeIcon icon={icon ?? faCheckSquare} />
                </div>
              )}
              {src && <Image width={20} height={20} src={src} alt={value} />}
              <span className={cx("name")}>{value}</span>
            </button>
          </SwiperSlide>
        ))}
      </SwiperNavigation>
    </div>
  )
}
export default memo(OptionRatio)
