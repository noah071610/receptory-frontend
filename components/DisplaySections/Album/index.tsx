"use client"

import Loading from "@/components/Loading"
import { getImageUrl } from "@/config"
import { colors } from "@/config/colors"
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver"
import { useProgressiveImage } from "@/hooks/useProgressiveImage"
import { SectionType } from "@/types/Edit"
import classNames from "classNames"
import { memo, useMemo } from "react"
import { Gallery, Image, ImageExtended, ThumbnailImageProps } from "react-grid-gallery"
import style from "./style.module.scss"

const AlbumImageComponent = (props: ThumbnailImageProps<ImageExtended<Image>>) => {
  const { isIntersecting, ref } = useIntersectionObserver({
    freezeOnceVisible: true,
  })
  const status = useProgressiveImage(props.imageProps.src, isIntersecting)

  return (
    <div ref={ref}>
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
    </div>
  )
}

const cx = classNames.bind(style)

function Album({ section }: { section: SectionType }) {
  const handleClick = () => {}

  const galleryImages = useMemo(
    () =>
      section.list
        .map(({ style: { width, height }, src }) => ({ width, height, src }))
        .filter(({ width, height }) => typeof width === "number" && typeof height === "number"),
    [section.list]
  )

  return (
    <div className={cx(style["layout"])}>
      <div className={cx(style.album)}>
        {section.design === "album" ? (
          <Gallery
            thumbnailImageComponent={(props) => AlbumImageComponent(props)}
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
              <ImageComponent index={i} key={`album_${section.id}_${i}`} photo={v} section={section} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(Album)
