"use client"

import AddBtn from "@/components/AddBtn"
import ImageDelete from "@/components/ImageDelete"
import Loading from "@/components/Loading"
import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { useProgressiveImage } from "@/hooks/useProgressiveImage"
import { useTranslation } from "@/i18n/client"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo, useMemo } from "react"
import { Gallery, Image, ImageExtended, ThumbnailImageProps } from "react-grid-gallery"
import style from "./style.module.scss"
const cx = classNames.bind(style)

const AlbumImageComponent = (props: ThumbnailImageProps<ImageExtended<Image>>, section: SectionType) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    freezeOnceVisible: true,
  })
  const status = useProgressiveImage(props.imageProps.src, isIntersecting)

  return (
    <div ref={ref}>
      <ImageDelete section={section} srcKey="list" listIndex={props.index} />
      {status === "loading" && (
        <div style={{ height: props.imageProps.style.height }} className={cx(style["album-loader"])}>
          <Loading />
        </div>
      )}
      {status === "success" && <img {...(props.imageProps as any)} key={`album_${props.index}`} />}
    </div>
  )
}

const ImageComponent = ({
  photo,
  section,
  index,
}: {
  photo: { width?: number; height?: number; src: string }
  section: SectionType
  index: number
}) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    freezeOnceVisible: true,
  })
  const status = useProgressiveImage(photo.src, isIntersecting)

  return (
    <div
      ref={ref}
      style={{
        background: status === "success" ? getImageUrl({ isCenter: true, url: photo.src }) : colors.graySoft,
        height: section.design === "gridOne" ? "250px" : "200px",
      }}
      className={cx(style.photo)}
    >
      {status === "loading" && <Loading />}
      <ImageDelete section={section} srcKey="list" listIndex={index} />
    </div>
  )
}

function Album({ section }: { section: SectionType }) {
  const handleClick = () => {}
  const { t } = useTranslation()

  const galleryImages = useMemo(
    () =>
      section.list
        .map(({ style: { width, height }, src }) => ({ width, height, src }))
        .filter(({ width, height }) => typeof width === "number" && typeof height === "number"),
    [section.list]
  )

  return (
    <div className={cx(style["layout"])}>
      {galleryImages.length > 0 ? (
        <div className={cx(style.album)}>
          {section.design === "basic" ? (
            <Gallery
              thumbnailImageComponent={(props) => AlbumImageComponent(props, section)}
              images={galleryImages as any}
              onClick={handleClick}
              enableImageSelection={false}
            />
          ) : (
            <div
              style={{ gridTemplateColumns: `repeat(${section.design === "gridOne" ? 1 : 2},1fr)` }}
              className={cx(style.grid)}
            >
              {galleryImages.map((v, i) => (
                <ImageComponent key={`album_${section.id}_${i}`} index={i} photo={v} section={section} />
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

      <AddBtn section={section} type="album-image" />
      {/* <Lightbox slides={slides} open={index >= 0} index={index} close={() => setIndex(-1)} /> */}
    </div>
  )
}

export default memo(Album)
