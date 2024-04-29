"use client"

import { SectionType } from "@/types/Edit"
import hasString from "@/utils/hasString"
import classNames from "classNames"
import { memo, useMemo } from "react"
import style from "./style.module.scss"

const cx = classNames.bind(style)

function Map({ section }: { section: SectionType }) {
  const mapCode = useMemo(() => {
    if (hasString(section.value) && section.value.includes('<iframe src="https://www.google.com/maps/embed?pb=')) {
      let temp = section.value
      const srcRegex = /<iframe\s+src="(.+?)"/
      const match = temp.match(srcRegex)

      // 추출된 src 속성 값
      temp = match ? match[1] : ""
      if (temp) {
        return temp
      } else {
        return ""
      }
    } else {
      return ""
    }
  }, [section.value])

  return (
    <div className={cx(style["map"])}>
      {mapCode ? (
        <iframe
          className={cx(style.iframe)}
          src={mapCode}
          allowFullScreen={true}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      ) : (
        <div className={cx(style.empty)}></div>
      )}
    </div>
  )
}

export default memo(Map)
