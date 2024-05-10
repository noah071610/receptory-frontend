"use client"

import AddBtn from "@/components/AddBtn"
import DeleteBtn from "@/components/DeleteBtn"
import Input from "@/components/Input"
import Loading from "@/components/Loading"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { useProgressiveImage } from "@/hooks/useProgressiveImage"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import { getImageUrl } from "@/utils/helpers/getImageUrl"
import cs from "classNames/bind"
import { memo, useMemo } from "react"
import { Gallery, Image, ImageExtended, ThumbnailImageProps } from "react-grid-gallery"
import style from "./style.module.scss"
const cx = cs.bind(style)

const AlbumImageComponent = ({
  props,
  isDisplayMode,
}: {
  props: ThumbnailImageProps<ImageExtended<Image>>
  isDisplayMode?: boolean
}) => {
  return (
    <div>
      {!isDisplayMode && <DeleteBtn srcKey="list" listIndex={props.index} />}
      <img
        {...(props.imageProps as any)}
        key={`album_${props.index}`}
        style={{ ...props.imageProps.style, cursor: "default" }}
      />
    </div>
  )
}

const ImageComponent = ({
  photo,
  section,
  index,
  isDisplayMode,
}: {
  photo: { width?: number; height?: number; src: string; value: any }
  section: SectionType
  index: number
  isDisplayMode?: boolean
}) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    freezeOnceVisible: true,
  })
  const status = useProgressiveImage(photo.src, isIntersecting)

  return (
    <div className={cx("photo-wrapper")}>
      <picture
        ref={ref}
        style={{
          height: section.design === "gridOne" ? "150px" : "200px",
        }}
        className={cx("photo")}
      >
        <div style={{ background: getImageUrl({ url: photo.src }) }} className={cx("background")} />
        <img src={photo.src} alt={photo.src} />
        {status === "loading" && <Loading />}
        {!isDisplayMode && <DeleteBtn srcKey="list" listIndex={index} />}
      </picture>
      <Input
        type="input"
        className={cx("title")}
        inputType="album"
        displayMode={isDisplayMode && "p"}
        isOptional={true}
        listIndex={index}
        value={photo.value}
      />
    </div>
  )
}

function Album({ section, isDisplayMode }: { section: SectionType; isDisplayMode?: boolean }) {
  const { t } = useTranslation()

  const galleryImages = useMemo(
    () =>
      section.list
        .map(({ style: { width, height }, src, value }) => ({ width, height, src, value }))
        .filter(({ width, height }) => typeof width === "number" && typeof height === "number"),
    [section.list]
  )

  return (
    <div className={cx("layout")}>
      {galleryImages.length > 0 ? (
        <div className={cx("album")}>
          {section.design === "basic" ? (
            <Gallery
              thumbnailImageComponent={(props) => <AlbumImageComponent props={props} isDisplayMode={isDisplayMode} />}
              images={galleryImages as any}
              enableImageSelection={false}
              onSelect={undefined}
              onClick={undefined}
            />
          ) : (
            <div
              style={{ gridTemplateColumns: `repeat(${section.design === "gridOne" ? 1 : 2},1fr)` }}
              className={cx("grid", section.design)}
            >
              {galleryImages.map((v, i) => (
                <ImageComponent
                  isDisplayMode={isDisplayMode}
                  key={`album_${section.id}_${i}`}
                  index={i}
                  photo={v}
                  section={section}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: getImageUrl({ url: "/images/noImage.png" }) }} className={cx("noImage")}>
          <span>{t("noImage")}</span>
        </div>
      )}

      {!isDisplayMode && <AddBtn section={section} type="album-image" />}
    </div>
  )
}

export default memo(Album)
