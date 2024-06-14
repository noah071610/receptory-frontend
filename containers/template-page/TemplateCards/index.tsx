"use client"

import { _url } from "@/config"
import { TemplateCardType, TemplateCategoryType } from "@/types/Template"
import { getAnimation } from "@/utils/styles/getAnimation"
import cs from "classNames/bind"
import Image from "next/image"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function TemplateCards({
  cards,
  i,
  data,
}: {
  cards: TemplateCardType[]
  i: number
  data: TemplateCategoryType[]
}) {
  const onClickCard = (pageId: string) => {
    window.open(`${_url.client}/template/${pageId}`)
  }

  return (
    <Swiper className={cx("slider")} slidesPerView={"auto"} modules={[FreeMode]}>
      {cards.map(({ title, description, lang: pageLang, thumbnail, pageId }, j) => (
        <SwiperSlide className={cx("slide")} key={`card-${i}-${j}`}>
          <div
            style={getAnimation({
              type: "fadeUp",
              delay: (i - 1 >= 0 ? data[i - 1].cards.length * 100 : 0) + 100 * j,
            })}
            onClick={() => onClickCard(pageId)}
            className={cx("card")}
          >
            <div className={cx("list-main")}>
              <div className={cx("label")}>
                <div className={cx("label-right")}>
                  <Image src={`/images/icons/${pageLang}.png`} width={20} height={20} alt="card-flag" />
                  <span>Template</span>
                </div>
              </div>
              <picture>
                <img className={cx("thumbnail")} src={thumbnail ? thumbnail : "/images/noImage.png"} alt="thumbnail" />
              </picture>
              <div className={cx("list-content")}>
                <div className={cx("title")}>
                  <h2>{title}</h2>
                  <p>{description ?? ""}</p>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
