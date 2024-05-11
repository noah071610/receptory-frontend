"use client"

import { SwiperNavigation } from "@/components/SwiperNavigation"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classNames/bind"
import { memo } from "react"
import { isMobile } from "react-device-detect"
import { SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

function OptionRatio({
  targetKey,
  optionsArr,
  isDesign,
  section,
}: {
  targetKey: string
  isDesign?: boolean
  optionsArr: any[]
  section: SectionType
}) {
  const { selectedSection, setDesign, setSelectedSection, setOptions, saveSectionHistory } = useEditorStore()
  const { t } = useTranslation()
  const target = isDesign ? section.design : section.options[targetKey]

  const onClickRatio = (v: any) => {
    if (selectedSection?.id !== section.id) {
      setSelectedSection({ payload: section })
    }
    if (isDesign) return setDesign({ payload: v })
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
        {optionsArr.map((v) => (
          <SwiperSlide className={cx("slide")} key={`options-${section.id}-${v}`}>
            <button onClick={() => onClickRatio(v)} className={cx("btn", { active: target === v })}>
              <div className={cx("icon")}>
                <FontAwesomeIcon icon={faCheckSquare} />
              </div>
              <span className={cx("name")}>{v}</span>
            </button>
          </SwiperSlide>
        ))}
      </SwiperNavigation>
      <div className={cx("content")}></div>
    </div>
  )
}
export default memo(OptionRatio)
