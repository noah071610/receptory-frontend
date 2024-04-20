"use client"

import { useTranslation } from "@/i18n/client"
import { sectionArr, useEditStore } from "@/store/edit"
import { SectionTypes } from "@/types/Edit"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import classNames from "classNames"
import { useParams } from "next/navigation"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

export default function AddSection() {
  const { lang } = useParams()
  const { addSection } = useEditStore()
  const { t } = useTranslation()
  const onClickAddSection = (type: SectionTypes) => {
    addSection(type)
  }
  return (
    <div className={cx(style.add)}>
      <Swiper
        spaceBetween={14}
        slidesPerView={"auto"}
        freeMode={true}
        modules={[FreeMode]}
        className={cx(style.slider)}
      >
        {sectionArr.map((v, i) => (
          <SwiperSlide className={cx(style.slide)} key={`tournament_candidate_${i}`}>
            <button onClick={() => onClickAddSection(v.value)} className={cx(style.btn)}>
              <div className={cx(style.icon)}>
                <FontAwesomeIcon icon={v.icon} />
              </div>
              <span>{t(v.value)}</span>
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
