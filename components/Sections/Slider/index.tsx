"use client"

import AddBtn from "@/components/AddBtn"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"

import { toastError } from "@/config/toast"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { useProgressiveImage } from "@/hooks/useProgressiveImage"
import { useEditorStore } from "@/store/editor"
import { SectionListType, SectionType } from "@/types/Edit"
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

const Card = ({
  section,
  isDisplayMode,
  textColor,
  onDelete,
  height,
  list,
  i,
}: {
  section: SectionType
  isDisplayMode?: boolean
  textColor?: string
  onDelete: (i: number) => void
  height: string
  list: SectionListType
  i: number
}) => {
  const { ref, isIntersecting } = useIntersectionObserver()

  const status = useProgressiveImage(list.src, isIntersecting)

  return (
    <div
      style={{
        ...getAnimation({ type: section.style.animation, delay: i * 150 }),
      }}
      ref={ref}
      className={cx("slide-inner")}
    >
      {!isDisplayMode && <DeleteBtn srcKey="list" deleteEvent={onDelete} listIndex={i} />}
      <div className={cx("card-background")}>
        <div style={{ height }} className={cx("card-image")}>
          <picture className={cx("image")}>
            <img src={list.src} alt="image" />
          </picture>
        </div>
      </div>
      <div className={cx("content")}>
        {isDisplayMode ? (
          <>
            {hasString(list.data.title) && (
              <h2 style={{ color: textColor }} className={cx("title")}>
                {list.data.title}
              </h2>
            )}
            {hasString(list.data.description) && (
              <p style={{ color: textColor }} className={cx("description")}>
                {list.data.description}
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
              inputType="titleInput"
              value={list.data.title}
              section={section}
            />
            <Input
              style={{ color: textColor }}
              type="textarea"
              listIndex={i}
              className={cx("description-input")}
              dataKey={"description"}
              inputType="descriptionInput"
              isOptional={true}
              value={list.data.description}
              section={section}
            />
          </>
        )}
      </div>
    </div>
  )
}

const BasicSlider = ({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) => {
  const { deleteList } = useEditorStore(["deleteList"])

  const { t } = useTranslation(["edit-page"])

  const textColor = useMemo(
    () =>
      section.design === "card" || section.design === "circle"
        ? undefined
        : getContrastTextColor(section.style.backgroundColor ?? "rgba(0,0,0,0)"),
    [section.style.backgroundColor, section.design]
  )

  const onDelete = (i: number) => {
    if (section.list.length <= 1) {
      // atLeastOneList
      return toastError("atLeastOneList")
    }
    deleteList({ targetIndex: i })
  }

  const size = section.options.imageSize
  const { width, height } =
    section.design === "card"
      ? { width: size === "width" ? "230px" : "200px", height: size === "width" ? "150px" : "270px" }
      : section.design === "circle"
        ? { width: "150px", height: "100%" }
        : { width: size === "width" ? "300px" : "250px", height: size === "width" ? "170px" : "400px" }

  return (
    <Swiper spaceBetween={7} freeMode={true} slidesPerView={"auto"} modules={[FreeMode]} className={cx("slider")}>
      {section.list.map((v, i) => (
        <SwiperSlide key={`card_${section.id}_${i}`} style={{ width }} className={cx("slide", section.design)}>
          <Card
            height={height}
            isDisplayMode={isDisplayMode}
            textColor={textColor}
            section={section}
            onDelete={onDelete}
            i={i}
            list={v}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

function Slider({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation(["edit-page"])
  return (
    <div className={cx("layout", { isDisplayMode: isDisplayMode })}>
      {section.list.length > 0 && (
        <div style={{ background: section.style.backgroundColor }} className={cx("slider-layout")}>
          <BasicSlider section={section} isDisplayMode={isDisplayMode} />
        </div>
      )}
      {!isDisplayMode && <AddBtn section={section} type="slider-image" />}
    </div>
  )
}
export default memo(Slider)
