"use client"

import AddBtn from "@/components/AddBtn"
import ImageDelete from "@/components/ImageDelete"
import Input from "@/components/Input"
import Loading from "@/components/Loading"
import { getImageUrl } from "@/config"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { useProgressiveImage } from "@/hooks/useProgressiveImage"
import { useTranslation } from "@/i18n/client"
import { useEditorStore } from "@/store/editor"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo, useCallback, useMemo } from "react"
import { Gallery, Image, ImageExtended, ThumbnailImageProps } from "react-grid-gallery"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const AlbumImageComponent = ({
  props,
  section,
  isDisplayMode,
}: {
  props: ThumbnailImageProps<ImageExtended<Image>>
  section: SectionType
  isDisplayMode?: boolean
}) => {
  // const { isIntersecting, ref } = useIntersectionObserver({
  //   freezeOnceVisible: true,
  // })
  // const status = useProgressiveImage(props.imageProps.src, isIntersecting)

  return (
    <div>
      {!isDisplayMode && <ImageDelete section={section} srcKey="list" listIndex={props.index} />}
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
    <div className={cx(style["photo-wrapper"])}>
      <picture
        ref={ref}
        style={{
          height: section.design === "gridOne" ? "150px" : "200px",
        }}
        className={cx(style.photo)}
      >
        <div style={{ background: getImageUrl({ isCenter: true, url: photo.src }) }} className={cx(style.background)} />
        <img style={{ objectFit: section.style.backgroundSize }} src={photo.src} alt={photo.src} />
        {status === "loading" && <Loading />}
        {!isDisplayMode && <ImageDelete section={section} srcKey="list" listIndex={index} />}
      </picture>
      <Input
        section={section}
        className={cx(style.title)}
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
  const { setActive } = useEditorStore()
  const { t } = useTranslation()

  const galleryImages = useMemo(
    () =>
      section.list
        .map(({ style: { width, height }, src, value }) => ({ width, height, src, value }))
        .filter(({ width, height }) => typeof width === "number" && typeof height === "number"),
    [section.list]
  )

  const comp = useCallback(
    (props: any) => {
      return <AlbumImageComponent props={props} section={section} isDisplayMode={isDisplayMode} />
    },
    [section, isDisplayMode]
  )

  return (
    <div className={cx(style["layout"])}>
      {galleryImages.length > 0 ? (
        <div className={cx(style.album)}>
          {section.design === "basic" ? (
            <Gallery
              thumbnailImageComponent={(props) => comp(props)}
              images={galleryImages as any}
              enableImageSelection={false}
              onSelect={undefined}
              onClick={undefined}
            />
          ) : (
            <div
              style={{ gridTemplateColumns: `repeat(${section.design === "gridOne" ? 1 : 2},1fr)` }}
              className={cx(style.grid, style[section.design])}
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
        <div
          style={{ background: getImageUrl({ isCenter: true, url: "/images/noImage.png" }) }}
          className={cx(style.noImage)}
        >
          <span>{t("noImage")}</span>
        </div>
      )}

      {!isDisplayMode && <AddBtn section={section} type="album-image" />}
    </div>
  )
}

export default memo(Album)
