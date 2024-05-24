"use client"

import AddBtn from "@/components/AddBtn"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"

import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { getAnimation } from "@/utils/styles/getAnimation"
import getContrastTextColor from "@/utils/styles/getContrastTextColor"
import cs from "classNames/bind"
import { memo, useMemo } from "react"
import { useTranslation } from "react-i18next"
import "swiper/css/thumbs"
import { FreeMode } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import style from "./style.module.scss"

const cx = cs.bind(style)

const BasicSlider = ({
  section,
  isDisplayMode,
  textColor,
  onDelete,
  width,
  height,
}: {
  section: SectionType
  isDisplayMode?: boolean
  textColor?: string
  onDelete: (i: number) => void
  width: string
  height: string
}) => {
  return (
    <Swiper spaceBetween={7} freeMode={true} slidesPerView={"auto"} modules={[FreeMode]} className={cx("slider")}>
      {section.list.map((v, i) => (
        <SwiperSlide style={{ width }} className={cx("slide", section.design)} key={`card_${section.id}_${i}`}>
          <div
            style={{
              ...getAnimation({ type: section.style.animation, delay: i * 150 }),
            }}
            className={cx("slide-inner")}
          >
            {!isDisplayMode && <DeleteBtn srcKey="list" deleteEvent={onDelete} listIndex={i} />}
            <div style={{ height }} className={cx("card-image")}>
              {/* <div style={{ background: getImageUrl({  url: v.src }) }} className={cx("image")} /> */}
              <picture className={cx("image")}>
                <img src={v.src} alt="image" />
              </picture>
            </div>
            <div className={cx("content")}>
              {isDisplayMode ? (
                <>
                  {hasString(v.data.title) && (
                    <h2 style={{ color: textColor }} className={cx("title")}>
                      {v.data.title}
                    </h2>
                  )}
                  {hasString(v.data.description) && (
                    <p style={{ color: textColor }} className={cx("description")}>
                      {v.data.description}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <Input
                    style={{ color: textColor }}
                    type="input"
                    isOptional={true}
                    dataKey={"title"}
                    className={cx("title-input")}
                    listIndex={i}
                    inputType="title"
                    value={v.data.title}
                    section={section}
                  />
                  <Input
                    style={{ color: textColor }}
                    type="textarea"
                    listIndex={i}
                    className={cx("description-input")}
                    dataKey={"description"}
                    inputType="description"
                    isOptional={true}
                    value={v.data.description}
                    section={section}
                  />
                </>
              )}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

function Slider({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()
  const { deleteList } = useEditorStore()

  const textColor = useMemo(
    () =>
      section.design === "card" || section.design === "circle"
        ? undefined
        : getContrastTextColor(section.style.backgroundColor ?? "rgba(0,0,0,0)"),
    [section.style.backgroundColor, section.design]
  )

  const onDelete = (i: number) => {
    if (section.list.length <= 1) {
      return toastError("atLeastOneList")
    }
    deleteList({ targetIndex: i })
  }
  const size = section.options.imageSize
  const { width, height } =
    section.design === "card"
      ? { width: size === "width" ? "300px" : "200px", height: size === "width" ? "200px" : "270px" }
      : section.design === "circle"
        ? { width: "150px", height: "100%" }
        : { width: size === "width" ? "300px" : "250px", height: size === "width" ? "170px" : "400px" }

  return (
    <div className={cx("layout", { isDisplayMode: isDisplayMode })}>
      {section.list.length > 0 && (
        <div style={{ background: section.style.backgroundColor }} className={cx("slider-layout")}>
          <BasicSlider
            width={width}
            height={height}
            onDelete={onDelete}
            textColor={textColor}
            section={section}
            isDisplayMode={isDisplayMode}
          />
        </div>
      )}
      {!isDisplayMode && <AddBtn section={section} type="slider-image" />}
    </div>
  )
}
export default memo(Slider)
