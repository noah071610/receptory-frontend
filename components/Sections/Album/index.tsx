"use client"

import Dropzone from "@/components/Dropzone"
import { getImageUrl } from "@/config"
import { AnimationTypes, SectionType } from "@/types/Edit"
import { getAnimation } from "@/utils/getAnimation"
import classNames from "classNames"
import { memo } from "react"
import { Gallery, ThumbnailImageProps } from "react-grid-gallery"
import style from "./style.module.scss"

const ImageComponent = (props: ThumbnailImageProps, animation: AnimationTypes) => {
  return (
    <div
      style={{
        ...props.imageProps.style,
        animation: getAnimation(animation, props.index * 180),
        opacity: animation === "none" ? 1 : 0,
      }}
    >
      <img {...(props.imageProps as any)} key={`album_${props.index}`} />
    </div>
  )
}

const cx = classNames.bind(style)

function Album({ section }: { section: SectionType }) {
  const handleClick = () => {}

  return (
    <div className={cx(style["layout"])}>
      {section.images.length > 0 ? (
        section.style === "albumStyle" ? (
          <Gallery
            thumbnailImageComponent={(props) => ImageComponent(props, section.animation)}
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
                  opacity: section.animation === "none" ? 1 : 0,
                  animation: getAnimation(section.animation, i * 200),
                  height: section.style === "gridOneStyle" ? "250px" : "200px",
                }}
                className={cx(style.photo)}
              ></div>
            ))}
          </div>
        )
      ) : (
        <Dropzone section={section} multiple={true} srcKey="images" />
      )}
      {/* <Lightbox slides={slides} open={index >= 0} index={index} close={() => setIndex(-1)} /> */}
    </div>
  )
}

export default memo(Album)
