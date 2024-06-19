"use client"

import IconBtn from "@/components/IconBtn"
import PageLoading from "@/components/Loading/LoadingPage"
import SwiperNavigation from "@/components/SwiperNavigation"
import { toastError } from "@/config/toast"
import { useEditorStore } from "@/store/editor"
import { SectionListTypes } from "@/types/Edit"
import { createNewSection, createNewSectionList } from "@/utils/createNewSection"
import hasString from "@/utils/helpers/hasString"
import { faCheck, faImages } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import cs from "classnames/bind"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { FreeMode } from "swiper/modules"
import { SwiperSlide } from "swiper/react"
import style from "./style.module.scss"
const cx = cs.bind(style)

export default function ImageUrlStage({ type, setIsLoading }: { type?: string; setIsLoading: (b: boolean) => void }) {
  const { t } = useTranslation(["modal"])
  const inputRef = useRef<HTMLInputElement | null>(null)
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
    homeSections,
    addSection,
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
    "homeSections",
    "addSection",
  ])
  const [currentUsedImagesArr, setCurrentUsedImagesArr] = useState(
    currentUsedImages?.map((v) => ({ src: v, isAdd: false })) ?? []
  )
  const [imageUrl, setImageUrl] = useState("")
  const [isPickCurImage, setIsPickCurImage] = useState(false)
  const [preview, setPreview] = useState("")
  const [isUrlLoading, setIsUrlLoading] = useState(false)

  const onClickUpload = () => {
    if (!type) return
    setIsLoading(true)

    switch (type) {
      case "slider":
      case "album":
        if (active.modal.payload === "add") {
          addList({
            type: type as SectionListTypes,
            valueArrForNewList: [
              {
                src: preview,
              },
            ],
          })
        } else {
          const newSection = createNewSection({ type: type as SectionListTypes, index: homeSections.length })
          newSection.list = [
            createNewSectionList(type, 0, {
              src: preview,
            }),
          ]
          addSection({
            type: type as SectionListTypes,
            payload: newSection,
          })
        }

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
    setIsUrlLoading(true)
    if (imageUrl.length > 150) {
      setImageUrl("")
      setPreview("")
      return toastError("tooMuchLongImageUrl")
    }
    const image = new Image()
    image.src = imageUrl
    image.onload = () => {
      setTimeout(() => {
        setPreview(imageUrl)
        setIsUrlLoading(false)
      }, 700)
    }
    image.onerror = () => {
      setTimeout(() => {
        toastError("unknownImage")
        setIsUrlLoading(false)
      }, 700)
    }
  }

  const onClickFocusUrlInput = () => {
    if (inputRef?.current) {
      inputRef?.current.focus()
    }
  }

  return (
    <>
      <div className={cx("preview-wrapper")}>
        {!hasString(preview) ? (
          <div onClick={onClickFocusUrlInput} className={cx("upload-zone")}>
            <div className={cx("icon")}>
              <FontAwesomeIcon icon={faImages} />
              <label>{t("imageUrlUpload")}</label>
            </div>
          </div>
        ) : (
          <div className={cx("image")}>
            <img src={preview} alt="preview" />
          </div>
        )}
        <PageLoading isLoading={isUrlLoading} isAbsolute={true} />
      </div>

      {!isPickCurImage && (
        <div className={cx("url-input")}>
          <input ref={inputRef} placeholder={t("enterUrl")} type="text" value={imageUrl} onChange={onChangeUrl} />
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
