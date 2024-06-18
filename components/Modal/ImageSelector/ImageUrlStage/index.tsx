"use client"

import IconBtn from "@/components/IconBtn"
import SwiperNavigation from "@/components/SwiperNavigation"
import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { SectionListTypes } from "@/types/Edit"
import hasString from "@/utils/helpers/hasString"
import { faCheck } from "@fortawesome/free-solid-svg-icons"
import cs from "classnames/bind"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function ImageUrlStage({ type, setIsLoading }: { type?: string; setIsLoading: (b: boolean) => void }) {
  const { t } = useTranslation(["modal"])
  const {
    active,
    setStyle,
    setPageEmbedOption,
    setSrc,
    setList,
    setOptions,
    currentUsedImages,
    saveSectionHistory,
    addList,
    setActive,
  } = useEditorStore([
    "active",
    "setStyle",
    "setPageEmbedOption",
    "setSrc",
    "setList",
    "setOptions",
    "currentUsedImages",
    "saveSectionHistory",
    "addList",
    "setActive",
  ])
  const [currentUsedImagesArr, setCurrentUsedImagesArr] = useState(
    currentUsedImages?.map((v) => ({ src: v, isAdd: false })) ?? []
  )
  const [imageUrl, setImageUrl] = useState("")
  const [isPickCurImage, setIsPickCurImage] = useState(false)
  const [preview, setPreview] = useState("")

  const onClickUpload = () => {
    if (!type) return
    setIsLoading(true)

    switch (type) {
      case "slider":
      case "album":
        addList({
          type: type as SectionListTypes,
          valueArrForNewList: [
            {
              src: preview,
            },
          ],
        })
        break
      case "thumbnail":
      case "callout":
        setSrc({
          payload: preview,
        })
        if (type === "callout") {
          setOptions({ payload: "image", key: "imageStatus" })
        }
        break
      case "select":
      case "choices":
        setList({
          index: active.modal.payload,
          key: "src",
          payload: preview,
        })
        setList({
          index: active.modal.payload,
          key: "options",
          payload: { imageStatus: "image" },
        })
        break
      case "background":
        setStyle({
          key: "background",
          payload: preview,
        })
        break
      case "embed":
        setPageEmbedOption({
          type: "src",
          payload: preview,
        })
        saveSectionHistory()
        break
      default:
        break
    }
    setActive({ payload: { type: null, payload: null }, key: "modal" })
    setIsLoading(false)
  }

  const onChangeUrl = (e: any) => {
    if (e.target.value.length <= 0) {
      setPreview("")
    }
    setImageUrl(e.target.value)
  }

  const onClickCurImage = (src: string, i: number, isAdd: boolean) => {
    if (isAdd) {
      setPreview("")
      setIsPickCurImage(false)
    } else {
      setIsPickCurImage(true)
      setPreview(src)
    }

    // 단수 선택이면 한녀석만 토글하고 나머지는 다 false로 해주자
    setCurrentUsedImagesArr((prev) => {
      return prev.map((v, j) => ({ ...v, isAdd: i === j ? !v.isAdd : false }))
    })
  }

  const checkUrl = () => {
    if (imageUrl.trim().length <= 0) {
      return
    }
    if (preview === imageUrl) {
      return
    }
    if (imageUrl.length > 150) {
      setImageUrl("")
      setPreview("")
      return toastError("tooMuchLongImageUrl")
    }
    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      setPreview(imageUrl)
    }
    image.onerror = () => {
      // todo:
      toastError("unknownImage")
    }
  }
  return (
    <>
      <div className={cx("image")}>
        <img src={hasString(preview) ? preview : "/images/noImage.png"} alt="preview" />
      </div>
      {!isPickCurImage && (
        <div className={cx("url-input")}>
          <input placeholder={t("enterUrl")} type="text" value={imageUrl} onChange={onChangeUrl} />
          <div className={cx("check-url")}>
            <IconBtn iconClassName={cx("icon")} icon={faCheck} onclick={checkUrl} />
          </div>
        </div>
      )}
      {currentUsedImages.length > 0 && (
        <>
          <h2>{t("currentUsedImages")}</h2>
          <SwiperNavigation
            perSlideView={4}
            className={cx("slider")}
            spaceBetween={5}
            slidesPerView={"auto"}
            modules={[FreeMode]}
            prevArrowClassName={cx("prev")}
            nextArrowClassName={cx("next")}
          >
            {currentUsedImagesArr.map(({ src, isAdd }, i) => {
              return (
                <SwiperSlide className={cx("curImage-slide")} key={`thumb_main_${i}`}>
                  <button
                    onClick={() => onClickCurImage(src, i, isAdd)}
                    className={cx("curImage-slide-btn", { isAdd: isAdd })}
                  >
                    <img src={src ?? ""} alt={`curImage_${i}`} />
                  </button>
                </SwiperSlide>
              )
            })}
          </SwiperNavigation>
        </>
      )}
      {preview.length > 0 && (
        <button onClick={onClickUpload} className={cx("upload")}>
          <span>{t("totalUpload", { number: 1 })}</span>
        </button>
      )}
    </>
  )
}
