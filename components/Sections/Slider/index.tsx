"use client"

import Dropzone from "@/components/Dropzone"
import Input from "@/components/Input"
import Textarea from "@/components/Textarea"
import { getImageUrl } from "@/config"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = classNames.bind(style)

function Slider({ section }: { section: SectionType }) {
  return (
    <div className={cx(style["slider"])}>
      {section.list.length > 0 ? (
        <Swiper spaceBetween={10} slidesPerView={2.4} className={cx(style.slider, "editor-footer-slider")}>
          {section.list.map((v, i) => (
            <SwiperSlide className={cx(style.slide)} key={`card_${section.id}_${i}`}>
              <div className={cx(style.card)}>
                <div className={cx(style["card-image"])}>
                  <div
                    style={{ background: getImageUrl({ isCenter: true, url: v.src }) }}
                    className={cx(style["image"])}
                  />
                </div>
                <div className={cx(style.content)}>
                  <Input
                    isOptional={true}
                    className={cx(style["title-input"])}
                    listIndex={i}
                    inputType="title"
                    value={v.title}
                  />
                  <Textarea
                    className={cx(style["description-input"])}
                    listIndex={i}
                    inputType="description"
                    isOptional={true}
                    value={v.description}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Dropzone height={250} section={section} srcKey="image" multiple={true} />
      )}
    </div>
  )
}
export default memo(Slider)
