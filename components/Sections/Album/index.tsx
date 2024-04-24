"use client"

import Dropzone from "@/components/Dropzone"
import ImageDelete from "@/components/ImageDelete"
import { getImageUrl } from "@/config"
import { SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import classNames from "classNames"
import { memo, useEffect, useState } from "react"
import { Gallery, ThumbnailImageProps } from "react-grid-gallery"
import style from "./style.module.scss"

const ImageComponent = (props: ThumbnailImageProps, section: SectionType) => {
  return (
    <div
      style={{
        ...props.imageProps.style,
        ...getAnimation(section.animation, props.index * 180),
      }}
    >
      <ImageDelete section={section} srcKey="images" listIndex={props.index} />
      <img {...(props.imageProps as any)} key={`album_${props.index}`} />
    </div>
  )
}

const cx = classNames.bind(style)

function Album({ section }: { section: SectionType }) {
  const handleClick = () => {}
  const [thumbsSwiper, setThumbsSwiper] = useState(null)

  useEffect(() => {
    setThumbsSwiper(null)
  }, [section.style])

  return (
    <div className={cx(style["layout"])}>
      <div className={cx(style.album)}>
        {section.style === "albumStyle" ? (
          <Gallery
            thumbnailImageComponent={(props) => ImageComponent(props, section)}
            images={section.images}
            onClick={handleClick}
            enableImageSelection={false}
          />
        ) : (
          <div
            style={{ gridTemplateColumns: `repeat(${section.style === "gridOneStyle" ? 1 : 2},1fr)` }}
            className={cx(style.grid)}
          >
            {section.images.map((v, i) => (
              <div
                key={`album_${section.id}_${i}`}
                style={{
                  background: getImageUrl({ isCenter: true, url: v.src }),
                  height: section.style === "gridOneStyle" ? "250px" : "200px",
                  ...getAnimation(section.animation, i * 200),
                }}
                className={cx(style.photo)}
              >
                <ImageDelete section={section} srcKey="images" listIndex={i} />
              </div>
            ))}
          </div>
        )}
      </div>
      <Dropzone section={section} multiple={true} srcKey="images" />
      {/* <Lightbox slides={slides} open={index >= 0} index={index} close={() => setIndex(-1)} /> */}
    </div>
  )
}

export default memo(Album)
